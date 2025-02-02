const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const FAQ = require('../../src/models/faq');

describe('Admin Routes', () => {
  before(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  after(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await FAQ.deleteMany({});
  });

  describe('POST /admin/faqs/create', () => {
    it('should create new FAQ with translations', async () => {
      const res = await request(app)
        .post('/admin/faqs/create')
        .send({
          question: 'Test Question?',
          answer: 'Test Answer'
        });

      expect(res.status).to.equal(302); // Redirect after success
      
      const faq = await FAQ.findOne({ question: 'Test Question?' });
      expect(faq).to.exist;
      expect(faq.translations.size).to.be.greaterThan(0);
    });
  });
});