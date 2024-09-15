import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyC-1VIMgO61lFnZdYpZ6AyHqwm6ZbFID4o";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding;
}

function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function findBestMatch(query, elements) {
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