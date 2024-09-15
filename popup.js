// document.getElementById('find-live-video').addEventListener('click', () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: findLiveVideoButton
//         });
//     });
// });

// document.getElementById('find-photo-video').addEventListener('click', () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: findPhotoVideoButton
//         });
//     });
// });

// document.getElementById('find-feeling-activity').addEventListener('click', () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: findFeelingActivityButton
//         });
//     });
// });

// document.getElementById('find-saved-posts').addEventListener('click', () => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       chrome.scripting.executeScript({
//           target: { tabId: tabs[0].id },
//           function: findSavedButton
//       });
//   });
// });

// document.getElementById('find-friends-button').addEventListener('click', () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: findFriendsButton
//         });
//     });
//   });

document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('queryButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    } else {
        console.error("Could not find element with id 'queryButton'");
    }
});

function sendMessage() {
    const userInput = document.getElementById('queryInput').value;

    if (userInput.trim()) {
        displayMessage(userInput, 'user');
        document.getElementById('queryInput').value = '';

        console.log("Sending message to background.js");
        chrome.runtime.sendMessage({name: userInput});
    }
}

function displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;

    document.getElementById('messages').appendChild(messageDiv);

    // Scroll to the bottom of the chat window
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "botResponse") {
        displayMessage(message.response, 'bot');
    }
});
document.getElementById('queryButton').addEventListener('click', async () => {
    const query = document.getElementById('queryInput').value;
    const response = await chrome.runtime.sendMessage({ action: "query", query });
    
    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    response.steps.forEach((step, index) => {
      const stepDiv = document.createElement('div');
      stepDiv.textContent = step;
      if (response.matches[index]) {
        const highlightButton = document.createElement('button');
        highlightButton.textContent = 'Highlight';
        highlightButton.addEventListener('click', () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: "highlight", 
              selector: response.matches[index].selector 
            });
          });
        });
        stepDiv.appendChild(highlightButton);
      }
      resultsDiv.appendChild(stepDiv);
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


