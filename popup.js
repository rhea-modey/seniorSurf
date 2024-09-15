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

  document.getElementById('find-events-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: findEventsButton
        });
    });
  });

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
        console.log("Sending message:", userInput);
        displayMessage(userInput, 'user');
        document.getElementById('queryInput').value = '';

        // Make the fetch request
        fetch('http://localhost:5001/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Network response was not ok:', response.statusText);
                throw new Error('Network response was not ok');
            }
            console.log("Response received from server.");
            return response.json();
        })
        .then(data => {
            console.log("Popup: Data received from server:", data);
            if (data.response) {
                console.log("message send");
                
                // Display the bot's response in the UI
                displayMessage(data.response, 'bot');
                
                // You are also sending the response to the background script
                chrome.runtime.sendMessage({ type: "botResponse", response: data.response });
            } else {
                console.error("Unexpected data format:", data);
                displayMessage("Received unexpected data format from the server.", 'bot');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            chrome.runtime.sendMessage({ type: "botResponse", response: "Sorry, I couldn't connect to the server. Please try again later." });
        });
    } else {
        console.log("No user input provided.");
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "botResponse") {
        displayMessage(message.response, 'bot');
    }
});

function displayMessage(message, sender) {
    console.log("trying to display");
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);  // sender will be 'user' or 'bot'
    messageDiv.textContent = message;
    console.log(message);

    document.getElementById('messages').appendChild(messageDiv);

    // Scroll to the bottom of the chat window
    const chatWindow = document.getElementById('chat-window');
    chatWindow.scrollTop = chatWindow.scrollHeight;
}


// Listen for messages from the background script
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.type === "botResponse") {
//         displayMessage(message.response, 'bot');
//     }
// });
// document.getElementById('queryButton').addEventListener('click', async () => {
//     const query = document.getElementById('queryInput').value;
//     const response = await chrome.runtime.sendMessage({ action: "query", query });
    
//     // Display results
//     const resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '';
//     response.steps.forEach((step, index) => {
//       const stepDiv = document.createElement('div');
//       stepDiv.textContent = step;
//       if (response.matches[index]) {
//         const highlightButton = document.createElement('button');
//         highlightButton.textContent = 'Highlight';
//         highlightButton.addEventListener('click', () => {
//           chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             chrome.tabs.sendMessage(tabs[0].id, { 
//               action: "highlight", 
//               selector: response.matches[index].selector 
//             });
//           });
//         });
//         stepDiv.appendChild(highlightButton);
//       }
//       resultsDiv.appendChild(stepDiv);
//     });
//   });
document.getElementById('queryButton').addEventListener('click', async () => {
    const query = document.getElementById('queryInput').value;
    
    try {
        const response = await chrome.runtime.sendMessage({ action: "query", query });
        displayResults(response);
    } catch (error) {
        console.error('Error processing query:', error);
        displayError('An error occurred while processing your query. Please try again.');
    }
});

function displayResults(response) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    response.steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.textContent = `Step ${index + 1}: ${step}`;
        stepDiv.classList.add('step');
        
        if (response.matches[index]) {
            const highlightButton = document.createElement('button');
            highlightButton.textContent = 'Highlight';
            highlightButton.classList.add('highlight-button');
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
}

function displayError(message) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<div class="error">${message}</div>`;
}



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


  function findEventsButton() {
    // Get all elements that could potentially be the button
    let elements = document.querySelectorAll('div, span, a');
  
    // Iterate through all the elements to find the one with the text "Saved"
    for (let element of elements) {
        if (element.textContent.trim() === "Events" && element.offsetParent !== null) {
            element.style.border = "3px solid red";
            element.style.backgroundColor = "yellow";
            element.style.padding = "2px";
            element.style.borderRadius = "4px";
  
            // element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            alert("Events button found and highlighted!");
            break; 
        }
    }
  }


