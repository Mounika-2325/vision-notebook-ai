const Document = require('../models/Document');
const { processDocument } = require('../services/geminiService');
const fs = require('fs');
const path = require('path');

// pdf-parse needs to be required carefully to avoid test file issues
let pdfParse;
try { pdfParse = require('pdf-parse'); } catch { pdfParse = null; }

let mammoth;
try { mammoth = require('mammoth'); } catch { mammoth = null; }

/**
 * Upload and process a document
 */
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { filename, originalname, mimetype, size, path: filePath } = req.file;
    let extractedText = '';

    // Extract text based on file type
    try {
      if (mimetype === 'application/pdf' && pdfParse) {
        const buffer = fs.readFileSync(filePath);
        const data = await pdfParse(buffer);
        extractedText = data.text;
      } else if (
        (mimetype.includes('wordprocessingml') || mimetype === 'application/msword') && mammoth
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        extractedText = result.value;
      } else if (mimetype === 'text/plain') {
        extractedText = fs.readFileSync(filePath, 'utf-8');
      }
    } catch (extractErr) {
      console.error('Text extraction failed:', extractErr.message);
    }

    const document = new Document({
      filename,
      originalName: originalname,
      mimeType: mimetype,
      size,
      path: filePath,
      extractedText,
      wordCount: extractedText.split(/\s+/).filter(Boolean).length
    });

    // AI auto-processing if text is available
    if (extractedText && extractedText.trim().length > 50) {
      try {
        const ai = await processDocument(extractedText);
        document.summary = ai.summary || '';
        document.keyPoints = ai.keyPoints || [];
        document.topics = ai.topics || [];
        document.wordCount = ai.wordCount || document.wordCount;
        document.isProcessed = true;
      } catch (aiErr) {
        console.error('AI processing failed:', aiErr.message);
      }
    }

    await document.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      document: sanitizeDoc(document)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all documents
 */
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find()
      .select('-extractedText -path')
      .sort({ uploadedAt: -1 });
    res.json({ success: true, count: documents.length, documents });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single document by ID
 */
const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    res.json({ success: true, document: sanitizeDoc(document) });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a document
 */
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ success: false, message: 'Document not found' });
    if (fs.existsSync(document.path)) fs.unlinkSync(document.path);
    await document.deleteOne();
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err) {
    next(err);
  }
};

function sanitizeDoc(doc) {
  return {
    id: doc._id,
    filename: doc.filename,
    originalName: doc.originalName,
    mimeType: doc.mimeType,
    size: doc.size,
    extractedText: doc.extractedText,
    summary: doc.summary,
    keyPoints: doc.keyPoints,
    topics: doc.topics,
    wordCount: doc.wordCount,
    isProcessed: doc.isProcessed,
    uploadedAt: doc.uploadedAt
  };
}

module.exports = { uploadDocument, getDocuments, getDocument, deleteDocument };
