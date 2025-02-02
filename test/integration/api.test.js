const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const FAQ = require('../../src/models/faq');
const cacheService = require('../../src/utils/cache');

describe('API Routes', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await FAQ.deleteMany({});
    await cacheService.del('faqs_en');
    await cacheService.del('faqs_hi');
  });

  describe('GET /api/faqs', () => {
    it('should return empty array when no FAQs exist', async () => {
      const res = await request(app).get('/api/faqs');
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });

    it('should return FAQs in English by default', async () => {
      const faq = new FAQ({
        question: 'Test Question?',
        answer: 'Test Answer'
      });
      await faq.save();

      const res = await request(app).get('/api/faqs');
      expect(res.status).to.equal(200);
      expect(res.body[0].question).to.equal('Test Question?');
    });

    it('should return translated FAQs when language specified', async () => {
      const faq = new FAQ({
        question: 'Test Question?',
        answer: 'Test Answer',
        translations: new Map([
          ['hi', { question: 'टेस्ट प्रश्न?', answer: 'टेस्ट उत्तर' }]
        ])
      });
      await faq.save();

      const res = await request(app).get('/api/faqs?lang=hi');
      expect(res.status).to.equal(200);
      expect(res.body[0].question).to.equal('टेस्ट प्रश्न?');
    });
  });

  describe('Cache functionality', () => {
    it('should cache FAQs after first request', async () => {
      const faq = new FAQ({
        question: 'Test Question?',
        answer: 'Test Answer'
      });
      await faq.save();

      // First request - should set cache
      await request(app).get('/api/faqs');
      
      // Verify cache was set
      const cachedData = await cacheService.get('faqs_en');
      expect(cachedData).to.be.an('array');
      expect(cachedData[0].question).to.equal('Test Question?');
    });
  });
});