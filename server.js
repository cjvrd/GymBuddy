const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.btwcixe.mongodb.net/?retryWrites=true&w=majority';
const app = express();

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

  
// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// TODO: Define routes and models here

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to GymBuddy API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});