var express = require("express");
var app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const client = require('./dbConnection');
var port = process.env.port || 3000;
let router = require('./routers/router');


// this object will store the mapping between email addresses and their respective socket IDs
const userSocketMap = {
    emailToSocket: {},
    socketToEmail: {}
};

io.on('connection', (socket) => {
    const db = client.db("chatdb");
    // when a user logs in
    socket.on('user-login', (email) => {
        // map the user's email to their socket ID
        userSocketMap.emailToSocket[email] = socket.id;

        console.log(`${email} has logged in`);
        // notify ONLY the user who has just logged in
        socket.emit('user-login-success', `Welcome, ${email}`);
    });

    // when a user logs out
    socket.on('user-logout', (email) => {
        userSocketMap.socketToEmail[socket.id] = email;
        console.log(`${email} has logged out`);
        
        // notify ONLY the user who has just logged out
        if (userSocketMap[email]) {
            socket.to(userSocketMap[email]).emit('user-logout-success', `Goodbye, ${email}`);
            delete userSocketMap[email];
        }
    });

    socket.on('disconnect', () => {
        // find and remove the disconnected socket from the userSocketMap
        const email = userSocketMap.socketToEmail[socket.id];
        if(email) {
          //  console.log(`${email} has disconnected due to a socket disconnect`);
            delete userSocketMap.emailToSocket[email];
            delete userSocketMap.socketToEmail[socket.id];
        }
    });
      // Chatroom Logic
      socket.on('sendMessageToRoom', async (data) => {
        try {
            const timestamp = new Date();
            const messageToSave = {
                msg: data.message,
                roomName: data.roomName, 
                username: data.username,
                timestamp: timestamp
            };

            await db.collection("messages").insertOne(messageToSave);
            const { roomName, username, message } = data;

            io.in(roomName).emit('newMessage', {
                username,
                message,
                timestamp: timestamp.toISOString()
            });
        } catch (error) {
            console.error("Error saving the message:", error);
            socket.emit('errorOnSend', 'There was an error sending your message.');
        }
    });

    socket.on('joinRoom', async (roomName) => {
        try {
            const messages = await db.collection("messages").find({ roomName }).toArray();
            socket.join(roomName);
            socket.emit('joinedRoom', roomName);
            socket.emit('initialMessages', messages.map(m => ({
                username: m.username,
                message: m.msg,
                timestamp: m.timestamp.toISOString()
            })));
        } catch (error) {
            console.error("Error joining the room:", error);
            socket.emit('errorOnJoin', 'There was an error joining the room.');
        }
    });
    
});

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router);

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

server.listen(port, () => {
    console.log(`App listening to: ${port}`);
});
