// src/routes/api.js
import express from 'express';
import { getAllFaqs, getFaqById, searchFaqs } from '../controllers/apiController.js';

const router = express.Router();

// Get all FAQs
router.get('/faqs', getAllFaqs);

// Search FAQs
router.get('/faqs/search', searchFaqs);

// Get single FAQ (this should come after other /faqs routes)
router.get('/faqs/:id', getFaqById);

export default router;