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
            console.error('Network response was not ok:', response.statusText);
            throw new Error('Network response was not ok');
        }
        console.log("Successful response received.");
        return response.json();
    })
    .then(data => {
    // Check if the expected data is received
    console.log("Data received from server:", data);
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
        // Send an error message back to the popup
        chrome.runtime.sendMessage({ type: "botResponse", response: "Sorry, I couldn't connect to the server. Please try again later." });
    });


  // Return true to indicate that we will send a response asynchronously
  return true;
});

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyC-1VIMgO61lFnZdYpZ6AyHqwm6ZbFID4o";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate embeddings
async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding;
}

// Function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to find the best match
async function findBestMatch(query, elements) {
  const queryEmbedding = await generateEmbedding(query);
  let bestMatch = null;
  let highestSimilarity = -1;

  for (const element of elements) {
    const similarity = cosineSimilarity(queryEmbedding, element.embedding);
    if (similarity > highestSimilarity) {
      highestSimilarity = similarity;
      bestMatch = element;
    }
  }

  return bestMatch;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "query") {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(request.query);
    const response = result.response.text();
    
    // Process the response to extract steps
    const steps = response.split('\n').filter(step => step.trim().length > 0);
    
    // Get stored UI elements
    const { uiElements } = await chrome.storage.local.get('uiElements');
    
    // Find best matches for each step
    const matches = await Promise.all(steps.map(step => findBestMatch(step, uiElements)));
    
    // Send matches back to popup
    sendResponse({ steps, matches });
  }
  return true;
});

// Initialize UI elements (you would need to populate this with actual Facebook UI elements)
chrome.runtime.onInstalled.addListener(async () => {
  const uiElements = [
    { name: "Friends", selector: "span:contains('Friends')", embedding: await generateEmbedding("Friends") },
    { name: "Live video", selector: "span:contains('Live video')", embedding: await generateEmbedding("Live video") },
    // Add more UI elements here
  ];
  await chrome.storage.local.set({ uiElements });
});