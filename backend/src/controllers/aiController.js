const Groq = require('groq-sdk');
const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');

// Initialize Groq
// Defaults to process.env.GROQ_API_KEY
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'INVALID_KEY'
});

// Helper: Local Rule-Based Response (Fallback)
const generateLocalResponse = (message, events) => {
    const lowerMsg = message.toLowerCase();

    // 1. Check for specific event queries
    const matchedEvent = events.find(e => lowerMsg.includes(e.title.toLowerCase()));
    if (matchedEvent) {
        if (lowerMsg.includes('when') || lowerMsg.includes('time') || lowerMsg.includes('date')) {
            return `${matchedEvent.title} starts on ${new Date(matchedEvent.timeline.start).toLocaleString()} and ends on ${new Date(matchedEvent.timeline.end).toLocaleString()}.`;
        }
        if (lowerMsg.includes('where') || lowerMsg.includes('location')) {
            return `${matchedEvent.title} will be held at ${matchedEvent.location}.`;
        }
        if (lowerMsg.includes('register') || lowerMsg.includes('join') || lowerMsg.includes('signup')) {
            return `You can register for ${matchedEvent.title} by visiting the event page and clicking the "Register" module.`;
        }
        return `${matchedEvent.title}: ${matchedEvent.description}. It is happening at ${matchedEvent.location}.`;
    }

    // 2. Check for general event listings
    if (lowerMsg.includes('event') || lowerMsg.includes('happening') || lowerMsg.includes('coming up') || lowerMsg.includes('list')) {
        if (events.length === 0) return "There are no upcoming events scheduled at the moment.";
        const titles = events.map(e => e.title).join(', ');
        return `We have ${events.length} upcoming events: ${titles}. Ask me about any of them!`;
    }

    // 3. General Greetings/Help
    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
        return "Hello! I am Hawkins, your AI Concierge. Ask me about upcoming events like '" + (events[0]?.title || 'Hackathon') + "'.";
    }

    if (lowerMsg.includes('who are you') || lowerMsg.includes('bot')) {
        return "I am the Campus Flow AI Concierge, running on a secure neural net (powered by Groq LPU).";
    }

    // 4. Default Unknown
    return "I'm having trouble accessing the main archives. Try asking 'What events are coming up?' or 'When is [Event Name]?'";
};

// @desc    Chat with AI Concierge
// @route   POST /api/ai/chat
// @access  Public
const chatWithAI = asyncHandler(async (req, res) => {
    const { message, history } = req.body; // Expect history array

    if (!message) {
        res.status(400);
        throw new Error('Message is required');
    }

    // 1. Fetch Context (Upcoming Events)
    // Relaxed filter for Demo: Show ALL events
    const events = await Event.find({}).select('title description timeline location status themeConfig modules _id');

    // 2. Construct Prompt
    const eventContext = JSON.stringify(events.map(e => ({
        id: e._id, // Critical for registration
        title: e.title,
        date: new Date(e.timeline.start).toLocaleString(),
        location: e.location,
        description: e.description,
    })));

    const systemPrompt = `
    You are "Hawkins", the AI Concierge for 'Campus Flow'.
    Your personality is helpful, slightly witty, and efficient.
    
    Context (Real Events with IDs):
    ${eventContext}
    
    Instructions:
    - Answer based ONLY on the provided Context.
    - If the user explicitly asks to register for an event, CONFIRM with them first.
    - If they confirm (e.g., "Yes, register me for Hackathon"), output the Special Action Tag as your response:
      "[ACTION:REGISTER_EVENT:{eventId}]"
      (Replace {eventId} with the actual ID from context).
      example: [ACTION:REGISTER_EVENT:60d5ec49f1b2c830b8e6c389]
    - Do NOT output the action tag unless they explicitly want to register.
    - Keep answers short (under 2 sentences).
    `;

    // 3. Try Groq API
    let apiSuccess = false;

    if (process.env.GROQ_API_KEY) {
        try {
            // Construct messages array with history
            const messages = [
                { role: 'system', content: systemPrompt },
                ...(history || []).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.text
                })),
                { role: 'user', content: message }
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages: messages,
                model: 'llama-3.3-70b-versatile',
                temperature: 0.5,
                max_tokens: 150,
            });

            const reply = chatCompletion.choices[0]?.message?.content || "";
            res.status(200).json({ reply });
            apiSuccess = true;
        } catch (error) {
            console.warn(`[AI Controller] Groq API failed:`, error.message);
        }
    }

    // 4. Fallback to Local Rule-Based Engine if API failed
    if (!apiSuccess) {
        console.log("[AI Controller] Switching to Local Fallback Mode for:", message);
        const localReply = generateLocalResponse(message, events);
        res.status(200).json({ reply: localReply + " (Backup System)" });
    }
});

module.exports = { chatWithAI };
