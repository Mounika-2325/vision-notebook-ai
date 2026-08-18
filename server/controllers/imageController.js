const Image = require('../models/Image');
const { analyzeImage, askAboutImage } = require('../services/geminiService');
const fs = require('fs');

/**
 * Upload and auto-analyze an image
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const { filename, originalname, mimetype, size, path: filePath } = req.file;

    const image = new Image({ filename, originalName: originalname, mimeType: mimetype, size, path: filePath });

    // Vision analysis via Gemini
    try {
      const analysis = await analyzeImage(filePath, mimetype);
      image.description = analysis.description || '';
      image.objects = analysis.objects || [];
      image.ocrText = analysis.ocrText || '';
      image.colors = analysis.colors || [];
      image.mood = analysis.mood || '';
      image.summary = analysis.summary || '';
      image.details = analysis.details || '';
      image.isAnalyzed = true;
    } catch (visionErr) {
      console.error('Vision analysis failed:', visionErr.message);
    }

    await image.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded and analyzed successfully',
      image: sanitizeImage(image)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all images
 */
const getImages = async (req, res, next) => {
  try {
    const images = await Image.find().select('-path').sort({ uploadedAt: -1 });
    res.json({
      success: true,
      count: images.length,
      images: images.map(img => ({ ...img.toObject(), url: `/uploads/${img.filename}` }))
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Ask a follow-up question about an image
 */
const askQuestion = async (req, res, next) => {
  try {
    const { imageId, question } = req.body;
    if (!imageId || !question) {
      return res.status(400).json({ success: false, message: 'imageId and question are required' });
    }

    const image = await Image.findById(imageId);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

    const answer = await askAboutImage(image.path, image.mimeType, question);
    res.json({ success: true, answer, imageId });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete an image
 */
const deleteImage = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
    await image.deleteOne();
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
};

function sanitizeImage(img) {
  return {
    id: img._id,
    filename: img.filename,
    originalName: img.originalName,
    mimeType: img.mimeType,
    size: img.size,
    description: img.description,
    objects: img.objects,
    ocrText: img.ocrText,
    colors: img.colors,
    mood: img.mood,
    summary: img.summary,
    details: img.details,
    isAnalyzed: img.isAnalyzed,
    uploadedAt: img.uploadedAt,
    url: `/uploads/${img.filename}`
  };
}

module.exports = { uploadImage, getImages, askQuestion, deleteImage };
