const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  documentName: { type: String, required: true },
  type: {
    type: String,
    enum: ['short-summary', 'detailed-summary', 'bullet-notes', 'mind-map', 'flashcards', 'quiz-questions'],
    required: true
  },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  title: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
