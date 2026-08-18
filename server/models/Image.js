const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  description: { type: String, default: '' },
  objects: [{ type: String }],
  ocrText: { type: String, default: '' },
  colors: [{ type: String }],
  mood: { type: String, default: '' },
  summary: { type: String, default: '' },
  details: { type: String, default: '' },
  isAnalyzed: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
