const express = require('express');
const router = express.Router();
const { uploadImage: multerImg } = require('../middleware/upload');
const { uploadImage, getImages, askQuestion, deleteImage } = require('../controllers/imageController');

router.post('/upload', (req, res, next) => {
  multerImg(req, res, (err) => {
    if (err) return next(err);
    uploadImage(req, res, next);
  });
});

router.get('/', getImages);
router.post('/ask', askQuestion);
router.delete('/:id', deleteImage);

module.exports = router;
