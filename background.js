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

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyC-1VIMgO61lFnZdYpZ6AyHqwm6ZbFID4o";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate embeddings
async function generateEmbedding(text) {
  console.log("generatinf embeddings");
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
  console.log(bestMatch);
  return bestMatch;
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "query") {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(request.query);
    const responseText = result.response.text();
    
    // Process the response to extract steps
    const steps = responseText.split('\n').filter(step => step.trim().length > 0);
    
    // Get stored UI elements from Chrome's local storage
    const { uiElements } = await chrome.storage.local.get('uiElements');
    
    // Find best matches for each step
    const matches = await Promise.all(steps.map(step => findBestMatch(step, uiElements)));
    
    // Send the matched steps and UI elements to the popup
    sendResponse({ steps, matches });
  }
  return true;
});

chrome.runtime.onInstalled.addListener(async () => {
  const uiElements = [
    { name: "Friends", selector: "span:contains('Friends')", embedding: await generateEmbedding("Friends") },
    { name: "Live video", selector: "span:contains('Live video')", embedding: await generateEmbedding("Live video") },
    { name: "Photo/video", selector: "span:contains('Photo/video')", embedding: await generateEmbedding("Photo/video") },
    { name: "Feeling/activity", selector: "span:contains('Feeling/activity')", embedding: await generateEmbedding("Feeling/activity") },
    { name: "Saved", selector: "span:contains('Saved')", embedding: await generateEmbedding("Saved") },
    { name: "Events", selector: "span:contains('Events')", embedding: await generateEmbedding("Events") },
    // Add more UI elements here as needed
  ];
  await chrome.storage.local.set({ uiElements });
});