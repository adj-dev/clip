// Populate list of tabs once popup is opened
manageList();

// Create a constructor function for a Clip object, which will be the format used to store each saved tab
function Clip(_id, title, url) {
  this._id = _id;
  this.title = title;
  this.url = url;
}

function createEmptyListMessage(p) {
  const message = document.createTextNode('Clip is empty.');
  const elementClass = document.createAttribute('class');

  elementClass.value = 'empty-clip';
  p.setAttributeNode(elementClass);
  p.appendChild(message);
  listOfClips.appendChild(p);
}

// This function manages the list of saved tabs on the popup
function manageList() {
  const p = document.createElement('p');

  if (globalDatabase.length === 0) {
    createEmptyListMessage(p);
  } else {
    populateList(globalDatabase);
  }
}

function populateList(db) {
  const a = document.createElement('a');
  const text = document.createTextNode(JSON.stringify(db.tab.title));

  a.href = JSON.stringify(db.tab.url);
  a.appendChild(text);

  listOfClips.appendChild(a);
}

function addToClip() {
  // need to get info such as page title and url
  // NOTE: the callback on chrome.tabs.query returns an array of objects, so in order to gain direct access to the object values we need to enter into the array. So we use tabs[0] in order to gain access.
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const _id = new Date().toISOString();
    const title = tabs[0].title;
    const url = tabs[0].url;

    // Create a new Clip with the provided data and push it into the global database array
    globalDatabase.push(new Clip(_id, title, url));
  });
}

{"title":"Extensions","url":"chrome://extensions/","_id":"2019-02-23T00:48:00.413Z","_rev":"1-e90571308fc77270623cbc32b769c700"}
