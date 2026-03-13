const express = require('express');
const cors = require('cors');
const path = require('path');
// const OpenAI = require('openai'); // Uncomment when you have an API key

// NOTE: You will need to install dependencies first!
// Run: npm install express cors dotenv openai

// Load environment variables if using a .env file
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML/CSS/JS from a 'public' folder

/* 
// --- OPENAI SETUP (Requires API Key) ---
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});
*/

// --- API ENDPOINTS ---

// 1. Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, userName, currentLang } = req.body;

        console.log(`Received message from ${userName} (${currentLang}): ${message}`);

        /* 
        // REAL AI IMPLEMENTATION (Uncomment when you have OpenAI API Key)
        
        const systemPrompt = `You are TransitAI, a helpful public transit assistant. 
        The user's name is ${userName}. Respond concisely in the language code: ${currentLang}. 
        Provide helpful transit advice, routes, and simulate crowd data if asked.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        const aiText = response.choices[0].message.content;
        res.json({ reply: aiText });
        */

        // MOCK BACKEND IMPLEMENTATION (Works immediately without API key)
        let reply = "";
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('train to downtown')) {
            reply = `The next train to Downtown Central (Line 4) departs in 2 minutes. ⚠️ <b>Alert:</b> This train currently has a <b>High Crowd Level</b>.`;
        } else if (lowerMsg.includes('delay') || lowerMsg.includes('line 4')) {
            reply = `Line 4 is running on time but is currently highly crowded. Line 2 is experiencing a 14-minute delay due to a signal failure.`;
        } else {
            // Echo back to prove backend works
            reply = `Server received your message, ${userName}: "${message}". I am analyzing the best transit options for that right now.`;
        }

        // Simulate network delay to make it feel real
        setTimeout(() => {
            res.json({ reply: reply });
        }, 1000);

    } catch (error) {
        console.error("Error in chat endpoint:", error);
        res.status(500).json({ error: "Sorry, I encountered a server error." });
    }
});

// 2. Live Departures Endpoint (Mock Data for Widgets)
app.get('/api/departures', (req, res) => {
    // This data would normally come from a real Transit API
    const departures = [
        { id: 1, line: "L4", colorClass: "line-red", dest: "Downtown Central", status: "On Time", statusClass: "on-time", crowd: "High", crowdClass: "crowd-high", time: "2 min" },
        { id: 2, line: "L2", colorClass: "line-blue", dest: "Airport Terminal", status: "Delayed", statusClass: "delayed", crowd: "Med", crowdClass: "crowd-med", time: "14 min" },
        { id: 3, line: "BX", colorClass: "line-green", dest: "Westside Hub", status: "On Time", statusClass: "on-time", crowd: "Low", crowdClass: "crowd-low", time: "7 min" }
    ];
    res.json(departures);
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 TransitAI Backend server running literally on http://localhost:${PORT}`);
    console.log(`📁 Make sure your index.html, style.css, and script.js are moved into a folder named "public"!`);
});
