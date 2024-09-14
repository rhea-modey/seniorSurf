document.getElementById('find-live-video').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: findLiveVideoButton
        });
    });
});

document.getElementById('find-photo-video').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: findPhotoVideoButton
        });
    });
});

document.getElementById('find-feeling-activity').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: findFeelingActivityButton
        });
    });
});

document.getElementById('find-saved-posts').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: findSavedButton
      });
  });
});

document.getElementById('find-friends-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: findFriendsButton
        });
    });
  });

// function findLiveVideoButton() {
//     // Get all span elements on the page
//     let elements = document.querySelectorAll('span');

//     // Iterate through all the span elements to find the one with the text "Live video"
//     elements.forEach(function(element) {
//         if (element.innerText.includes("Live video")) {
//             // Highlight the element (add border and change background)
//             element.style.border = "3px solid red";
//             element.style.backgroundColor = "yellow";

//             // Display an alert to confirm the button was found
//             alert("Live video button found and highlighted!");
//         }
//     });
// }

function findLiveVideoButton() {
    // Get all span elements on the page
    let elements = document.querySelectorAll('span');

    // Iterate through all the span elements to find the one with the text "Live video"
    for (let element of elements) {
        if (element.innerText.includes("Live video") && element.offsetParent !== null) {  // Check if the element is visible
            // Highlight the element (add border and change background)
            element.style.border = "3px solid red";
            element.style.backgroundColor = "yellow";

            // Display an alert to confirm the button was found
            alert("Live video button found and highlighted!");
            break;  // Stop after the first match
        }
    }
}

function findPhotoVideoButton() {
    let elements = document.querySelectorAll('span');
    for (let element of elements) {
        if (element.innerText.includes("Photo/video") && element.offsetParent !== null) {
            element.style.border = "3px solid blue";
            element.style.backgroundColor = "lightgreen";
            alert("Photo/Video button found and highlighted!");
            break;
        }
    }
}

function findFeelingActivityButton() {
    let elements = document.querySelectorAll('span');
    for (let element of elements) {
        if (element.innerText.includes("Feeling/activity") && element.offsetParent !== null) {
            element.style.border = "3px solid blue";
            element.style.backgroundColor = "lightgreen";
            alert("Feeling/activity button found and highlighted!");
            break;
        }
    }
}

function findSavedButton() {
  // Get all elements that could potentially be the button
  let elements = document.querySelectorAll('div, span, a');

  // Iterate through all the elements to find the one with the text "Saved"
  for (let element of elements) {
      if (element.textContent.trim() === "Saved" && element.offsetParent !== null) {
          element.style.border = "3px solid red";
          element.style.backgroundColor = "yellow";
          element.style.padding = "2px";
          element.style.borderRadius = "4px";

          // element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          alert("Saved button found and highlighted!");
          break; 
      }
  }
}

function findFriendsButton() {
    // Get all elements that could potentially be the button
    let elements = document.querySelectorAll('div, span, a');
  
    // Iterate through all the elements to find the one with the text "Saved"
    for (let element of elements) {
        if (element.textContent.trim() === "Friends" && element.offsetParent !== null) {
            element.style.border = "3px solid red";
            element.style.backgroundColor = "yellow";
            element.style.padding = "2px";
            element.style.borderRadius = "4px";
  
            // element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alert("Friends button found and highlighted!");
            break; 
        }
    }
  }


