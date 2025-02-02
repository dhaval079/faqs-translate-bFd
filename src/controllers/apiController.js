// src/controllers/apiController.js
const FAQ = require('../models/faq');
const cacheService = require('../utils/cache');

const apiController = {
    // Get all FAQs with language support
    getAllFaqs: async (req, res) => {
        try {
            const lang = req.query.lang || 'en';
            const cacheKey = `faqs_${lang}`;

            // Try to get from cache first
            const cachedData = await cacheService.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            // If not in cache, get from database
            const faqs = await FAQ.find({ isActive: true });
            const translatedFaqs = faqs.map(faq => ({
                id: faq._id,
                ...faq.getTranslation(lang)
            }));

            // Store in cache
            await cacheService.set(cacheKey, translatedFaqs);

            res.json(translatedFaqs);
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Get single FAQ
    getFaqById: async (req, res) => {
        try {
            const lang = req.query.lang || 'en';
            const faqId = req.params.id;
            const cacheKey = `faq_${faqId}_${lang}`;

            // Try cache first
            const cachedData = await cacheService.get(cacheKey);
            if (cachedData) {
                return res.json(cachedData);
            }

            const faq = await FAQ.findById(faqId);
            if (!faq) {
                return res.status(404).json({ error: 'FAQ not found' });
            }

            const translatedFaq = {
                id: faq._id,
                ...faq.getTranslation(lang)
            };

            // Store in cache
            await cacheService.set(cacheKey, translatedFaq);

            res.json(translatedFaq);
        } catch (error) {
            console.error('API Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Search FAQs
    searchFaqs: async (req, res) => {
        try {
            const { query } = req.query;
            const lang = req.query.lang || 'en';
            
            if (!query) {
                return res.status(400).json({ error: 'Search query is required' });
            }

            const cacheKey = `search_${query}_${lang}`;
            
            // Try cache first
            const cachedResults = await cacheService.get(cacheKey);
            if (cachedResults) {
                return res.json(cachedResults);
            }

            let faqs;
            if (lang === 'en') {
                faqs = await FAQ.find({
                    $or: [
                        { question: { $regex: query, $options: 'i' } },
                        { answer: { $regex: query, $options: 'i' } }
                    ],
                    isActive: true
                });
            } else {
                // Search in translations
                faqs = await FAQ.find({
                    [`translations.${lang}.question`]: { $regex: query, $options: 'i' },
                    isActive: true
                });
            }

            const results = faqs.map(faq => ({
                id: faq._id,
                ...faq.getTranslation(lang)
            }));

            // Store in cache
            await cacheService.set(cacheKey, results, 1800); // Cache for 30 minutes

            res.json(results);
        } catch (error) {
            console.error('Search Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = apiController;