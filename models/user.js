let client = require('../dbConnection');
const bcrypt = require('bcrypt');
let collection = client.db().collection('User');
const { ObjectId } = require('mongodb');  // import ObjectId


function getAllUsers(callback){
    collection.find({}).toArray(callback);
};


function findUserById(userId, callback){
    collection.findOne({ _id: ObjectId(userId) }, callback);
};


function deleteUserById(userId, callback) {
    collection.deleteOne({ _id: ObjectId(userId) }, callback);
};





//this function creates a user and hashes the password
function createUser(user, callback){
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err){
            return callback(err);
        };
        user.password = hash;
        collection.insertOne(user, (err, result) =>{
            if(err) {
                return callback(err);
            }

            user._id = result.insertedId;
            callback(null, user);
        });
    });
};

// finding user instance by email
function findUserByEmail(email, callback){
    collection.findOne({email: email}, callback);
};

module.exports = {getAllUsers, createUser, findUserByEmail, findUserById, deleteUserById};