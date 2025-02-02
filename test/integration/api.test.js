// test/integration/api.test.js
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { FAQ } from '../../src/models/faq.js';
import { setupTestDB } from '../test-config.js';
import cacheService from '../../src/utils/cache.js';

describe('FAQ API', () => {
    setupTestDB();

    beforeEach(async () => {
        await FAQ.deleteMany({});
        // Clear cache
        const keys = ['faqs_en', 'faqs_es', 'faqs_hi', 'faqs_bn'];
        await Promise.all(keys.map(key => cacheService.del(key)));
    });

    describe('GET /api/faqs', () => {
        it('should return empty array initially', async () => {
            const response = await request(app)
                .get('/api/faqs');
            
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
            expect(response.body).to.have.lengthOf(0);
        });

        it('FAQ should be returned in different languages', async function() {
            this.timeout(5000); // Increase timeout for translation

            // Create a test FAQ with translations
            const faq = new FAQ({
                question: 'Test Question?',
                answer: 'Test Answer',
                isActive: true,
                translations: new Map([
                    ['es', {
                        question: '¿Pregunta de prueba?',
                        answer: 'Respuesta de prueba'
                    }]
                ])
            });
            await faq.save();

            // Test English (default)
            const enResponse = await request(app)
                .get('/api/faqs');
            
            expect(enResponse.status).to.equal(200);
            expect(enResponse.body).to.be.an('array');
            expect(enResponse.body[0].question).to.equal('Test Question?');

            // Test Spanish
            const esResponse = await request(app)
                .get('/api/faqs?lang=es');
            
            expect(esResponse.status).to.equal(200);
            expect(esResponse.body).to.be.an('array');
            expect(esResponse.body[0].question).to.equal('¿Pregunta de prueba?');
        });
    });

    describe('GET /api/faqs/:id', () => {
        it('should return single FAQ with translations', async function() {
            this.timeout(5000); // Increase timeout for translation

            const faq = new FAQ({
                question: 'Single FAQ Test?',
                answer: 'Single FAQ Answer',
                isActive: true,
                translations: new Map([
                    ['es', {
                        question: '¿Prueba individual?',
                        answer: 'Respuesta individual'
                    }]
                ])
            });
            await faq.save();

            const response = await request(app)
                .get(`/api/faqs/${faq._id}?lang=es`);

            expect(response.status).to.equal(200);
            expect(response.body.question).to.equal('¿Prueba individual?');
        });
    });
});