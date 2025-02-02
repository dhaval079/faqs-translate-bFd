// src/routes/admin.js
import express from 'express';
import { dashboard, showCreateForm, createFaq, showEditForm, updateFaq, deleteFaq } from '../controllers/adminController.js';

const router = express.Router();

// Admin dashboard
router.get('/', dashboard);

// FAQ routes
router.get('/faqs/create', showCreateForm);
router.post('/faqs/create', createFaq);
router.get('/faqs/:id/edit', showEditForm);
router.put('/faqs/:id', updateFaq);
router.delete('/faqs/:id', deleteFaq);

export default router;