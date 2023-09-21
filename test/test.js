const { expect } = require("chai");
const axios = require("axios");

const baseUrl = 'http://localhost:3000';

const signUpData = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    age: 'middle',
    goal: 'buildStrength',
    gender: 'male'
};

const signInData = {
    email: 'john.doe@example.com',
    password: 'password123'
};

describe('GET /users API', function() {
    it('should return a status code of 200 and an array of users', async function() {
        const response = await axios.get(`${baseUrl}/users`);
        expect(response.status).to.equal(200);
        expect(response.data).to.be.an('object');
        expect(response.data.statusCode).to.equal(200);
        expect(response.data.message).to.equal('Retrieved all users successfully');
        expect(response.data.data).to.be.an('array');
        //console.log(response.data);
    });
});

describe('Test SignUp API', function() {
    it('Signs up a user and returns a status code of 201', async function() {
        try {
            // Make a POST request to the signup endpoint
            const response = await axios.post(`${baseUrl}/signup`, signUpData);

            // Check the response status code
            expect(response.status).to.equal(201);

            // Check the response message for successful registration
            expect(response.data.message).to.equal('User registered successfully');
        } catch (error) {
            // Handle any errors or unexpected status codes
            if (error.response) {
                if (error.response.status === 400) {
                    // message for email already in use
                    expect(error.response.data.message).to.equal('Email already in use');
                } else if (error.response.status === 500) {
                    // message for server error during signup
                    expect(error.response.data.message).to.equal('Server error when checking email');
                } else {
                    // Unexpected status code
                    throw new Error(`Unexpected status code: ${error.response.status}`);
                }
            } else {
                // Handle other errors (e.g., network error)
                throw new Error(`Error: ${error.message}`);
            }
        }
    });
});

describe('Test SignIn API', function() {
    it('Signs in a user and returns a status code of 200', async function() {
        const response = await axios.post(`${baseUrl}/signin`, signInData);
        expect(response.status).to.equal(200);
        expect(response.data.message).to.equal('Logged in successfully');
    });
});



