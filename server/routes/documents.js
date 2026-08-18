const express = require('express');
const router = express.Router();
const { uploadDocument: multerDoc } = require('../middleware/upload');
const { uploadDocument, getDocuments, getDocument, deleteDocument } = require('../controllers/documentController');

router.post('/upload', (req, res, next) => {
  multerDoc(req, res, (err) => {
    if (err) return next(err);
    uploadDocument(req, res, next);
  });
});

router.get('/', getDocuments);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
