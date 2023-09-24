// POST request using fetch
const socket = io.connect('http://localhost:3000');


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

        // if (!response.ok) {
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // } dont think we need this

        const data = await response.json();

        if (data && data.token) { //assign data to local storage, send user to details page (successfully logged in)
            
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
            localStorage.setItem('userCycles', JSON.stringify(data.cycles));
            window.location.href = '/details.html';

        } else {
            alert('Login failed. ' + (data.message || '')); //this is not working, not sure how to fix, i think it gets stuck at line 44 before moving on (christian)
        }
    }

    catch (err) {
        console.error('Login Error:', err);
    }
};

//logout function
function logoutUser() {
    
    localStorage.removeItem('token'); //removes jwt and user data from local storage
    localStorage.removeItem('userData');
    localStorage.removeItem('userCycles');
    let userEmail = localStorage.getItem('email');
if (userEmail) {
    socket.emit('user-logout', userEmail);
}
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
    $('.materialbox').materialbox();
    $('select').formSelect();

    // Attach the blur event to the confirmPassword field
    $('#confirmPassword').on('blur', checkPasswordsMatch);

    // Attach event to handle form submission
    $('#signupForm').on('submit', function (event) {
        event.preventDefault();
        if (checkPasswordsMatch() === false)
        {
            alert('Password does not match! Please try again');
        }
        else
        {   
            // Gather form data and assign to user variable
            const user = {
                fullName: $("#fullName").val(),
                email: $("#email").val(),
                password: $("#password").val(),
                confirmPassword: $("#confirmPassword").val(),
    
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

    // handle logout
    $('#logoutButton').on('click', function (event) {
        event.preventDefault();
        logoutUser();
    });
});
socket.on('user-login', (email) => {
    alert(`${email} has connected`);
});

socket.on('user-logout', (email) => {
    alert(`${email} has disconnected`);
});
