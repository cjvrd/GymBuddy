#  GymBuddy 
GymBuddy is a dynamic web application that offers personalized fitness programs tailored to users' age and unique goals. The application was designed to bridge the gap between high personal trainer costs and the desire for quality training, while still offering a personalised and guided approach.

### Requirements:
You must have the following installed in your device:
- Git (https://git-scm.com/download/win)
- VSCode (or any IDE of your choice)
- NPM (https://nodejs.org/en/download)
## Quick Start
clone the repository:
```bash
git clone https://github.com/cjvrd/GymBuddy.git
```
after downloading/cloning the project to your local device, go to /GymBuddy folder, run:
```bash
npm install
```
then start the app:
```bash
npm run start
```
Then visit http://localhost:3000/ on your browser.

### You're all set! :rocket:
You can signup for a new account, and start progressing in your workouts!

## How to use GymBuddy
1. Click on the the sign up bottom at the bottom of the homepage to begin
2. Enter your full name, email, and password to create an account
3. Fill out the details form (Age, Gender, Goal) and Submit
4. Log into your new account and you will be directed to the dashboard
5. Click on your current cycle and you will be directed to week 1 of your training
6. Click on Day 1 and complete the exercises as prescribed
7. Once finished an exercise, make sure to check it off by clicking the checkbox next to the exercise, Gymbuddy will save your progress
8. Once you have completed a full week, check the complete week box and next time you log in you will be directed to your second week of the program
9. You can check your progress as you work your way through the cycle on the dashboard
10. Once you have completed a full 4 weeks of training, you will be assigned a new cycle starting from week 1 day 1
11. You will still be able to go back to the dashboard and check what you have completed in your previous cycle.
// christian (need to refine this, this is just a quick draft) 

## Testing
To run the testing, have two terminals open:
in terminal 1:
```bash
npm run start
```
in terminal 2:
```bash
npm run test
```
## Dependencies
```json
  "dependencies": {
    "ajax": "^0.0.4",
    "axios": "^1.5.0",
    "bcrypt": "^5.1.1",
    "chai": "^4.3.8",
    "eslint": "^8.49.0",
    "express": "^4.18.2",
    "jquery": "^3.7.0",
    "jsonwebtoken": "^9.0.2",
    "materialize-css": "^1.0.0",
    "mocha": "^10.2.0",
    "mongodb": "^4.17.1",
    "socket.io": "^4.7.2",
    "socket.io-client": "^4.7.2"
  }
```

### Contributors
<https://github.com/cjvrd>

<https://github.com/garoot>

<https://github.com/dellasusanj>

<https://github.com/Draculakl07>

<https://github.com/Mitul22>
