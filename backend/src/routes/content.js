const express = require('express');
const { getContent, getContentById, updateProgress } = require('../controllers/contentController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Protect all content routes
router.use(authMiddleware);

router.get('/', getContent);
router.get('/:id', getContentById);
router.put('/:contentId/progress', updateProgress);

module.exports = router;
