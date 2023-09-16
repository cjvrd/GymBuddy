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

        const result = await response.json();

        if (result.statusCode === 201) {
            alert('User post successful'); //once user post succesful, need to be redirected to login page
        } else {
            // alert('Signup failed. ' + (result.message || ''));
            M.toast({ html: 'Signup failed. ' + (result.message || '') });
        }
    } catch (err) {
        alert('Failed to signup. Please try again.');
        console.error('Signup Error:', err);
    }
};

// POST request for login using fetch
async function loginUser(loginData) {
    try {
        const response = await fetch('/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user))
            // console.log(data.user)
            window.location.href = '/details.html'
            // window.location.reload();
        } else {
            alert("Error loggin in");
        }
    }

    catch (err) {
        // alert('Login error. Please try again.');
        console.error('Login Error:', err);
    }
};

//logout function
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = './';
}

// This function checks if the passwords match
function checkPasswordsMatch() {
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();

    // Check if passwords match
    if (password !== confirmPassword) {
        M.toast({ html: 'Passwords do not match!' }); //will need to be changed
        $('#confirmPassword').addClass('invalid'); // Adds a red underline for materializecss
    } else {
        $('#confirmPassword').removeClass('invalid').addClass('valid'); // Adds a green underline if they match
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

        // Gather form data
        const user = {
            fullName: $("#fullName").val(),
            age: $("#age").val(),
            Gender: $("#Gender").val(),
            weight: $("#weight").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            confirmPassword: $("#confirmPassword").val(),
            phone: $("#phone").val(),
            goal: $("#goal").val()
        };

        // Send the data via a POST request
        signupUser(user);
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