const socket = io.connect('/');  // Connect to the server's socket
function formatTimestamp(timestampString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timestampDate = new Date(timestampString);
    return timestampDate.toLocaleDateString('en-US', options) + " - ";
}
const userEmail = localStorage.getItem('email');
document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('message-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const backButton = document.getElementById('back-button');

    let currentRoom = 'global';  // Defaulting to a global room

    socket.emit('joinRoom', currentRoom);  // Join the default room on page load

    // Listens for incoming messages and appends to the message container
    socket.on('newMessage', (messageData) => {
        const messageElem = document.createElement('div');
        messageElem.innerText = formatTimestamp(messageData.timestamp) + `${messageData.username}: ${messageData.message}`;
        messageContainer.appendChild(messageElem);
    });

    function wrapLongWords(message) {
        const words = message.split(' ');
        const maxWordLength = 40;
    
        const wrappedMessage = words.map(word => {
            if (word.length > maxWordLength) {
                return word.replace(new RegExp(`.{${maxWordLength}}`, 'g'), '$& ');
            }
            return word;
        }).join(' ');
        return wrappedMessage;
    }
    // Handles sending of new messages
    sendButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message.trim() !== '') {
            socket.emit('sendMessageToRoom', {
                roomName: currentRoom,
                message: wrapLongWords(message),
                username: userEmail // email
            });
            messageInput.value = '';
        }
        
    });

    // Handles loading of initial messages when you join a room
    socket.on('initialMessages', (messages) => {
        messageContainer.innerHTML = '';
        messages.forEach(messageData => {
            const messageElem = document.createElement('div');
            messageElem.innerText = formatTimestamp(messageData.timestamp) + `${messageData.username}: ${messageData.message}`;
            messageContainer.appendChild(messageElem);
        });
    });

    // leaveButton.addEventListener('click', () => {
    //     socket.emit('leaveRoom', currentRoom);
    //     // Logic to redirect user or inform about leaving room
    // });

    backButton.addEventListener('click', () => {
        // Logic to navigate back to previous page or main dashboard
        window.history.back();
        localStorage.removeItem('userEmail');
    });

    // You can add more functionalities like changing rooms, updating usernames, etc.
});
