
const trainingPrograms = require('../training-programs/program-objects');
let client = require('../dbConnection');
let collection = client.db().collection('Cycle');

function createCycleForUser(user, callback){
    let age = "";
    // console.log(trainingPrograms.oldBuildStrength)
    let userAge = parseInt(user.age);
    if (userAge > 65){
        age = "old"
    } else if (userAge > 39 && userAge <= 65){
        age = "middle"
    } else {
        age = "young"
    }

    let newCycle = {
        userId: user._id,
        program: pickProgram(age, user.goal),
    };
    collection.insertOne(newCycle, (err, result) =>{
        if(err) {
            return callback(err);
        }

        newCycle._id = result.insertedId;
        callback(null, newCycle);
    });
};

function pickProgram(age, goal){
    // for old users
    if (age === "old"){
        if(goal === "Strength Training"){
            return trainingPrograms.oldBuildStrength;
        } else if (goal === "Weight Loss"){
            return trainingPrograms.oldLoseWeight;
        } else if (goal === "Build Mass"){
            return trainingPrograms.oldBuildMuscle;
        };
    }
    // for middle-age users
    if (age === "middle"){
        if(goal === "Strength Training"){
            return trainingPrograms.middleBuildStrength;
        } else if (goal === "Weight Loss"){
            return trainingPrograms.middleLoseWeight;
        } else if (goal === "Build Mass"){
            return trainingPrograms.middleBuildMuscle;
        };
    }
    // for young users
    if (age === "young"){
        if(goal === "Strength Training"){
            return trainingPrograms.youngBuildStrength;
        } else if (goal === "Weight Loss"){
            return trainingPrograms.youngLoseWeight;
        } else if (goal === "Build Mass"){
            return trainingPrograms.youngBuildMuscle;
        };
    }

    return null
}

function getCyclesForUser(userId, callback){
    collection.find({ userId: userId }).toArray(callback);
}

module.exports = {
    createCycleForUser,
    getCyclesForUser,
};