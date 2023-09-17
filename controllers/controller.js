let User = require('../models/user.js');
let Cycle = require('../models/cycle')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'SECRET_KEY';

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
};

const signIn = (req, res) => {
    let {email, password} = req.body;
    User.findUserByEmail(email, (err, user) => {
        if(err || !user){
            return res.status(400).json({message: 'User not found'});
        }
        // compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err || !isMatch){
                return res.status(400).json({message: 'Incorrect password'});
            };

            // if passwords match, fetch linked cycles
            Cycle.getCyclesForUser(user._id, (err, cycles) => {
                if(err) {
                    return res.status(500).json({message: 'Error fetching cycles'});
                }
                // console.log(JSON.stringify(cycles, null, 2));
                // if passwords match, create a JWT
                const token = jwt.sign({id: user._id, email: user.email}, secret, {
                    expiresIn: '1h'
                });

                res.json({
                    statusCode: 200,
                    token: token,
                    user: user,
                    cycles: cycles,
                    message: 'Logged in successfully'
                });
            })
        });
    });
};

const postUser = (req, res) => {
    let user = req.body;
    User.postUser(user, (err, result) => {
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


const getAllUsers = (req, res) => {
    User.getAllUsers((err, result) => {
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

module.exports = {postUser, getAllUsers, signUp, signIn};