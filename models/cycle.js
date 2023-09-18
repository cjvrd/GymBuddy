const trainingPrograms = require('../training-programs/program-objects');
let client = require('../dbConnection');
let collection = client.db().collection('Cycle');

function createCycleForUser(user, callback) {
    // let age = "";
    // console.log(trainingPrograms.oldBuildStrength)
    // let userAge = parseInt(user.age);
    // if (userAge > 65){
    //     age = "old"
    // } else if (userAge > 39 && userAge <= 65){
    //     age = "middle"
    // } else {
    //     age = "young"
    // }

    let newCycle = {
        userId: user._id,
        program: pickProgram(user.age, user.goal), //changed to user.age
    };
    collection.insertOne(newCycle, (err, result) => {
        if (err) {
            return callback(err);
        }

        newCycle._id = result.insertedId;
        callback(null, newCycle);
    });
};

function pickProgram(age, goal) { //this function takes in form data and assigns a program according to selection of age+goal
    // for old users
    if (age === "old") {
        if (goal === "buildStrength") {
            return trainingPrograms.oldBuildStrength;
        } else if (goal === "loseWeight") {
            return trainingPrograms.oldLoseWeight;
        } else if (goal === "buildMuscle") {
            return trainingPrograms.oldBuildMuscle;
        };
    };
    // for middle-age users
    if (age === "middle") {
        if (goal === "buildStrength") {
            return trainingPrograms.middleBuildStrength;
        } else if (goal === "loseWeight") {
            return trainingPrograms.middleLoseWeight;
        } else if (goal === "buildMuscle") {
            return trainingPrograms.middleBuildMuscle;
        };
    };
    // for young users
    if (age === "young") {
        if (goal === "buildStrength") {
            return trainingPrograms.youngBuildStrength;
        } else if (goal === "loseWeight") {
            return trainingPrograms.youngLoseWeight;
        } else if (goal === "buildMuscle") {
            return trainingPrograms.youngBuildMuscle;
        };
    };

    return null;
}

function getCyclesForUser(userId, callback) {
    collection.find({ userId: userId }).toArray(callback);
}

module.exports = {createCycleForUser, getCyclesForUser};