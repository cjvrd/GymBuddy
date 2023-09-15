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
            alert('User post successful');
        } else {
            alert('Signup failed. ' + (result.message || ''));
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
            // window.location.href = '/progress.html'
            window.location.reload();
        } else {
            alert("Error loggin in");
        }
    }

    catch (err) {
        // alert('Login error. Please try again.');
        console.error('Login Error:', err);
    }
};

// This function checks if the passwords match
function checkPasswordsMatch() {
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();

    // Check if passwords match
    if (password !== confirmPassword) {
        M.toast({ html: 'Passwords do not match!' });
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

    // check for the token in local storage and display appropraite UI
    const token = localStorage.getItem('token');
    const loginContainer = $("#loginContainer");
    const newuserContainer = $("#newuserContainer");
    const logoutContainer = $("#logoutContainer");
    const wrapper = $(".wrapper");

    if (token) {
        // user is logged in
        loginContainer.hide();
        newuserContainer.hide();
        logoutContainer.show();
        wrapper.append("<h3> Logged in</h3>");
    } else {
        // user is not logged in
        loginContainer.show();
        newuserContainer.show();
        logoutContainer.hide();
    }

    // handle logout
    $('#logoutButton').on('click', function () {
        // remove the token from local storage
        localStorage.removeItem('token');

        // hide the logout button and message
        logoutContainer.hide();
        wrapper.find("h3:contains('Logged in')").remove();

        // show the login form
        loginContainer.show();
        newuserContainer.show();
        console.log("refreshing..")
        location.reload('');
    });
});