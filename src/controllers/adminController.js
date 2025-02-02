// src/controllers/adminController.js
import { FAQ } from '../models/faq.js';
import { translateText } from '../utils/translator.js';

export const showCreateForm = (req, res) => {
  res.render('admin/create-faq', { 
    messages: req.flash()
  });
};

export const showEditForm = async (req, res) => {
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
};

export const deleteFaq = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    req.flash('success', 'FAQ deleted successfully');
    res.redirect('/admin');
  } catch (error) {
    req.flash('error', 'Failed to delete FAQ');
    res.redirect('/admin');
  }
};

export const dashboard = async (req, res) => {
  try {
    // Get all FAQs with their translations, sorted by creation date
    const faqs = await FAQ.find()
                         .sort('-createdAt')
                         .lean() // Convert to plain JS objects for better performance
                         .exec();

    // Add proper Map objects for translations (needed because of lean())
    faqs.forEach(faq => {
      if (faq.translations) {
        faq.translations = new Map(Object.entries(faq.translations));
      }
    });

    res.render('admin/dashboard', { 
      faqs,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    req.flash('error', 'Failed to load FAQs');
    res.redirect('/admin');
  }
};

export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    
    // Create new FAQ with initial English content
    const faq = new FAQ({
      question,
      answer,
      translations: new Map()
    });

    // Generate translations for supported languages
    const languages = ['hi', 'bn', 'es'];
    const translationPromises = languages.map(async (lang) => {
      try {
        const [translatedQuestion, translatedAnswer] = await Promise.all([
          translateText(question, lang),
          translateText(answer, lang)
        ]);
        
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer
        });
      } catch (error) {
        console.error(`Translation error for ${lang}:`, error);
        // Continue with other translations even if one fails
      }
    });

    // Wait for all translations to complete
    await Promise.all(translationPromises);

    // Save the FAQ with all available translations
    await faq.save();
    
    req.flash('success', 'FAQ created successfully with translations');
    res.redirect('/admin');
  } catch (error) {
    console.error('Create FAQ Error:', error);
    req.flash('error', 'Failed to create FAQ: ' + error.message);
    res.redirect('/admin/faqs/create');
  }
};

export const updateFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      req.flash('error', 'FAQ not found');
      return res.redirect('/admin');
    }

    // Update English content
    faq.question = question;
    faq.answer = answer;

    // Update translations
    const languages = ['hi', 'bn', 'es'];
    const translationPromises = languages.map(async (lang) => {
      try {
        const [translatedQuestion, translatedAnswer] = await Promise.all([
          translateText(question, lang),
          translateText(answer, lang)
        ]);
        
        faq.translations.set(lang, {
          question: translatedQuestion,
          answer: translatedAnswer
        });
      } catch (error) {
        console.error(`Translation update error for ${lang}:`, error);
        // Keep existing translation if update fails
      }
    });

    // Wait for all translation updates to complete
    await Promise.all(translationPromises);

    await faq.save();
    req.flash('success', 'FAQ updated successfully with translations');
    res.redirect('/admin');
  } catch (error) {
    console.error('Update FAQ Error:', error);
    req.flash('error', 'Failed to update FAQ: ' + error.message);
    res.redirect(`/admin/faqs/${req.params.id}/edit`);
  }
};
