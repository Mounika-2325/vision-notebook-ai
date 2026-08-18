const express = require('express');
const router = express.Router();
const { sendMessage, getSessions, getSession, getHistory } = require('../controllers/chatController');

router.post('/', sendMessage);
router.get('/sessions', getSessions);
router.get('/history', getHistory);
router.get('/sessions/:id', getSession);

module.exports = router;
