// src/utils/translator.js
const axios = require('axios');

const subscriptionKey = process.env.AZURE_TRANSLATOR_KEY;
const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const location = process.env.AZURE_TRANSLATOR_REGION;

const translateText = async (text, targetLanguage) => {
    try {
        const response = await axios({
            baseURL: endpoint,
            url: '/translate',
            method: 'post',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey,
                'Ocp-Apim-Subscription-Region': location,
                'Content-type': 'application/json',
            },
            params: {
                'api-version': '3.0',
                'to': targetLanguage
            },
            data: [{
                'text': text
            }]
        });

        return response.data[0].translations[0].text;
    } catch (error) {
        console.error('Translation error:', error.response?.data || error.message);
        return text; // Return original text as fallback
    }
};

module.exports = { translateText };