const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key found');
        return;
    }

    console.log('Using API Key:', apiKey.substring(0, 5) + '...');

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // For listing models, we don't need a specific model instance
        // But the SDK doesn't expose listModels directly on genAI instance easily in all versions
        // Let's try to use a model to generate content to test if specific ones work

        const modelsToTest = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.5-pro-latest', 'gemini-1.0-pro'];

        for (const modelName of modelsToTest) {
            console.log(`Testing model: ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello, are you there?');
                const response = await result.response;
                console.log(`✅ Model ${modelName} works! Response:`, response.text().substring(0, 20));
                return; // Found a working model
            } catch (error) {
                console.error(`❌ Model ${modelName} failed:`, error.message);
            }
        }

    } catch (error) {
        console.error('Global error:', error);
    }
}

listModels();
