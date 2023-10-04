const socket = io.connect('/');  // Connect to the server's socket

function formatTimestamp(timestampString) {
    const options = { hour: '2-digit', minute: '2-digit' };
    const timestampDate = new Date(timestampString);
    return timestampDate.toLocaleDateString('en-US', options);
}
const userEmail = localStorage.getItem('email');
const userData = JSON.parse(localStorage.getItem('userData'));
const userName = userData.fullName;

document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('message-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    let currentRoom = 'global';  // Defaulting to a global room

    socket.emit('joinRoom', currentRoom);  // Join the default room on page load

    // Listens for incoming messages and appends to the message container
    socket.on('newMessage', (messageData) => {
        const messageElem = document.createElement('div');
        messageElem.innerText = `${messageData.username}: ${messageData.message}` + ' (' + formatTimestamp(messageData.timestamp) + ')';
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
                username: userName // email
            });
            messageInput.value = '';
        }

    });

    // Handles loading of initial messages when you join a room
    socket.on('initialMessages', (messages) => {
        messageContainer.innerHTML = '';
        messages.forEach(messageData => {
            const messageElem = document.createElement('div');
            messageElem.innerText = `${messageData.username}: ${messageData.message}` + ' (' + formatTimestamp(messageData.timestamp) + ')';
            messageContainer.appendChild(messageElem);
        });
    });

    //return to dashboard button
    $('#dashboardButton').on('click', function () {
        window.location.href = '/dashboard.html';
    });

    //logout function
    window.logoutUser = function () {
        let userEmail = localStorage.getItem('email');
        if (userEmail) {
            socket.emit('user-logout', userEmail);
        }
        localStorage.clear(); //remove all data from local storage
        window.location.href = './'; //returns user to index (login page)
    }

    // handle logout
    $('#logoutButton').on('click', function (event) {
        event.preventDefault();
        logoutUser();
    });
});
