let User = require('../models/user.js');
let Cycle = require('../models/cycle');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = 'SECRET_KEY';
const db = require('../dbConnection'); 
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
            }

            // console.log(result)
            // creating the cycle for the user
            Cycle.createCycleForUser(result, (err, cycleResult) => {
                if(err){
                    return res.json({
                        statusCode: 500,
                        message: 'Server error when creating cycle for user'
                    })
                }
                // console.log(cycleResult)

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

const updateProgress = (req, res) => {
    // need userId, cycleId, weekNumber, dayNumber, exerciseNumber
    // retrieve cycle, then ensure userId === req.userId
    // update all weeks.done to true until weekNumber 
    // retrieve week, then update all days.done to true until dayNumber
    // retrieve day, then update all exercises.done to true until exerciseNumber

}

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
const updateExerciseStatus = async (req, res) => {
    const { userId, weekNumber, dayNumber, exerciseName, status } = req.body;
    
    try {
        // Update the specific exercise's status in the database
        
        await db.collection('trainingPrograms').updateOne(
            { userId, "weeks.weekNumber": weekNumber, "weeks.days.dayNumber": dayNumber, "weeks.days.exercises.name": exerciseName },
            { $set: { "weeks.$.days.$.exercises.$.done": status } }
        );
        res.status(200).send({ message: 'Exercise status updated successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to update exercise status.', error });
    }
};
const updateDayStatus = async (req, res) => {
    const { userId, weekNumber, dayNumber, status } = req.body;
    
    try {
        // Update the day's status in the database
        await db.collection('trainingPrograms').updateOne(
            { userId, "weeks.weekNumber": weekNumber, "weeks.days.dayNumber": dayNumber },
            { $set: { "weeks.$.days.$.done": status } }
        );
        res.status(200).send({ message: 'Day status updated successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to update day status.', error });
    }
};
const updateWeekStatus = async (req, res) => {
    const { userId, weekNumber, status } = req.body;
    
    try {
        // Update the week's status in the database
        await db.collection('trainingPrograms').updateOne(
            { userId, "weeks.weekNumber": weekNumber },
            { $set: { "weeks.$.done": status } }
        );
        res.status(200).send({ message: 'Week status updated successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to update week status.', error });
    }
};
module.exports = {getAllUsers, signUp, signIn, updateExerciseStatus, updateDayStatus,updateWeekStatus};