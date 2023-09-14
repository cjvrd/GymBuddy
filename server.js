var express = require("express")
var app = express()


var port = process.env.port || 3000;
let router = require('./routers/router')

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', router)

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});


app.listen(port,()=>{
    console.log("App listening to: "+port)
})