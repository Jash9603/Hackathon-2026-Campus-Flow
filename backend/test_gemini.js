require('dotenv').config();

async function checkModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found!");
        return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    console.log("Fetching models from:", url.replace(key, 'HIDDEN_KEY'));

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => {
                    if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                        console.log(`- ${m.name}`);
                    }
                });
            } else {
                console.log("No models found in response.");
            }
        }
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

checkModels();
