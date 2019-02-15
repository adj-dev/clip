// Grab elements from popup.html
const listOfClips = document.getElementById('list-of-clips');
const saveButton = document.getElementById('save-button');

// Add content to listOfClips div.
const p = document.createElement('p');

function createEmptyListMessage() {
  const message = document.createTextNode('Clip is empty.');
  const elementClass = document.createAttribute('class');

  elementClass.value = 'empty-clip';
  p.setAttributeNode(elementClass);
  p.appendChild(message);
  listOfClips.appendChild(p);
}

// Eventually will use a conditional statement here.
createEmptyListMessage();

function clipCurrentTab() {
  // need to get info such as page title and url
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = tabs[0].url;
    const title = tabs[0].title;

    // push this info into the popup window
    const para = document.createElement('p');
    const text = document.createTextNode(title);
    para.appendChild(text);
    listOfClips.appendChild(para);
  });
}
// Start exploring interaction with the chrome object methods
saveButton.onclick = () => {
  clipCurrentTab();
};
