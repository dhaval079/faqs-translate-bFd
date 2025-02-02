// src/utils/translator.js
import axios from 'axios';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const subscriptionKey = process.env.AZURE_TRANSLATOR_KEY;
const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const location = process.env.AZURE_TRANSLATOR_REGION;

console.log('Translator config:', { subscriptionKey, endpoint, location });

export const translateText = async (text, targetLanguage) => {
    if (!text || !targetLanguage) {
        throw new Error('Text and target language are required');
    }

    if (!subscriptionKey || !endpoint || !location) {
        console.error('Translation service not properly configured');
        return text; // Return original text if translation service is not configured
    }

    try {
        const response = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
                'X-ClientTraceId': randomUUID()
            },
            params: {
                'api-version': '3.0',
                'to': targetLanguage,
                'textType': 'html' // Support HTML content in answers
            },
            data: [{
                'text': text
            }],
            timeout: 10000 // 10 second timeout
        });

        if (response.data && response.data[0] && response.data[0].translations && response.data[0].translations[0]) {
            return response.data[0].translations[0].text;
        } else {
            throw new Error('Invalid translation response structure');
        }
    } catch (error) {
        console.error('Translation error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            targetLanguage,
            textLength: text.length
        });

        // If we get a rate limit or temporary error, wait and retry once
        if (error.response?.status === 429 || error.response?.status === 500) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return translateText(text, targetLanguage);
        }

        return text; // Return original text as fallback
    }
};