// src/controllers/adminController.js
const FAQ = require('../models/faq');
const { translateText } = require('../utils/translator');

const adminController = {
  // Show dashboard
  dashboard: async (req, res) => {
    try {
      const faqs = await FAQ.find().sort('-createdAt');
      res.render('admin/dashboard', { 
        faqs,
        messages: req.flash()
      });
    } catch (error) {
      req.flash('error', 'Failed to load FAQs');
      res.redirect('/admin');
    }
  },

  // Show FAQ creation form
  showCreateForm: (req, res) => {
    res.render('admin/create-faq', { 
      messages: req.flash()
    });
  },

  // Create new FAQ
  createFaq: async (req, res) => {
    try {
      const { question, answer } = req.body;
      
      // Create FAQ in English
      const faq = new FAQ({
        question,
        answer,
        translations: new Map()
      });

      // Generate translations
      const languages = ['hi', 'bn', 'es']; // Add more languages as needed
      for (const lang of languages) {
        const translatedQuestion = await translateText(question, lang);
        const translatedAnswer = await translateText(answer, lang);
        
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer
        });
      }

      await faq.save();
      req.flash('success', 'FAQ created successfully');
      res.redirect('/admin');
    } catch (error) {
      req.flash('error', 'Failed to create FAQ');
      res.redirect('/admin/faqs/create');
    }
  },

  // Show edit form
  showEditForm: async (req, res) => {
    try {
      const faq = await FAQ.findById(req.params.id);
      if (!faq) {
        req.flash('error', 'FAQ not found');
        return res.redirect('/admin');
      }
      res.render('admin/edit-faq', { faq, messages: req.flash() });
    } catch (error) {
      req.flash('error', 'Failed to load FAQ');
      res.redirect('/admin');
    }
  },

  // Update FAQ
  updateFaq: async (req, res) => {
    try {
      const { question, answer } = req.body;
      const faq = await FAQ.findById(req.params.id);
      
      if (!faq) {
        req.flash('error', 'FAQ not found');
        return res.redirect('/admin');
      }

      faq.question = question;
      faq.answer = answer;

      // Update translations
      const languages = ['hi', 'bn', 'es'];
      for (const lang of languages) {
        const translatedQuestion = await translateText(question, lang);
        const translatedAnswer = await translateText(answer, lang);
        
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer
        });
      }

      await faq.save();
      req.flash('success', 'FAQ updated successfully');
      res.redirect('/admin');
    } catch (error) {
      req.flash('error', 'Failed to update FAQ');
      res.redirect(`/admin/faqs/${req.params.id}/edit`);
    }
  },

  // Delete FAQ
  deleteFaq: async (req, res) => {
    try {
      await FAQ.findByIdAndDelete(req.params.id);
      req.flash('success', 'FAQ deleted successfully');
      res.redirect('/admin');
    } catch (error) {
      req.flash('error', 'Failed to delete FAQ');
      res.redirect('/admin');
    }
  }
};

module.exports = adminController;