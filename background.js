import { generateEmbedding, findBestMatch } from './ai_utils.js';
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
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
          console.error('Network response was not ok:', response.statusText);
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log("BACK: Data received from server:", data);
      if (data.response) {
          // Send the response back to the popup
          chrome.runtime.sendMessage({ type: "botResponse", response: data.response });
      } else {
          console.error("Unexpected data format:", data);
          chrome.runtime.sendMessage({ type: "botResponse", response: "Received unexpected data format from the server." });
      }
  })
  .catch(error => {
      console.error('Fetch error:', error);
      chrome.runtime.sendMessage({ type: "botResponse", response: "Sorry, I couldn't connect to the server. Please try again later." });
  });

  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "query") {
    handleQuery(message.query).then(sendResponse);
    return true; // Indicates that the response is asynchronous
  }
});

async function handleQuery(query) {
  const response = await fetch('http://localhost:5001/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: query })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  
  if (!data.response) {
    throw new Error('Unexpected data format from server');
  }

  const steps = data.response.split('\n').filter(step => step.trim().length > 0);
  const { uiElements } = await chrome.storage.local.get('uiElements');
  const matches = await Promise.all(steps.map(step => findBestMatch(step, uiElements)));

  return { steps, matches };
}

// Initialize UI elements
chrome.runtime.onInstalled.addListener(async () => {
  const uiElements = [
    { name: "Friends", selector: "span:contains('Friends')", embedding: await generateEmbedding("Friends") },
    { name: "Live video", selector: "span:contains('Live video')", embedding: await generateEmbedding("Live video") },
    { name: "Photo/video", selector: "span:contains('Photo/video')", embedding: await generateEmbedding("Photo/video") },
    { name: "Feeling/activity", selector: "span:contains('Feeling/activity')", embedding: await generateEmbedding("Feeling/activity") },
    { name: "Saved", selector: "span:contains('Saved')", embedding: await generateEmbedding("Saved") },
    { name: "Events", selector: "span:contains('Events')", embedding: await generateEmbedding("Events") },
  ];
  await chrome.storage.local.set({ uiElements });
});