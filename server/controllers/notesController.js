const Note = require('../models/Note');
const Document = require('../models/Document');
const { analyzeDocument } = require('../services/geminiService');

const VALID_TYPES = ['short-summary', 'detailed-summary', 'bullet-notes', 'mind-map', 'flashcards', 'quiz-questions'];

/**
 * Generate notes of a specific type
 */
const generateNotes = async (req, res, next) => {
  try {
    const { documentId, type } = req.body;

    if (!documentId || !type) {
      return res.status(400).json({ success: false, message: 'documentId and type are required' });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }

    const document = await Document.findById(documentId);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    if (!document.extractedText || document.extractedText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Document has insufficient text for note generation' });
    }

    const content = await analyzeDocument(document.extractedText, type);

    const note = new Note({
      documentId,
      documentName: document.originalName,
      type,
      content,
      title: content.title || document.originalName
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Notes generated successfully',
      note: {
        id: note._id,
        documentId: note.documentId,
        documentName: note.documentName,
        type: note.type,
        content: note.content,
        title: note.title,
        createdAt: note.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all notes (optionally filtered)
 */
const getNotes = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.documentId) filter.documentId = req.query.documentId;
    if (req.query.type) filter.type = req.query.type;

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: notes.length, notes });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a note
 */
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateNotes, getNotes, deleteNote };
