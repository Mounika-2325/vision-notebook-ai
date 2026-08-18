const ChatSession = require('../models/ChatSession');
const Document = require('../models/Document');
const { chatWithDocument } = require('../services/geminiService');

/**
 * Send a chat message and get AI response
 */
const sendMessage = async (req, res, next) => {
  try {
    const { documentId, message, sessionId } = req.body;
    if (!documentId || !message) {
      return res.status(400).json({ success: false, message: 'documentId and message are required' });
    }

    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    if (!document.extractedText || document.extractedText.length < 10) {
      return res.status(400).json({ success: false, message: 'Document has no extractable text for chat' });
    }

    let session = sessionId ? await ChatSession.findById(sessionId) : null;
    if (!session) {
      session = new ChatSession({ documentId, documentName: document.originalName, messages: [] });
    }

    // Add user message
    session.messages.push({ role: 'user', content: message });

    // Get AI response
    const aiResponse = await chatWithDocument(session.messages, document.extractedText, message);

    // Add AI response
    session.messages.push({ role: 'assistant', content: aiResponse });

    await session.save();

    res.json({
      success: true,
      sessionId: session._id,
      response: aiResponse,
      messages: session.messages
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all chat sessions
 */
const getSessions = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find().sort({ updatedAt: -1 });
    res.json({
      success: true,
      count: sessions.length,
      sessions: sessions.map(s => ({
        id: s._id,
        documentId: s.documentId,
        documentName: s.documentName,
        messageCount: s.messages.length,
        lastMessage: s.messages[s.messages.length - 1] || null,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single chat session
 */
const getSession = async (req, res, next) => {
  try {
    const session = await ChatSession.findById(req.params.id);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    res.json({ success: true, session });
  } catch (err) {
    next(err);
  }
};

/**
 * Get history overview
 */
const getHistory = async (req, res, next) => {
  try {
    const sessions = await ChatSession.find().sort({ updatedAt: -1 }).limit(20);
    res.json({
      success: true,
      history: sessions.map(s => ({
        id: s._id,
        documentId: s.documentId,
        documentName: s.documentName,
        messageCount: s.messages.length,
        preview: s.messages[0]?.content?.substring(0, 100) || '',
        updatedAt: s.updatedAt
      }))
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, getSessions, getSession, getHistory };
