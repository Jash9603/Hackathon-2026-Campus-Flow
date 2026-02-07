require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGen() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = "gemini-2.5-pro"; // Exact name from list

    console.log(`Attempting generation with: ${modelName}`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you there?");
        console.log("Success!");
        console.log(result.response.text());
    } catch (error) {
        console.error("SDK Error:", error.message);
    }
}

testGen();
