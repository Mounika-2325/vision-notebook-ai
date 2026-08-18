const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  extractedText: { type: String, default: '' },
  summary: { type: String, default: '' },
  keyPoints: [{ type: String }],
  topics: [{ type: String }],
  wordCount: { type: Number, default: 0 },
  isProcessed: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
