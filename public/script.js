document.addEventListener('DOMContentLoaded', () => {
    // New Elements
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginNameInput = document.getElementById('login-name');
    const mainApp = document.getElementById('main-app');
    const userNameDisplay = document.getElementById('user-name-display');
    const greetingTitle = document.getElementById('greeting-title');
    const toastContainer = document.getElementById('toast-container');
    const navItems = document.querySelectorAll('.nav-item');
    const initialAiMsg = document.getElementById('initial-ai-msg').querySelector('p');

    let userName = "Traveler";
    
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const promptBtns = document.querySelectorAll('.prompt-btn');
    const micBtn = document.getElementById('mic-btn');
    const langSelect = document.getElementById('language-select');

    let currentLang = 'en';
    let isRecording = false;

    // Login Handling
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredName = loginNameInput.value.trim();
        if (enteredName) {
            userName = enteredName;
            
            // Update UI elements
            userNameDisplay.innerText = userName;
            greetingTitle.innerText = `Good Evening, ${userName}`;
            initialAiMsg.innerText = `Hello ${userName}! I'm your TransitAI assistant. I can help you find optimal routes, check live departures, or notify you about disruptions. How can I assist you right now?`;
            
            // Hide Modal and show App
            loginModal.classList.add('hidden');
            mainApp.style.filter = 'blur(0)';
            mainApp.style.pointerEvents = 'auto';
            
            // Simulate AI initial personalization
            showToast(`Welcome aboard, ${userName}!`, 'ri-user-smile-line');
        }
    });

    // Sidebar Interaction Handling
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active to clicked
            item.classList.add('active');
            
            // Show toast message
            const featureName = item.innerText.trim();
            const iconClass = item.querySelector('i').className;
            if (featureName !== 'Assistant') {
                showToast(`Loading ${featureName} module...`, iconClass);
            } else {
                showToast(`Switched to Assistant`, iconClass);
            }
        });
    });

    // Toast Notification System
    function showToast(message, iconClass = 'ri-information-line') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

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

    async function handleUserMessage(text) {
        // Append user message
        appendMessage(text, 'user-message');
        
        // Show typing indicator
        typingIndicator.style.display = 'inline-block';
        
        // Scroll to bottom
        scrollToBottom();

        try {
            // Call our new Node.js backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    userName: userName,
                    currentLang: currentLang
                })
            });

            if (!response.ok) throw new Error("Network Error");
            
            const data = await response.json();
            
            typingIndicator.style.display = 'none';
            appendMessage(data.reply, 'ai-message');
            scrollToBottom();

        } catch (error) {
            typingIndicator.style.display = 'none';
            appendMessage("Sorry, I am having trouble connecting to my servers right now.", 'ai-message');
            scrollToBottom();
            console.error(error);
        }
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

    // Function to load real-time widget data from backend
    async function loadDepartures() {
        try {
            const response = await fetch('/api/departures');
            if (!response.ok) return;
            const data = await response.json();
            
            const departureList = document.querySelector('.departure-list');
            departureList.innerHTML = '';
            
            data.forEach(dep => {
                const itemHtml = `
                    <div class="departure-item">
                        <div class="dep-line ${dep.colorClass}">${dep.line}</div>
                        <div class="dep-details">
                            <span class="dep-dest">${dep.dest}</span>
                            <div class="dep-meta">
                                <span class="dep-status ${dep.statusClass}">${dep.status}</span>
                                <span class="crowd-level ${dep.crowdClass}"><i class="ri-group-fill"></i> ${dep.crowd}</span>
                            </div>
                        </div>
                        <div class="dep-time">${dep.time}</div>
                    </div>`;
                departureList.innerHTML += itemHtml;
            });
        } catch (e) {
            console.error("Could not load live departures:", e);
        }
    }

    // Call it initially
    loadDepartures();
});
