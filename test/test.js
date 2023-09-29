const { expect } = require("chai");
const axios = require("axios");

const baseUrl = 'http://localhost:3000';

const randomEmail = (Math.random().toString(16).substr(2, 8)) + '@example.com'; //creates a random email for new user each time test is run

console.log(randomEmail);

const signUpData = {
    fullName: 'John Doe',
    email: randomEmail,
    password: 'password123',
    age: 'middle',
    goal: 'buildStrength',
    gender: 'male'
};

const signInData = {
    email: randomEmail,
    password: 'password123'
};

describe('GET /users API', function() {
    it('should return a status code of 200 and an array of users', async function() {
        try {
            // Make a GET request to the users endpoint
            const response = await axios.get(`${baseUrl}/users`);
            // check the response status and data
            expect(response.status).to.equal(200);
            expect(response.data).to.be.an('object');
            expect(response.data.statusCode).to.equal(200);
            expect(response.data.message).to.equal('Retrieved all users successfully');
            expect(response.data.data).to.be.an('array');
        } catch (error) {
            throw new Error(`${error.message}`);    
        }
    });
});

describe('Test SignUp API success', function() {
    it('Signs up a user and returns a status code of 201', async function() {
        try {
            // Make a POST request to the signup endpoint
            const response = await axios.post(`${baseUrl}/signup`, signUpData);

            // Check the response status code
            expect(response.data.statusCode).to.equal(201);
            
            // Check the response message for successful registration
            expect(response.data.message).to.equal('User registered successfully');
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    });
});

// this test should pass as its done after the sign up test, which creates the test user
describe('Test SignUp API unsuccessful', function() {
    it('Checks email that already exists and returns a status code of 400', async function() {
        try {
            // Make a POST request to the signup endpoint
            const response = await axios.post(`${baseUrl}/signup`, signUpData);

            // Check the response status code
            expect(response.data.statusCode).to.equal(400);

            // Check the response message for unsuccessful registration
            expect(response.data.message).to.equal('Email already in use');
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    })
})

describe('Test SignIn API', function() {
    it('Signs in a user and returns a status code of 200', async function() {
        try {
            const response = await axios.post(`${baseUrl}/signin`, signInData);
            expect(response.status).to.equal(200);
            expect(response.data.message).to.equal('Logged in successfully');
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    });
});