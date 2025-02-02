// test/unit/faq.model.test.js
import { expect } from 'chai';
import { FAQ } from '../../src/models/faq.js';
import { setupTestDB } from '../test-config.js';

describe('FAQ Model', () => {
    setupTestDB();

    it('should create a new FAQ', async () => {
        const faq = new FAQ({
            question: 'Test Question',
            answer: 'Test Answer'
        });

        const savedFaq = await faq.save();
        expect(savedFaq.question).to.equal('Test Question');
        expect(savedFaq.answer).to.equal('Test Answer');
    });

    it('should get translation', async () => {
        const faq = new FAQ({
            question: 'Test Question',
            answer: 'Test Answer',
            translations: new Map([
                ['hi', { question: 'टेस्ट प्रश्न', answer: 'टेस्ट उत्तर' }]
            ])
        });

        await faq.save();
        const translation = faq.getTranslation('hi');
        expect(translation.question).to.equal('टेस्ट प्रश्न');
    });
});