// src/routes/api.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Get all FAQs
router.get('/faqs', apiController.getAllFaqs);

// Search FAQs
router.get('/faqs/search', apiController.searchFaqs);

// Get single FAQ (this should come after other /faqs routes)
router.get('/faqs/:id', apiController.getFaqById);

module.exports = router;