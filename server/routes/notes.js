const express = require('express');
const router = express.Router();
const { generateNotes, getNotes, deleteNote } = require('../controllers/notesController');

router.post('/generate', generateNotes);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

module.exports = router;
