document.addEventListener('DOMContentLoaded', function() {
    // Get all menu items and the content area
    const menuItems = document.querySelectorAll('[data-content]');
    const contentArea = document.getElementById('content-area');
    
    // Templates for different content
    const templates = {
        review: `
            <div class="review-content">
                <h3>Topics to Review</h3>
                <div class="topic-list" id="reviewTopicsList">
                    <!-- Content will be loaded from backend -->
                    Loading review topics...
                </div>
            </div>
        `,
        add: `
            <div class="add-content">
                <h3>Add New Topic</h3>
                <form id="addTopicForm">
                    <input type="text" placeholder="Topic name" required>
                    <button type="submit">Create</button>
                </form>
            </div>
        `,
        chat: `
            <div class="chat-content">
                <h3>Chat with AI</h3>
                <div class="messages" id="chatMessages"></div>
                <input type="text" placeholder="Ask me anything..." id="chatInput">
                <button id="sendMessage">Send</button>
            </div>
        `
    };

    // Add click handlers to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const contentType = this.getAttribute('data-content');
            loadContent(contentType);
        });
    });

    function loadContent(type) {
        // Replace the greeting with the selected content
        contentArea.innerHTML = templates[type];
        contentArea.classList.add('active-content');
        
        // Initialize the loaded content
        switch(type) {
            case 'review':
                fetchReviewTopics();
                break;
            case 'add':
                setupAddTopicForm();
                break;
            case 'chat':
                setupChat();
                break;
        }
    }

    // Example function to fetch review topics
    async function fetchReviewTopics() {
        try {
            const response = await fetch('/api/topics/review');
            const topics = await response.json();
            const list = document.getElementById('reviewTopicsList');
            list.innerHTML = '';
            
            topics.forEach(topic => {
                const item = document.createElement('div');
                item.className = 'topic-item';
                item.innerHTML = `
                    <h4>${topic.title}</h4>
                    <p>Last reviewed: ${topic.last_reviewed || 'Never'}</p>
                `;
                list.appendChild(item);
            });
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('reviewTopicsList').innerHTML = 
                '<p>Error loading topics. Please try again.</p>';
        }
    }

    // Example function to setup the add topic form
    function setupAddTopicForm() {
        document.getElementById('addTopicForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            const topicName = input.value.trim();
            
            if (topicName) {
                try {
                    const response = await fetch('/api/topics', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title: topicName })
                    });
                    
                    if (response.ok) {
                        input.value = '';
                        alert('Topic created successfully!');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error creating topic. Please try again.');
                }
            }
        });
    }

    // Example function to setup the chat
    function setupChat() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendMessage');
        const messagesContainer = document.getElementById('chatMessages');
        
        sendButton.addEventListener('click', async function() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                messagesContainer.innerHTML += `<div class="user-message">You: ${message}</div>`;
                chatInput.value = '';
                
                // Get AI response
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ message })
                    });
                    
                    const data = await response.json();
                    messagesContainer.innerHTML += `<div class="ai-message">AI: ${data.reply}</div>`;
                } catch (error) {
                    console.error('Error:', error);
                    messagesContainer.innerHTML += `<div class="error">Error getting response</div>`;
                }
            }
        });
    }
});

