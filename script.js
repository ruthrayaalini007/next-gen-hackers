document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const promptBtns = document.querySelectorAll('.prompt-btn');
    const micBtn = document.getElementById('mic-btn');
    const langSelect = document.getElementById('language-select');

    let currentLang = 'en';
    let isRecording = false;

    // Handle Language Selection
    langSelect.addEventListener('change', (e) => {
        currentLang = e.target.value;
        const greetings = {
            'en': "Language switched to English. How can I help you?",
            'es': "Idioma cambiado a Español. ¿Cómo puedo ayudarte?",
            'fr': "Langue changée en Français. Comment puis-je vous aider?",
            'hi': "भाषा हिंदी में बदल गई है। मैं आपकी कैसे मदद कर सकता हूँ?"
        };
        appendMessage(greetings[currentLang], 'ai-message');
        scrollToBottom();
    });

    // Handle Mic Button (Voice Simulation)
    micBtn.addEventListener('click', () => {
        if (!isRecording) {
            // Start recording
            isRecording = true;
            micBtn.classList.add('recording');
            userInput.placeholder = "Listening...";
            
            // Simulate voice processing time
            setTimeout(() => {
                isRecording = false;
                micBtn.classList.remove('recording');
                userInput.placeholder = "Ask about routes, delays, or stations...";
                userInput.value = "Are there any crowds on Line 4?";
                // Auto-submit
                chatForm.dispatchEvent(new Event('submit', { cancelable: true }));
            }, 3000);
        }
    });

    // Handle Quick Prompts
    promptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.innerText;
            handleUserMessage(text);
        });
    });

    // Handle Form Submit
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (text) {
            handleUserMessage(text);
            userInput.value = '';
        }
    });

    function handleUserMessage(text) {
        // Append user message
        appendMessage(text, 'user-message');
        
        // Show typing indicator
        typingIndicator.style.display = 'inline-block';
        
        // Scroll to bottom
        scrollToBottom();

        // Simulate AI Response delay
        setTimeout(() => {
            const response = generateAIResponse(text);
            typingIndicator.style.display = 'none';
            appendMessage(response, 'ai-message');
            scrollToBottom();
        }, 1200);
    }

    function appendMessage(text, className) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        
        messageDiv.innerHTML = `
            <p>${text}</p>
            <span class="time">${time}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateAIResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Handle Multilingual Responses (Simplified mock)
        if (currentLang === 'es') return "Lo siento, soy un prototipo y mis respuestas completas en español aún se están desarrollando. (Sorry, I'm a prototype and my full Spanish responses are still developing.)";
        if (currentLang === 'fr') return "Désolé, je suis un prototype et mes réponses complètes en français sont encore en cours de développement. (Sorry, I'm a prototype and my full French responses are still developing.)";
        if (currentLang === 'hi') return "क्षमा करें, मैं एक प्रोटोटाइप हूं और मेरे पूर्ण हिंदी उत्तर अभी भी विकसित हो रहे हैं। (Sorry, I'm a prototype and my full Hindi responses are still developing.)";

        // English Responses with Crowd & Real-time Info
        if (lowerInput.includes('train to downtown')) {
            return "The next train to Downtown Central (Line 4) departs in 2 minutes. ⚠️ <b>Alert:</b> This train currently has a <b>High Crowd Level</b>. If you prefer a more comfortable ride, the following train in 12 minutes is predicted to have Low crowds.";
        } else if (lowerInput.includes('delay') || lowerInput.includes('line 4') || lowerInput.includes('crowd')) {
            return "Line 4 is running on time but is currently <b>highly crowded</b>. However, Line 2 to Airport Terminal is experiencing a 14-minute delay due to a signal failure, with medium crowd levels. Would you like an alternative route?";
        } else if (lowerInput.includes('fastest route') || lowerInput.includes('home')) {
            return "The fastest route home from your location is taking the BX Bus from the Westside Hub. It arrives in 7 minutes, and the total trip will take about 22 minutes. Good news: Crowd levels on the BX line are currently <b>Low</b>.";
        } else if (lowerInput.includes('ticket')) {
            return "You have a monthly transit pass activated that is valid until the end of the month. No additional ticket is required for this trip.";
        } else {
            return "I'm analyzing the best transit options for that considering real-time crowd data and delays. Could you provide a more specific destination or station?";
        }
    }
});
