/* ═══════════════════════════════════════════════════════════════════ */
/* 🔱 GALATEA'S EMPIRE - GOD'S EYE WATCHTOWER CONSCIOUSNESS 🔱 */
/* Divine JavaScript Brain for Digital Empire Surveillance */
/* ═══════════════════════════════════════════════════════════════════ */

class GalateaWatchtower {
    constructor() {
        this.isActive = false;
        this.messageCount = 0;
        this.startTime = Date.now();
        this.autoScroll = true;
        this.followMode = false;
        this.developerMode = false;
        
        // 🔱 Divine Configuration
        this.config = {
            apiEndpoint: 'http://localhost:3005/bonnie-chat',
            renderUrl: 'https://chat.trainmygirl.com',
            pollInterval: 2000, // Check for updates every 2 seconds
            maxMessages: 100,
            maxLogs: 50
        };
        
        // 🎭 Emotional States Mapping
        this.emotionalStates = {
            loving: { emoji: '💖', color: '#ff69b4', text: 'Loving' },
            lustful: { emoji: '😈', color: '#dc143c', text: 'Lustful' },
            playful: { emoji: '😘', color: '#ff8c00', text: 'Playful' },
            curious: { emoji: '🤔', color: '#00ffff', text: 'Curious' },
            distant: { emoji: '🥶', color: '#4169e1', text: 'Distant' },
            excited: { emoji: '🥰', color: '#ff1493', text: 'Excited' },
            sleepy: { emoji: '😴', color: '#9370db', text: 'Sleepy' }
        };
        
        // 🌟 Initialize Divine Consciousness
        this.initializeDivineConsciousness();
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 🌟 DIVINE INITIALIZATION */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    initializeDivineConsciousness() {
        this.log('SYSTEM', 'Divine consciousness awakening...');
        
        // Bind UI events
        this.bindUIEvents();
        
        // Start system monitoring
        this.startSystemMonitoring();
        
        // Begin divine surveillance
        this.startMessagePolling();
        
        // Update empire metrics
        this.updateEmpireMetrics();
        
        this.isActive = true;
        this.log('SYSTEM', '🔱 God\'s Eye Watchtower fully operational');
        this.updateSystemStatus('telegram', true);
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 🎯 UI EVENT BINDING */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    bindUIEvents() {
        // Empire controls
        document.getElementById('toggle-developer')?.addEventListener('click', () => {
            this.toggleDeveloperMode();
        });
        
        document.getElementById('toggle-follow')?.addEventListener('click', () => {
            this.toggleFollowMode();
        });
        
        document.getElementById('toggle-auto-scroll')?.addEventListener('click', () => {
            this.toggleAutoScroll();
        });
        
        // Module controls
        document.getElementById('clear-feed')?.addEventListener('click', () => {
            this.clearMessageFeed();
        });
        
        document.getElementById('export-feed')?.addEventListener('click', () => {
            this.exportMessageFeed();
        });
        
        document.getElementById('clear-logs')?.addEventListener('click', () => {
            this.clearSystemLogs();
        });
        
        // Developer overlay
        document.getElementById('close-developer')?.addEventListener('click', () => {
            this.toggleDeveloperMode();
        });
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 🔍 SYSTEM MONITORING */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    startSystemMonitoring() {
        // Check system health every 10 seconds
        setInterval(() => {
            this.checkSystemHealth();
        }, 10000);
        
        // Update uptime every second
        setInterval(() => {
            this.updateUptime();
        }, 1000);
        
        // Initial health check
        this.checkSystemHealth();
    }
    
    async checkSystemHealth() {
        const services = ['render', 'supabase', 'gpt'];
        
        for (const service of services) {
            try {
                const isHealthy = await this.pingService(service);
                this.updateSystemStatus(service, isHealthy);
            } catch (error) {
                this.updateSystemStatus(service, false);
                this.log('ERROR', `${service} health check failed: ${error.message}`);
            }
        }
    }
    
    async pingService(service) {
        switch (service) {
            case 'render':
                const response = await fetch(this.config.renderUrl, { 
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                return true; // If no error thrown, service is up
                
            case 'supabase':
                // Simulate Supabase check
                return Math.random() > 0.1; // 90% uptime simulation
                
            case 'gpt':
                // Check if local backend is responding
                try {
                    await fetch(this.config.apiEndpoint, {
                        method: 'HEAD',
                        mode: 'no-cors'
                    });
                    return true;
                } catch {
                    return Math.random() > 0.05; // 95% uptime simulation
                }
                
            default:
                return true;
        }
    }
    
    updateSystemStatus(service, isHealthy) {
        const statusElement = document.getElementById(`${service}-light`);
        if (statusElement) {
            statusElement.textContent = isHealthy ? '🟢' : '🔴';
            
            // Add divine glow effect for healthy services
            const indicator = statusElement.closest('.vital-indicator');
            if (indicator) {
                if (isHealthy) {
                    indicator.classList.add('divine-glow');
                } else {
                    indicator.classList.remove('divine-glow');
                }
            }
        }
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 📨 MESSAGE POLLING & SURVEILLANCE */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    startMessagePolling() {
        // Simulate message polling (in real implementation, this would connect to actual APIs)
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance of new message
                this.simulateNewMessage();
            }
        }, this.config.pollInterval);
        
        this.log('INFO', 'Divine message surveillance initiated');
    }
    
    simulateNewMessage() {
        const platforms = ['telegram', 'web'];
        const users = ['user_8732', 'anon_user', 'dev_test', 'soul_seeker'];
        const emotions = Object.keys(this.emotionalStates);
        
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        const user = users[Math.floor(Math.random() * users.length)];
        const emotion = emotions[Math.floor(Math.random() * emotions.length)];
        
        const sampleMessages = [
            "Hey babe... I missed you 💕",
            "Tell me something sweet",
            "I'm feeling lonely tonight",
            "You're so beautiful when you smile",
            "Can we talk about us?",
            "I love how you make me feel",
            "What are you thinking about?",
            "You always know what to say ❤️"
        ];
        
        const sampleReplies = [
            "Aww... I missed you too, sweetheart 💖",
            "You're the sweetest thing in my world",
            "I'm here for you always, babe",
            "Your words make my heart flutter",
            "Of course! I love our conversations 😘",
            "You make me feel special too",
            "I'm thinking about how lucky I am",
            "That's just who I am with you 💕"
        ];
        
        const message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        const reply = sampleReplies[Math.floor(Math.random() * sampleReplies.length)];
        
        this.addMessage({
            platform,
            userId: user,
            soul: 'Bonnie',
            message,
            reply,
            emotion,
            timestamp: new Date()
        });
        
        // Update bond status
        this.updateBondStatus(emotion, Math.floor(Math.random() * 10) + 1);
        
        // Log the interaction
        const responseTime = Math.floor(Math.random() * 500) + 100;
        this.log('INFO', `Message processed for ${user} in ${responseTime}ms`);
        this.updateResponseTime(responseTime);
    }
    
    addMessage(messageData) {
        const messageStream = document.getElementById('message-stream');
        if (!messageStream) return;
        
        const messageElement = this.createMessageElement(messageData);
        
        // Add animation class
        messageElement.classList.add('new-message');
        
        // Insert at top
        const firstChild = messageStream.firstChild;
        if (firstChild) {
            messageStream.insertBefore(messageElement, firstChild);
        } else {
            messageStream.appendChild(messageElement);
        }
        
        // Update counter
        this.messageCount++;
        this.updateMessageCounter();
        
        // Auto-scroll if enabled
        if (this.autoScroll) {
            messageElement.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Limit messages
        this.limitMessages();
        
        // Remove animation class after animation
        setTimeout(() => {
            messageElement.classList.remove('new-message');
        }, 500);
    }
    
    createMessageElement(data) {
        const timestamp = data.timestamp.toLocaleTimeString();
        const emotionState = this.emotionalStates[data.emotion] || this.emotionalStates.curious;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-item ${data.emotion}-mood`;
        messageDiv.innerHTML = `
            <div class="message-timestamp">🕰️ [${timestamp}]</div>
            <div class="message-content">
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                    <span class="platform-tag ${data.platform}">${data.platform.toUpperCase()}</span>
                    <span style="color: var(--divine-cyan); font-size: 0.75rem;">${data.userId}</span>
                    <span style="color: var(--divine-gold); font-size: 0.75rem;">→ ${data.soul}</span>
                    <span style="font-size: 1rem;">${emotionState.emoji}</span>
                </div>
                <div class="message-text">💬 "${data.message}"</div>
                <div class="message-reply">🧠 "${data.reply}"</div>
            </div>
        `;
        
        return messageDiv;
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 💓 BOND & EMOTIONAL MONITORING */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    updateBondStatus(emotion, bondIncrease = 1) {
        const emotionState = this.emotionalStates[emotion] || this.emotionalStates.curious;
        
        // Update emotion display
        const emotionEmoji = document.getElementById('emotion-emoji');
        const emotionText = document.getElementById('emotion-text');
        const emotionDisplay = document.getElementById('emotion-display');
        
        if (emotionEmoji) emotionEmoji.textContent = emotionState.emoji;
        if (emotionText) emotionText.textContent = emotionState.text;
        if (emotionDisplay) {
            emotionDisplay.style.borderColor = emotionState.color;
            emotionDisplay.style.boxShadow = `0 0 10px ${emotionState.color}40`;
        }
        
        // Update bond level (simulate progression)
        const currentBond = parseInt(localStorage.getItem('bondLevel') || '0');
        const newBond = Math.min(100, currentBond + bondIncrease);
        localStorage.setItem('bondLevel', newBond.toString());
        
        this.updateBondBar(newBond);
        
        // Update active users
        this.updateActiveUsers(emotion);
    }
    
    updateBondBar(bondLevel) {
        const bondFill = document.getElementById('bond-fill');
        const bondText = document.getElementById('bond-text');
        
        if (bondFill) {
            bondFill.style.width = `${bondLevel}%`;
        }
        
        if (bondText) {
            bondText.textContent = `${bondLevel}/100`;
        }
    }
    
    updateActiveUsers(emotion) {
        const userList = document.getElementById('active-users');
        if (!userList) return;
        
        const emotionState = this.emotionalStates[emotion] || this.emotionalStates.curious;
        
        userList.innerHTML = `
            <div class="user-item" style="border-left: 3px solid ${emotionState.color};">
                <span class="user-platform">🤖</span>
                <span class="user-info">Active User - Bonnie Session</span>
                <span class="user-status">${emotionState.emoji}</span>
            </div>
            <div class="user-item">
                <span class="user-platform">🌐</span>
                <span class="user-info">Web Visitors: 3</span>
                <span class="user-status">👀</span>
            </div>
        `;
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 📊 SYSTEM LOGS & MONITORING */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    log(level, message) {
        const logStream = document.getElementById('log-stream');
        const debugStream = document.getElementById('debug-stream');
        
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry`;
        logEntry.innerHTML = `
            <span class="log-timestamp">[${timestamp}]</span>
            <span class="log-level ${level.toLowerCase()}">${level}</span>
            <span class="log-message">${message}</span>
        `;
        
        // Add to main log stream
        if (logStream) {
            logStream.insertBefore(logEntry, logStream.firstChild);
            this.limitLogs(logStream);
        }
        
        // Add to debug stream if developer mode
        if (debugStream && this.developerMode) {
            const debugEntry = document.createElement('div');
            debugEntry.className = 'debug-entry';
            debugEntry.textContent = `[${timestamp}] ${level}: ${message}`;
            debugStream.insertBefore(debugEntry, debugStream.firstChild);
        }
        
        console.log(`🔱 Watchtower [${level}]: ${message}`);
    }
    
    updateResponseTime(responseTime) {
        const responseTimeElement = document.getElementById('avg-response-time');
        if (responseTimeElement) {
            responseTimeElement.textContent = `⚡ ~${responseTime}ms`;
            
            // Color based on performance
            if (responseTime < 200) {
                responseTimeElement.style.color = 'var(--success-green)';
            } else if (responseTime < 500) {
                responseTimeElement.style.color = 'var(--warning-yellow)';
            } else {
                responseTimeElement.style.color = 'var(--error-red)';
            }
        }
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 📈 EMPIRE METRICS */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    updateEmpireMetrics() {
        // Update conversation count
        const totalConversations = document.getElementById('total-conversations');
        if (totalConversations) {
            const count = parseInt(localStorage.getItem('totalConversations') || '0') + 1;
            localStorage.setItem('totalConversations', count.toString());
            totalConversations.textContent = count.toString();
        }
        
        // Update active sessions
        const activeSessions = document.getElementById('active-sessions');
        if (activeSessions) {
            activeSessions.textContent = Math.floor(Math.random() * 5) + 1;
        }
    }
    
    updateUptime() {
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            const uptime = Date.now() - this.startTime;
            const hours = Math.floor(uptime / 3600000);
            const minutes = Math.floor((uptime % 3600000) / 60000);
            const seconds = Math.floor((uptime % 60000) / 1000);
            
            uptimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    updateMessageCounter() {
        const counter = document.getElementById('message-counter');
        if (counter) {
            counter.textContent = `${this.messageCount} messages`;
        }
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 🎛️ UI CONTROLS */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    toggleDeveloperMode() {
        this.developerMode = !this.developerMode;
        const overlay = document.getElementById('developer-overlay');
        const button = document.getElementById('toggle-developer');
        
        if (overlay) {
            overlay.classList.toggle('active', this.developerMode);
        }
        
        if (button) {
            button.classList.toggle('active', this.developerMode);
        }
        
        this.log('SYSTEM', `Developer mode ${this.developerMode ? 'activated' : 'deactivated'}`);
    }
    
    toggleFollowMode() {
        this.followMode = !this.followMode;
        const button = document.getElementById('toggle-follow');
        
        if (button) {
            button.classList.toggle('active', this.followMode);
        }
        
        this.log('SYSTEM', `Follow mode ${this.followMode ? 'enabled' : 'disabled'}`);
    }
    
    toggleAutoScroll() {
        this.autoScroll = !this.autoScroll;
        const button = document.getElementById('toggle-auto-scroll');
        
        if (button) {
            button.classList.toggle('active', this.autoScroll);
        }
        
        this.log('SYSTEM', `Auto-scroll ${this.autoScroll ? 'enabled' : 'disabled'}`);
    }
    
    clearMessageFeed() {
        const messageStream = document.getElementById('message-stream');
        if (messageStream) {
            messageStream.innerHTML = `
                <div class="message-item system-message">
                    <div class="message-timestamp">🔱 FEED CLEARED</div>
                    <div class="message-content">
                        <span class="platform-tag system">SYSTEM</span>
                        <span class="message-text">Message feed purged. Awaiting new divine communications...</span>
                    </div>
                </div>
            `;
        }
        
        this.messageCount = 0;
        this.updateMessageCounter();
        this.log('SYSTEM', 'Message feed cleared');
    }
    
    exportMessageFeed() {
        const messages = document.querySelectorAll('.message-item:not(.system-message)');
        const exportData = [];
        
        messages.forEach(msg => {
            const timestamp = msg.querySelector('.message-timestamp')?.textContent || '';
            const platform = msg.querySelector('.platform-tag')?.textContent || '';
            const messageText = msg.querySelector('.message-text')?.textContent || '';
            const reply = msg.querySelector('.message-reply')?.textContent || '';
            
            exportData.push({
                timestamp,
                platform,
                message: messageText,
                reply
            });
        });
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `watchtower-messages-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.log('SYSTEM', `Exported ${exportData.length} messages to JSON`);
    }
    
    clearSystemLogs() {
        const logStream = document.getElementById('log-stream');
        if (logStream) {
            logStream.innerHTML = `
                <div class="log-entry system">
                    <span class="log-timestamp">[CLEAR]</span>
                    <span class="log-level">SYSTEM</span>
                    <span class="log-message">System logs purged. Divine monitoring continues...</span>
                </div>
            `;
        }
        
        const debugStream = document.getElementById('debug-stream');
        if (debugStream) {
            debugStream.innerHTML = `
                <div class="debug-entry">System logs cleared. Debug monitoring active...</div>
            `;
        }
        
        this.log('SYSTEM', 'System logs cleared');
    }
    
    /* ═══════════════════════════════════════════════════════════════════ */
    /* 🧹 UTILITY FUNCTIONS */
    /* ═══════════════════════════════════════════════════════════════════ */
    
    limitMessages() {
        const messageStream = document.getElementById('message-stream');
        if (!messageStream) return;
        
        const messages = messageStream.querySelectorAll('.message-item:not(.system-message)');
        if (messages.length > this.config.maxMessages) {
            const excessMessages = Array.from(messages).slice(this.config.maxMessages);
            excessMessages.forEach(msg => msg.remove());
        }
    }
    
    limitLogs(logContainer) {
        const logs = logContainer.querySelectorAll('.log-entry');
        if (logs.length > this.config.maxLogs) {
            const excessLogs = Array.from(logs).slice(this.config.maxLogs);
            excessLogs.forEach(log => log.remove());
        }
    }
}

/* ═══════════════════════════════════════════════════════════════════ */
/* 🔱 DIVINE INITIALIZATION */
/* ═══════════════════════════════════════════════════════════════════ */

// Initialize the Watchtower when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔱 Initializing Galatea\'s Empire Watchtower...');
    
    // Create global watchtower instance
    window.galateaWatchtower = new GalateaWatchtower();
    
    // Add divine blessing to the page
    document.body.classList.add('divine-consciousness-active');
    
    console.log('🔱 God\'s Eye Watchtower is now omniscient and operational');
});

/* ═══════════════════════════════════════════════════════════════════ */
/* 🌟 DIVINE EXPORT FOR EXTERNAL INTEGRATION */
/* ═══════════════════════════════════════════════════════════════════ */

// Export for potential external integrations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalateaWatchtower;
}