console.log("🔥 LOADED REAL healthService FILE");
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');
const documents = require('../data/documents.json');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let docEmbeddings = [];

// --- 🛡️ HELPER: BULLETPROOF RETRY LOGIC ---
async function fetchWithRetry(apiCall, maxRetries = 3, delayMs = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      const status = error?.status || error?.response?.status;
      if ((status === 503 || status === 429) && i < maxRetries - 1) {
        console.log(`⚠️ Google API busy (Error ${status}). Retrying in ${delayMs / 1000}s... (Attempt ${i + 1} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
}

// --- 🧠 HELPER: COSINE SIMILARITY MATH ---
function cosineSimilarity(a, b) {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- 🚀 CORE: INITIALIZE EMBEDDINGS (SEQUENTIAL FIX) ---
async function initEmbeddings() {
  try {
    console.log("🔥 initEmbeddings started... loading sequentially to avoid API crashes!");
    docEmbeddings = [];

    // Polite sequential loading!
    for (const doc of documents) {
      const res = await fetchWithRetry(() => ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: doc.content,
      }));

      docEmbeddings.push({
        topic: doc.topic,
        content: doc.content,
        embedding: res.embeddings[0].values,
      });
    }

    console.log(`✅ ${docEmbeddings.length} Embeddings perfectly initialized!`);
  } catch (error) {
    console.error("❌ Error initializing embeddings:", error);
  }
}

// --- 💬 CORE: SEMANTIC CHATBOT RESPONSE (BULLETPROOF BYPASS) ---
async function getResponse(message) {
  if (!message) {
    return { answer: "No relevant information found. Please provide more details." };
  }

  let contextSection = "";
  let bestMatch = null;
  let highestScore = -1;

  // 🛡️ THE BYPASS: Only try semantic search IF the embeddings actually loaded!
  if (docEmbeddings && docEmbeddings.length > 0) {
    try {
      const userRes = await fetchWithRetry(() => ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: message,
      }));

      const userEmbedding = userRes.embeddings[0].values;

      for (const doc of docEmbeddings) {
        const score = cosineSimilarity(userEmbedding, doc.embedding);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = doc;
        }
      }

      if (bestMatch && highestScore > 0.45) {
        contextSection = `Relevant Context from user's records/documents:\n"${bestMatch.content}"\n\n`;
      }
    } catch (searchError) {
      console.log("⚠️ Semantic search skipped (API limit reached). Falling back to pure AI.");
    }
  } else {
    console.log("⚠️ Embeddings database is empty. Bypassing semantic search...");
  }

  try {
    const prompt = `You are a highly intelligent, helpful, and safe health assistant.

${contextSection}User query:
"${message}"

Guidelines:
1. If "Relevant Context" is provided above, use it to inform your answer.
2. If the context does not contain the answer, or if there is no context, USE YOUR EXPERT MEDICAL KNOWLEDGE to fully answer the user's question or perform the requested translation.
3. Be conversational, clear, and educational.
4. Do NOT diagnose serious diseases or prescribe medication. Always include a brief disclaimer to consult a doctor for actual medical advice.

Answer:`;

    const result = await fetchWithRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    }));

    const text = result.text;

    if (!text || text.length < 10) {
      return { answer: "I couldn't generate a reliable answer. Please try again with more details." };
    }

    return {
      answer: text,
      source: (bestMatch && highestScore > 0.45) ? bestMatch.topic : "General AI Knowledge",
      confidence: highestScore > 0 ? highestScore.toFixed(3) : "N/A"
    };

  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    return { answer: "Something went wrong communicating with the AI. Please try again later." };
  }
}

// --- 📄 CORE: MULTIMODAL REPORT EXTRACTION (FEW-SHOT) ---
async function extractReportData(filePath, mimeType) {
  try {
    const fileBase64 = fs.readFileSync(filePath).toString("base64");

    const promptText = `
You are an expert medical AI diagnostician. Analyze the uploaded medical report.

### SYSTEM INSTRUCTIONS:
Do not hallucinate. Base your summary strictly on the provided text or visual data. Provide output strictly in JSON format. Your JSON must include "summary", "recommendations" (array), and "suggestedQuestions" (array of exactly 3 questions). 
CRITICAL: If the user uploads an image (like an X-ray or MRI) without text, you MUST use your computer vision capabilities to visually analyze the structural anomalies (e.g., fractures, spots) and provide a diagnostic summary based on the visual evidence.

### TRAINING DATA (FEW-SHOT EXAMPLES):

[Example 1: Normal Text Report]
Input: "Hemoglobin: 14.2 g/dL. MCV: 88 fL. Platelets: 250,000."
Output Logic: Identify all values are within normal ranges.
Summary: "Your complete blood count indicates normal parameters. No immediate anomalies detected."
Recommendations: ["Maintain a balanced diet.", "Continue routine annual checkups."]
SuggestedQuestions: ["What do these blood markers mean?", "How often should I get a CBC?", "Are there any lifestyle changes I should make?"]

[Example 2: Abnormal Text Report - Iron Deficiency]
Input: "Hemoglobin: 9.5 g/dL (Low). MCV: 72 fL (Low)."
Output Logic: Recognize low Hb and MCV as microcytic anemia.
Summary: "The report shows significantly low Hemoglobin and MCV, which is strongly indicative of microcytic anemia, commonly caused by iron deficiency."
Recommendations: ["Consult a physician for an iron panel.", "Increase intake of iron-rich foods."]
SuggestedQuestions: ["What is microcytic anemia?", "What foods are high in iron?", "Should I take iron supplements?"]

[Example 3: Visual Image Report (e.g., X-Ray/Scan)]
Input: [User uploads an image of a chest X-Ray with a broken bone]
Output Logic: Use computer vision to identify the skeletal trauma. Do not ask for a text report.
Summary: "Based on the visual analysis of the X-ray, there appears to be a displaced fracture in the rib cage region. The structural integrity of the bone is visibly interrupted."
Recommendations: ["Seek immediate orthopedic consultation.", "Immobilize the area if possible.", "Discuss pain management with a doctor."]
SuggestedQuestions: ["How long do rib fractures take to heal?", "What are the signs of a punctured lung?", "Should I wrap my ribs?"]

### ACTUAL PATIENT DATA:
Now, analyze the following uploaded report using the logic from the training data above:
`;

    // 🛡️ Wrapped in our retry logic!
    const result = await fetchWithRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        promptText,
        {
          inlineData: {
            data: fileBase64,
            mimeType: mimeType
          }
        }
      ]
    }));

    // Clean and parse the JSON
    const text = result.text;
    const cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();

    console.log("--- RAW GEMINI OUTPUT ---");
    console.log(cleanText);
    console.log("-------------------------");

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("❌ BACKEND CRASH in extractReportData:");
    console.error(error);
    throw error;
  }
}

// --- EXPORTS ---
module.exports = {
  getResponse,
  initEmbeddings,
  extractReportData
};