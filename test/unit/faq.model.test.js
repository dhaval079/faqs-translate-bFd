const { expect } = require('chai');
const FAQ = require('../../src/models/faq');
const mongoose = require('mongoose');

describe('FAQ Model', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await FAQ.deleteMany({});
  });

  describe('getTranslation()', () => {
    it('should return English text when translation not available', async () => {
      const faq = new FAQ({
        question: 'Test Question?',
        answer: 'Test Answer'
      });
      await faq.save();

      const translation = faq.getTranslation('hi');
      expect(translation.question).to.equal('Test Question?');
      expect(translation.answer).to.equal('Test Answer');
    });

    it('should return correct translation when available', async () => {
      const faq = new FAQ({
        question: 'Test Question?',
        answer: 'Test Answer',
        translations: new Map([
          ['hi', { question: 'टेस्ट प्रश्न?', answer: 'टेस्ट उत्तर' }]
        ])
      });
      await faq.save();

      const translation = faq.getTranslation('hi');
      expect(translation.question).to.equal('टेस्ट प्रश्न?');
      expect(translation.answer).to.equal('टेस्ट उत्तर');
    });
  });
});