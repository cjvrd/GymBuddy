let collection = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const secret = 'SECRET_KEY'


const signUp = (req, res) => {
    let user = req.body;
    collection.createUser(user, (err, result) => {
        if(!err){
            res.json({
                statusCode: 201,
                data: result,
                message: 'User registered successfully'
            });
        }
    });
}

const signIn = (req, res) => {
    let {email, password} = req.body;
    collection.findUserByEmail(email, (err, user) => {
        if(err || !user){
            return res.status(400).json({message: 'User not found'});
        }
        console.log(req.body)
        console.log("Received: ", email, password);
        console.log("Fetched user with email: ", user.email);

        console.log("Stored hashed password: ", user.password);
        console.log("Password from client: ", password)

        // compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err || !isMatch){
                return res.status(400).json({message: 'Incorrect password'});
            }

            // if passwords match, create a JWT
            const token = jwt.sign({id: user._id, email: user.email}, secret, {
                expiresIn: '1h'
            });

            res.json({
                statusCode: 200,
                token: token,
                message: 'Logged in successfully'
            })
        })
    })
}

const postUser = (req, res) => {
    let user = req.body;
    collection.postUser(user, (err, result) => {
        if (!err) {
            res.json({
                statusCode: 201,
                data: result,
                message: 'User registered successfully'
            });
        } else {
            res.json({
                statusCode: 500,
                message: 'Error registering user'
            });
        }
    });
};

const loginUser = (req, res) => {
    let { email, password } = req.body;
    collection.findUserByEmail(email, (err, user) => {
        if (err || !user) {
            res.json({
                statusCode: 404,
                message: 'User not found'
            });
            return;
        }
        if (user.password === password) {
            res.json({
                statusCode: 200,
                message: 'Login successful'
            });
        } else {
            res.json({
                statusCode: 401,
                message: 'Incorrect password'
            });
        }
    });
};

const getAllUsers = (req, res) => {
    collection.getAllUsers((err, result) => {
        if (!err) {
            res.json({
                statusCode: 200,
                data: result,
                message: 'Retrieved all users successfully'
            });
        } else {
            res.json({
                statusCode: 500,
                message: 'Error fetching users'
            });
        }
    });
};


module.exports = {postUser, getAllUsers, signUp, signIn}
