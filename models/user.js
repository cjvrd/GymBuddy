let client = require('../dbConnection')

let collection = client.db().collection('User')



function postUser(user, callback){
    collection.insertOne(user, callback);
}

function getAllUsers(callback){
    collection.find({}).toArray(callback)
}

module.exports = {getAllUsers, postUser}