const trainingPrograms = require('../training-programs/program-objects');
let client = require('../dbConnection');
let collection = client.db().collection('Cycle');

//this function creates a cycle for the user, it attaches the appropriate program and creates a reference to the user id
function createCycleForUser(user, callback) {

    let newCycle = {
        userId: user._id,
        program: pickProgram(user.age, user.goal),
        currentWeek: 1,
        currentDay: 1,
    };
    collection.insertOne(newCycle, (err, result) => {
        if (err) {
            return callback(err);
        };

        newCycle._id = result.insertedId;
        callback(null, newCycle);
    });
};

//this function takes in form data and assigns a program according to selection of age+goal
function pickProgram(age, goal) { 
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
};

function getCyclesForUser(userId, callback) {
    collection.find({ userId: userId }).toArray(callback);
};

//this function updates the DB when the user is moving through the program and checking boxes as complete
function updateCycleProgram(userId, cycleId, updatedProgram, currentWeek, currentDay, callback) {
    // find the cycle by userId and cycleId and update the program
    const ObjectId = require('mongodb').ObjectId;
    let userIdObj = ObjectId(userId);
    let cycleIdObj = ObjectId(cycleId);



    collection.updateOne(
        { userId: userIdObj, _id: cycleIdObj },
        { $set: { 
            program: updatedProgram,
            currentWeek: currentWeek,
            currentDay: currentDay,
            } 
        },
        (err, result) => {
            if (err) {
                return callback(err);
            }
            if (result.matchedCount === 0) {
                return callback(new Error('No matching cycle found for given user and cycle IDs.'));
            }
            callback(null, result);
        }
    );
};

module.exports = { createCycleForUser, getCyclesForUser, updateCycleProgram };