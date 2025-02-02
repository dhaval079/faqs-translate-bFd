// src/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin dashboard
router.get('/', adminController.dashboard);

// FAQ routes
router.get('/faqs/create', adminController.showCreateForm);
router.post('/faqs/create', adminController.createFaq);
router.get('/faqs/:id/edit', adminController.showEditForm);
router.put('/faqs/:id', adminController.updateFaq);
router.delete('/faqs/:id', adminController.deleteFaq);

module.exports = router;