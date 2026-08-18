const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

/**
 * Parse JSON safely from a Gemini response string
 */
function parseJSON(text) {
  try {
    // Try direct parse
    return JSON.parse(text);
  } catch {
    // Extract JSON object or array from text
    const match = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                  text.match(/({[\s\S]*})/m) ||
                  text.match(/(\[[\s\S]*\])/m);
    if (match) {
      try {
        return JSON.parse(match[1] || match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Auto-process document: extract summary, key points, topics
 */
async function processDocument(text) {
  const model = getModel();
  const truncated = text.substring(0, 7000);

  const prompt = `Analyze the following document and respond with ONLY a valid JSON object (no markdown, no extra text):
{
  "summary": "A 2-3 sentence overview of what this document is about",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "wordCount": ${text.split(/\s+/).filter(Boolean).length}
}

Document:
${truncated}`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  return parseJSON(raw) || { summary: raw.substring(0, 300), keyPoints: [], topics: [], wordCount: text.split(/\s+/).length };
}

/**
 * Generate notes of a specific type from document text
 */
async function analyzeDocument(text, type) {
  const model = getModel();
  const truncated = text.substring(0, 7000);

  const prompts = {
    'short-summary': `Summarize the following document in 2-3 concise sentences. Return ONLY JSON:
{"title": "Document Title", "summary": "Concise 2-3 sentence summary here.", "wordCount": ${text.split(/\s+/).length}}

Document: ${truncated}`,

    'detailed-summary': `Write a comprehensive detailed summary of the following document. Return ONLY JSON:
{
  "title": "Document Title",
  "introduction": "Introduction paragraph",
  "mainPoints": ["Main point 1", "Main point 2", "Main point 3"],
  "conclusion": "Conclusion paragraph",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
}

Document: ${truncated}`,

    'bullet-notes': `Extract organized bullet-point notes from this document. Return ONLY JSON:
{
  "title": "Document Title",
  "sections": [
    {"heading": "Section Heading", "points": ["Point 1", "Point 2", "Point 3"]},
    {"heading": "Section Heading 2", "points": ["Point 1", "Point 2"]}
  ]
}

Document: ${truncated}`,

    'mind-map': `Create a mind map structure for this document. Return ONLY JSON:
{
  "centralTopic": "Main Topic",
  "branches": [
    {"topic": "Branch 1", "subtopics": ["Subtopic 1a", "Subtopic 1b", "Subtopic 1c"]},
    {"topic": "Branch 2", "subtopics": ["Subtopic 2a", "Subtopic 2b"]},
    {"topic": "Branch 3", "subtopics": ["Subtopic 3a", "Subtopic 3b"]}
  ]
}

Document: ${truncated}`,

    'flashcards': `Create 10 educational flashcards from this document. Return ONLY JSON:
{
  "title": "Flashcards Title",
  "cards": [
    {"front": "Question or term", "back": "Answer or definition"},
    {"front": "Question 2", "back": "Answer 2"}
  ]
}

Document: ${truncated}`,

    'quiz-questions': `Generate 8 quiz questions from this document with 4 options each. Return ONLY JSON:
{
  "title": "Quiz Title",
  "questions": [
    {
      "question": "Question text?",
      "options": ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
      "answer": "A",
      "explanation": "Why this is correct"
    }
  ]
}

Document: ${truncated}`
  };

  const prompt = prompts[type] || prompts['short-summary'];
  const result = await model.generateContent(prompt);
  const raw = result.response.text();
  const parsed = parseJSON(raw);

  if (!parsed) {
    return { title: 'Generated Notes', content: raw, error: false };
  }
  return parsed;
}

/**
 * Analyze an image using Gemini Vision
 */
async function analyzeImage(imagePath, mimeType) {
  const model = getModel();
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');

  const prompt = `Analyze this image carefully and return ONLY a valid JSON object with no extra text:
{
  "description": "Detailed description of what is in the image",
  "objects": ["object1", "object2", "object3"],
  "ocrText": "Any text visible in the image, or empty string if none",
  "colors": ["dominant color 1", "color 2", "color 3"],
  "mood": "Overall mood, atmosphere or setting",
  "summary": "One sentence summary of the image",
  "details": "Any additional notable details or context"
}`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType, data: base64 } }
  ]);

  const raw = result.response.text();
  return parseJSON(raw) || {
    description: raw,
    objects: [],
    ocrText: '',
    colors: [],
    mood: '',
    summary: raw.substring(0, 100),
    details: ''
  };
}

/**
 * Ask a specific question about an image
 */
async function askAboutImage(imagePath, mimeType, question) {
  const model = getModel();
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');

  const result = await model.generateContent([
    `Please answer the following question about this image in a clear and detailed manner:\n\nQuestion: ${question}`,
    { inlineData: { mimeType, data: base64 } }
  ]);

  return result.response.text();
}

/**
 * Conversational chat with document context
 */
async function chatWithDocument(messages, documentContext, userMessage) {
  const model = getModel();
  const context = documentContext.substring(0, 6000);

  // Build Gemini-compatible history
  const systemSetup = [
    {
      role: 'user',
      parts: [{ text: `You are a helpful AI assistant. A user has uploaded a document and wants to discuss it with you. Here is the document content:\n\n${context}\n\nPlease answer questions based on this document. Be accurate, helpful, and cite specific parts when relevant.` }]
    },
    {
      role: 'model',
      parts: [{ text: "I've read the document. I'm ready to answer your questions about it. What would you like to know?" }]
    }
  ];

  // Add prior conversation (excluding last user message, which we send fresh)
  const priorMessages = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const chat = model.startChat({ history: [...systemSetup, ...priorMessages] });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

module.exports = {
  processDocument,
  analyzeDocument,
  analyzeImage,
  askAboutImage,
  chatWithDocument
};
