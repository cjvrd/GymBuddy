let client = require('../dbConnection');
let collection = client.db().collection('User');

function postUser(user, callback){
    collection.insertOne(user, callback);
}

function getAllUsers(callback){
    collection.find({}).toArray(callback);
}

function findUserByEmail(email, callback){
    collection.findOne({email: email}, (err, user) => {
        console.log("Looking up user with email:", email);
        if(err) {
            console.error("Error during user lookup:", err);
        }
        if(user) {
            console.log("Found user:", user);
        } else {
            console.log("User not found");
        }
        callback(err, user);
    });
}


module.exports = { postUser, getAllUsers, findUserByEmail };