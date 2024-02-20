document.addEventListener('DOMContentLoaded', function() {
    var userInput = document.getElementById('userInput');
    var systemPromptInput = document.getElementById('systemPrompt');
    var modelSelect = document.getElementById('modelSelect');
    var sendBtn = document.getElementById('sendBtn');
    var output = document.getElementById('output');

    var userIconUrl = 'assets/human.png'; // replace with your icon's URL
    var computerIconUrl = 'assets/bot.png'; // replace with your icon's URL

    function createMessageElement(iconUrl, messageText, className) {
        var messageDiv = document.createElement('div');
        messageDiv.classList.add(className);

        var iconImg = document.createElement('img');
        iconImg.src = iconUrl;
        iconImg.classList.add('icon');
        messageDiv.appendChild(iconImg);

        var messageP = document.createElement('p');
        messageP.textContent = messageText;
        messageDiv.appendChild(messageP);

        return messageDiv;
    }

    function scrollToBottom() {
        output.scrollTop = output.scrollHeight - output.clientHeight;
    }

    function sendMessage() {
        var message = userInput.value;
        var systemPrompt = systemPromptInput.value;
        var selectedModel = modelSelect.value;
        userInput.value = '';

        if (message.trim() === '') {
            return; // Avoid empty messages
        }

        var userMessage = createMessageElement(userIconUrl, message, 'user-message');
        output.appendChild(userMessage);

        scrollToBottom();

        var dataToSend = {
            query: message,
            system_prompt: systemPrompt,
            chat_history: chatHistory,
            model: selectedModel,
        };

        var username = 'admin';
        var password = 'secret';
        var basicAuth = 'Basic ' + btoa(username + ':' + password);

        fetch('http://129.159.35.30:1099/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': basicAuth
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            const computerMessage = createMessageElement(computerIconUrl, data.response, 'computer-message');
            output.appendChild(computerMessage);
            //console.log(data.chat_history);
            // Update chatHistory with the correct format
            chatHistory.push({
                user: message,
                assistant: data.response // Assuming `data.response` contains the assistant's message
            });
            //chatHistory = data.chat_history;
            //chatHistory.push([message, data.answer]);
            scrollToBottom();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    var chatHistory = [];

    sendBtn.addEventListener('click', sendMessage);

    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});
