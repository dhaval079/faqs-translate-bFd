// src/models/faq.js
import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true
    },
    translations: {
        type: Map,
        of: {
            question: String,
            answer: String
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Method to get translated content
faqSchema.methods.getTranslation = function(language) {
    if (!language || language === 'en') {
        return {
            question: this.question,
            answer: this.answer
        };
    }

    const translation = this.translations.get(language);
    if (!translation) {
        return {
            question: this.question,
            answer: this.answer
        };
    }

    return {
        question: translation.question,
        answer: translation.answer
    };
};

export const FAQ = mongoose.model('FAQ', faqSchema);