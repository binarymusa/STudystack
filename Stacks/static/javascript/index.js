document.addEventListener('DOMContentLoaded', function() {
    const topicButtons = document.querySelectorAll('#topic');
    const contentDisplay = document.getElementById('contentDisplay');
    const bottomButtons = document.getElementById('bottomButtons');
    const greetLine = document.querySelector('greetings');
    
    // Store the original buttons container
    const originalButtonsContainer = document.querySelector('.position-relative.w-100.flex-grow-1.flex-column');
    
    // Templates for different content views
    const reviewTemplate = `
        <h5>Topics to Review</h5>
        <div class="topic-list" id="reviewTopicsList">
            <!-- Content will be loaded from backend -->
            Loading review topics...
        </div>
    `;
    
    const addTemplate = `
        <h5>Add New Topics</h5>
        <form id="addTopicForm">
            <input type="text" placeholder="Topic name" required>
            <button type="submit">Create Topic</button>
        </form>
    `;
    
    const chatTemplate = `
        <h5>...</h3>
        <div class="chat-container ">
            <div class="messages" id="chatMessages"></div>
            <input class="bg-dark text-white" type="text" placeholder="phrase a question..." id="chatInput">
            <button class="text-white rounded-3 "  style="background: #404045" id="sendMessage">Send</button>
        </div>
    `;
    
    // Handle button clicks
    topicButtons.forEach(button => {
        button.addEventListener('click', function() {
            const contentType = this.getAttribute('data-content');
            // greetLine.remove()
            
            // Move all buttons to bottom
            bottomButtons.innerHTML = '';
            topicButtons.forEach(btn => {
                const clone = btn.cloneNode(true);
                bottomButtons.appendChild(clone);
            });
            
            // Show buttons at bottom and hide original
            bottomButtons.classList.remove('hidden');
            originalButtonsContainer.style.display = 'none';
            
            // Load appropriate content
            loadContent(contentType);
        });
    });
    
    function loadContent(type) {
        // Clear current content
        contentDisplay.innerHTML = '';
        
        // Load the appropriate template
        switch(type) {
            case 'review':
                contentDisplay.innerHTML = reviewTemplate;
                fetchReviewTopics();
                break;
            case 'add':
                contentDisplay.innerHTML = addTemplate;
                setupAddTopicForm();
                break;
            case 'chat':
                contentDisplay.innerHTML = chatTemplate;
                setupChat();
                break;
        }
    }
    
    // Fetch topics to review from backend
    async function fetchReviewTopics() {
        try {
            const response = await fetch('/api/topics/review');
            const topics = await response.json();
            
            const list = document.getElementById('reviewTopicsList');
            list.innerHTML = '';
            
            if (topics.length === 0) {
                list.innerHTML = '<p>No topics to review at this time.</p>';
                return;
            }
            
            topics.forEach(topic => {
                const item = document.createElement('div');
                item.className = 'topic-item';
                item.innerHTML = `
                    <h4>${topic.title}</h4>
                    <p>Last reviewed: ${topic.last_reviewed || 'Never'}</p>
                    <button class="start-review" data-id="${topic.id}">Start Review</button>
                `;
                list.appendChild(item);
            });
        } catch (error) {
            console.error('Error fetching review topics:', error);
            document.getElementById('reviewTopicsList').innerHTML = 
                '<p>Error loading topics. Please try again.</p>';
        }
    }
    
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
                        alert('Topic created successfully!');
                        input.value = '';
                    } else {
                        throw new Error('Failed to create topic');
                    }
                } catch (error) {
                    console.error('Error creating topic:', error);
                    alert('Error creating topic. Please try again.');
                }
            }
        });
    }
    
    function setupChat() {
        // Implement your chat functionality here
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendMessage');
        const messagesContainer = document.getElementById('chatMessages');
        
        sendButton.addEventListener('click', async function() {
            const message = chatInput.value.trim();
            if (message) {
                // Add user message
                messagesContainer.innerHTML += `<div class="user-message">${message}</div>`;
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
                    messagesContainer.innerHTML += `<div class="ai-message">${data.reply}</div>`;
                } catch (error) {
                    console.error('Chat error:', error);
                    messagesContainer.innerHTML += `<div class="error">Error getting response</div>`;
                }
            }
        });
    }
});