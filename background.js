// chrome.runtime.onInstalled.addListener(() => {
//     console.log('Extension installed and background service worker activated.');
//   });
  

  
// chrome.runtime.onMessage.addListener(function(message, sender, reply){
//   console.log("Content: Message received")

//   fetch('http://localhost:5001/', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     //mode: "no-cors",
//     body: JSON.stringify({ message: message.name })
// })
// .then(response => {
//     if (!response.ok) {
//         console.log(response)
//         throw new Error('Network response was not ok');
//     }

//     console.log("Content:", response)
//     return response.json();
// })
// .then(data => {
//     displayMessage(data.response, 'bot');
// })
// .catch(error => {
//     console.error('Error:', error);
//     displayMessage("Sorry, I couldn't connect to the server. Please try again later.", 'bot');
// });
// });

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed and background service worker activated.');
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("Background: Message received");

  fetch('http://localhost:5001/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message.name })
  })
  .then(response => {
      if (!response.ok) {
          console.log(response);
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      // Send the response back to the popup
      chrome.runtime.sendMessage({type: "botResponse", response: data.response});
  })
  .catch(error => {
      console.error('Error:', error);
      // Send an error message back to the popup
      chrome.runtime.sendMessage({type: "botResponse", response: "Sorry, I couldn't connect to the server. Please try again later."});
  });

  // Return true to indicate that we will send a response asynchronously
  return true;
});
