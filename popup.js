// Grab elements from popup.html
const listOfClips = document.getElementById('list-of-clips');
const saveButton = document.getElementById('save-btn');
const deleteButton = document.getElementById('delete-btn');

// Set up pouchDB
const db = new PouchDB('tabs');

/* 

// Uncomment this section in order to clean up all content in the database

db.destroy().then(response => {
  alert(JSON.stringify(response));
});

*/

// This function saves the currently opened tab to the database when the user clicks on the "save" button. Also, due to the fact that a call to chrome.tabs.query returns an object that is contained WITHIN an array, we can only access the properties of the returned object by referencing the zero index of the array.
function saveTabToDatabase() {
  // store tab data in an object
  chrome.tabs.query({ active: true, currentWindow: true }, result => {
    const currentTab = {
      _id: new Date().toISOString(),
      title: result[0].title,
      url: result[0].url
    };

    // store object in PouchDB
    db.put(currentTab, (err, result) => {
      if (!err) {
        console.log('Save to database was successful');
      } else if (err) {
        alert(JSON.stringify(err));
      }
    });

    // Need to pass in the unique ID of the saved tab as an argument so we can fetch it from the DB and append it to the popup window.
    appendTab(currentTab._id);
  });
}

// This function isn't working??
function removeTabFromDatabase() {
  alert('hello');
}

// Retrieve all saved tabs and display them in the popup window WHEN IT IS OPENED by the user.
function displayClip() {
  db.allDocs({ include_docs: true })
    .then(result => {
      const tabsArray = result.rows;

      if (tabsArray.length !== 0) {
        tabsArray.forEach(item => {
          const data = {
            title: item.doc.title,
            url: item.doc.url,
            id: item.doc._id
          };

          injectHTML(data);
        });

        // setDeleteAttribute();
      }
    })
    .catch(err => {
      alert(err);
    });
}

// A freshly saved tab needs to be displayed immediately after being saved to the database. Called by saveTabToDatabase().
function appendTab(id) {
  db.get(id).then(doc => {
    const { title, url, _id } = doc;
    const data = {
      title,
      url,
      id: _id
    };

    injectHTML(data);
  });
}

// To stay DRY I need a function that carries out the task of injecting HTML into the "listOfClips" div, this function will be called by displayClip() and appendTab()
function injectHTML(data) {
  const { title, url, id } = data;

  let a = document.createElement('a');
  let btn = document.createElement('button');
  let aText = document.createTextNode(title);
  let btnText = document.createTextNode('Delete');

  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  btn.setAttribute('id', 'delete-btn');
  btn.setAttribute('key', id);

  a.appendChild(aText);
  btn.appendChild(btnText);

  listOfClips.appendChild(a);
  listOfClips.appendChild(btn);

  // Try putting this here?? --doesn't work here. need to find a solution
  setDeleteAttribute();
}

// Define the logic that deploys when "save" button is clicked
saveButton.onclick = () => {
  saveTabToDatabase();
};

// Define the logic that executes when "delete" button is clicked, conditional statement required because the function will run before deleteButton is defined.

function setDeleteAttribute() {
  if (deleteButton) {
    deleteButton.onclick = () => {
      alert('hello');
    };
  }
}

// This function should run every time the popup window is opened
displayClip();
