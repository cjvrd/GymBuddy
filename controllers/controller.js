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
                data: {token},
                message: 'Logged in successfully'
            })
        })
    })
}

const postUser = (req, res) => {
    let user = req.body;
    collection.postUser(user, (err, result) =>{
        if(!err){
            res.json({
                statusCode:201, 
                data:result, 
                message:'success'
            })
        }
    })
}

const getAllUsers = (req, res) => {
    collection.getAllUsers((err,result)=>{
    if(!err){
        res.json({statusCode:200, data:result, message:'got all users successfully'})
    }
    });
}


module.exports = {postUser, getAllUsers, signUp, signIn}