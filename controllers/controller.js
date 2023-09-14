let collection = require('../models/user');

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

module.exports = { postUser, loginUser, getAllUsers };