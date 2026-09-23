export async function generateEmbedding(text) {
  const response = await fetch('http://localhost:5001/embed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Embedding request failed');
  const data = await response.json();
  return data.embedding;
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