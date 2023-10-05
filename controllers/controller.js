let User = require('../models/user.js');
let Cycle = require('../models/cycle');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'SECRET_KEY';

const signUp = (req, res) => { 
    let user = req.body;

    // checking if email already exists
    User.findUserByEmail(user.email, (err, existingUser) => {
        if (err) {
            return res.json({
                statusCode: 500,
                message: 'Server error when checking email'
            })
        };

        // if a user with the given email is found
        if (existingUser) {
            return res.json({
                statusCode: 400,
                message: 'Email already in use'
            });
        };

        // creating the new user
        User.createUser(user, (err, result) => {
            if(err){
                return res.json({
                    statusCode: 500,
                    message: 'Server error when creating user'
                });
            };

            // creating the cycle for the user
            Cycle.createCycleForUser(result, (err, cycleResult) => {
                if(err){
                    return res.json({
                        statusCode: 500,
                        message: 'Server error when creating cycle for user'
                    })
                }

                res.json({
                    statusCode: 201,
                    data: result,
                    cycleData: cycleResult,
                    message: 'User registered successfully'
                });
            })
        });
    });
};

const signIn = (req, res) => { //finds user data in DB
    let {email, password} = req.body;
    User.findUserByEmail(email, (err, user) => {
        if(err || !user){
            return res.status(400).json({message: 'User not found'});
        }; 

        // compare entered password to password in DB
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err || !isMatch){
                return res.status(400).json({message: 'Incorrect password'});
            };

            // if passwords match, fetch linked cycles
            Cycle.getCyclesForUser(user._id, (err, cycles) => {
                if(err) {
                    return res.status(500).json({message: 'Error fetching cycles'});
                };
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
            });
        });
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
        };
    });
};

const getUserDetails = (req, res) => {
    let userId = req.params.userId;

    User.findUserById(userId, (err, user) => {
        if (err) {
            return res.status(500).json({
                message: 'Server error occurred while fetching user details.'
            });
        }

        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        // Return user details, but avoid sending sensitive info like password
        const { password, ...userDetails } = user;
        res.status(200).json(userDetails);
    });
};

const deleteUser = (req, res) => {
    let userId = req.params.userId;

    User.deleteUserById(userId, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Server error occurred while deleting the user.'
            });
        }

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'User not found or already deleted.'
            });
        }

        res.status(200).json({
            message: 'User deleted successfully.'
        });
    });
};

const deleteUserCycle = (req, res) => {
    let userId = req.params.userId;
    let cycleId = req.params.cycleId;

    Cycle.deleteUserCycle(userId, cycleId, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Server error occurred while deleting the cycle.'
            });
        }

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Cycle not found or already deleted for the specified user.'
            });
        }

        res.status(200).json({
            message: 'User cycle deleted successfully.'
        });
    });
};

module.exports = {getAllUsers, signUp, signIn, getUserDetails, deleteUser, deleteUserCycle};