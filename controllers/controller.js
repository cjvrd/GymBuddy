let collection = require('../models/user');

const postUser = (req, res) => {
    let user = req.body;
    collection.postUser(user, (err, result) =>{
        if(!err){
            res.json({
                statusCode:201, 
                data:result, 
                message:'success'
            });
        };
    });
};

const getAllUsers = (req, res) => {
    collection.getAllUsers((err,result)=>{
    if(!err){
        res.json({statusCode:200, data:result, message:'got all users successfully'})
    };
    });
};

module.exports = {postUser, getAllUsers}