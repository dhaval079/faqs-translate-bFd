// test/integration/admin.test.js
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app.js';
import { FAQ } from '../../src/models/faq.js';
import { setupTestDB } from '../test-config.js';

describe('Admin Routes', () => {
    setupTestDB();

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
        });
    });

    describe('GET /admin/faqs/:id/edit', () => {
        it('should get FAQ edit page', async () => {
            // First create a FAQ
            const faq = new FAQ({
                question: 'Test Question',
                answer: 'Test Answer',
                isActive: true
            });
            await faq.save();

            // Then try to get its edit page
            const res = await request(app)
                .get(`/admin/faqs/${faq._id}/edit`);
            
            expect(res.status).to.equal(200);
        });
    });

    describe('PUT /admin/faqs/:id', () => {
        it('should update FAQ', async () => {
            // Create a FAQ first
            const faq = new FAQ({
                question: 'Original Question',
                answer: 'Original Answer',
                isActive: true
            });
            await faq.save();

            // Update the FAQ
            await request(app)
                .put(`/admin/faqs/${faq._id}`)
                .send({
                    question: 'Updated Question',
                    answer: 'Updated Answer'
                })
                .expect(302); // Redirect after success

            // Verify the update
            const updatedFaq = await FAQ.findById(faq._id);
            expect(updatedFaq.question).to.equal('Updated Question');
            expect(updatedFaq.answer).to.equal('Updated Answer');
        });
    });

    describe('DELETE /admin/faqs/:id', () => {
        it('should delete FAQ', async () => {
            // Create a FAQ first
            const faq = new FAQ({
                question: 'Test Question',
                answer: 'Test Answer'
            });
            await faq.save();

            // Delete the FAQ
            const res = await request(app)
                .delete(`/admin/faqs/${faq._id}`);

            expect(res.status).to.equal(302); // Redirect after success

            // Verify deletion
            const deletedFaq = await FAQ.findById(faq._id);
            expect(deletedFaq).to.be.null;
        });
    });
});