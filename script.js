const STORAGE_KEY = 'communityMessages';

// Load messages from localStorage
function loadMessages() {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [];
}

// Save messages to localStorage
function saveMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// Format date and time
function formatDateTime(date) {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Display all messages
function displayMessages() {
    const messages = loadMessages();
    const messagesDisplay = document.getElementById('messagesDisplay');
    
    if (messages.length === 0) {
        messagesDisplay.innerHTML = '<div class="no-messages">No messages yet. Be the first to share something! ✨</div>';
        return;
    }

    messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    messagesDisplay.innerHTML = messages.map(message => `
        <div class="message">
            <div class="message-header">
                <span class="message-author">${escapeHtml(message.author)}</span>
                <span class="message-time">${formatDateTime(new Date(message.timestamp))}</span>
            </div>
            <div class="message-content">${escapeHtml(message.content)}</div>
        </div>
    `).join('');
}

// Add new message
function addMessage(author, content) {
    const messages = loadMessages();
    const newMessage = {
        id: Date.now(),
        author: author.trim(),
        content: content.trim(),
        timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    saveMessages(messages);
    displayMessages();
}

// Handle form submission
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const authorName = document.getElementById('authorName').value;
    const messageText = document.getElementById('messageText').value;
    
    if (authorName.trim() && messageText.trim()) {
        addMessage(authorName, messageText);
        
        // Clear form
        document.getElementById('authorName').value = '';
        document.getElementById('messageText').value = '';
        
        // Show feedback
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '✅ Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 2000);
    }
});

// Load and display messages on page load
document.addEventListener('DOMContentLoaded', displayMessages);

// Auto-refresh messages every 10 seconds
setInterval(displayMessages, 10000);
