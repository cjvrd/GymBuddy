const socket = io.connect('http://localhost:3000');

// POST request using fetch
async function signupUser(user) {
    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        // ensure the response has the JSON content type before parsing it as JSON
        if (!response.headers.get("content-type") || !response.headers.get("content-type").includes("application/json")) {
            throw new Error("Received non-JSON response");
        }

        const data = await response.json();

        if (data.statusCode === 201) {
            console.log('User post successful');
            window.location.href = './'; //once user post succesful redirect to login page
            alert("You have successfully signed up! Please log in to continue.");
        } else {
            alert('Signup failed. ' + (data.message || ''));
        }
    } catch (err) {
        alert('Failed to signup. Please try again.');
        console.error('Signup Error:', err);
    }
};

// POST request for login using fetch
async function loginUser(loginData) {
    try {
        const response = await fetch('/signin', { //fetch login data
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (data && data.token) { //assign data to local storage, send user to dashboard (successfully logged in)

            // emit 'user-login' upon successful login
            socket.emit('user-login', loginData.email);

            // listen for login success notification
            socket.on('user-login-success', (message) => {
                console.log(message);  // e.g., "Welcome, user@email.com"
            });
            // listen for logout success notification
            socket.on('user-logout-success', (message) => {
                console.log(message);  // e.g., "Goodbye, user@email.com"
            });

            localStorage.setItem('email', loginData.email);

            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            localStorage.setItem('userId', JSON.stringify(data.user._id));
            localStorage.setItem('userCycles', JSON.stringify(data.cycles));
            localStorage.setItem('cycleId', JSON.stringify(data.cycles[0]._id));
            localStorage.setItem('program', JSON.stringify(data.cycles[0].program));
            localStorage.setItem('currentWeek', JSON.stringify(data.cycles[0].currentWeek));
            localStorage.setItem('currentDay', JSON.stringify(data.cycles[0].currentDay));

            // console.log(data.cycles[0].program)
            window.location.href = '/dashboard.html';

        } else {
            alert('Login failed. ' + (data.message || ''));
        }
    }

    catch (err) {
        console.error('Login Error:', err);
    }
};

//logout function
window.logoutUser = function () {
    let userEmail = localStorage.getItem('email');
    if (userEmail) {
        socket.emit('user-logout', userEmail);
    }
    localStorage.clear(); //remove all data from local storage
    window.location.href = './'; //returns user to index (login page)
}

// This function checks if the passwords match
function checkPasswordsMatch() {
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();

    // Check if passwords match
    if (password !== confirmPassword) {
        $('#confirmPassword').addClass('is-invalid'); //adds red x if not matching
        return false;
    } else {
        $('#confirmPassword').removeClass('is-invalid').addClass('is-valid'); // Adds a green tick if they match
        return true;
    }
};

$(document).ready(function () {
    // Attach the blur event to the confirmPassword field
    $('#confirmPassword').on('blur', checkPasswordsMatch);

    // Attach event to handle form submission
    $('#signupForm').on('submit', function (event) {
        event.preventDefault();
        if (checkPasswordsMatch() === false) {
            alert('Password does not match! Please try again');
        }
        else {
            // Gather form data and assign to user variable
            const user = {
                fullName: $("#fullName").val(),
                email: $("#email").val(),
                password: $("#password").val(),

                age: $('input:radio[name=age]:checked').val(),
                goal: $('input:radio[name=goal]:checked').val(),
                gender: $('input:radio[name=gender]:checked').val()
            };

            // Send the data via a POST request
            signupUser(user);
        }
    });

    // Login form submission event
    $('#loginForm').on('submit', function (event) {
        event.preventDefault();

        // Gather form data for login
        const loginData = {
            email: $("#email").val(),
            password: $("#password").val()
        };

        // Send the data via a POST request for login
        loginUser(loginData);
    });

    // Check if user is logged in
    if (localStorage.getItem('token') && localStorage.getItem('userData')) {
        // If user is logged in, hide the login container
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('newuserContainer').style.display = 'none';

        window.location.href = '/dashboard.html';
    }
});

function validateForm() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Check if the full name is at least 3 characters
    if (fullName.length < 3) {
        alert('Full name must be at least 3 characters long.');
        return false;
    }

    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    // Check if the password is at least 8 characters
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return false;
    }

    return true;
}

//return to dashboard button
$('#dashboardButton').on('click', function () {
    window.location.href = '/dashboard.html';
});

// handle logout
$('#logoutButton').on('click', function (event) {
    event.preventDefault();
    logoutUser();
});

// socket.on('user-login', (email) => {
//     alert(`${email} has connected`);
// });

// socket.on('user-logout', (email) => {
//     alert(`${email} has disconnected`);
// });
