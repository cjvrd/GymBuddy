var express = require("express");
var app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);




var port = process.env.port || 3000;
let router = require('./routers/router');


// this object will store the mapping between email addresses and their respective socket IDs
const userSocketMap = {};

io.on('connection', (socket) => {
    // when a user logs in
    socket.on('user-login', (email) => {
        // map the user's email to their socket ID
        userSocketMap[email] = socket.id;

        console.log(`${email} has connected`);
        // notify ONLY the user who has just logged in
        socket.emit('user-login-success', `Welcome, ${email}`);
    });

    // when a user logs out
    socket.on('user-logout', (email) => {
        console.log(`${email} has disconnected`);
        
        // notify ONLY the user who has just logged out
        if (userSocketMap[email]) {
            socket.to(userSocketMap[email]).emit('user-logout-success', `Goodbye, ${email}`);
            delete userSocketMap[email];
        }
    });

    socket.on('disconnect', () => {
        // find and remove the disconnected socket from the userSocketMap
        for (let email in userSocketMap) {
            if (userSocketMap[email] === socket.id) {
                console.log(`${email} has disconnected due to a socket disconnect`);
                delete userSocketMap[email];
            }
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

// app.listen(port,()=>{
//     console.log("App listening to: "+port)
// });

server.listen(port, () => {
    console.log(`App listening to: ${port}`);
});
