var express = require("express");
var app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);




var port = process.env.port || 3000;
let router = require('./routers/router');

io.on('connection', (socket) => {
    //console.log('A user connected');

    socket.on('user-login', (email) => {
        console.log(`${email} has connected`);
        io.emit('user-login', email);
    });

    socket.on('user-logout', (email) => {
        console.log(`${email} has disconnected`);
        io.emit('user-logout', email);
    });

     socket.on('disconnect', () => {
    //     console.log('A user disconnected');
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
