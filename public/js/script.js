

// POST request using fetch
function signupUser(user) {
    console.log("in postUser");
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(result => {
        if(result.statusCode === 201){
            alert('User post successful');
        } else {
            alert('Signup failed. ' + (result.message || ''));
        }
    })
    .catch(err => {
        alert('Failed to signup. Please try again.');
        console.error('Signup Error:', err);
    });
}

// POST request for login using fetch
function loginUser(loginData) {
    console.log("Attempting login");
    fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(result => {
        if(result.statusCode === 200) {
            alert('Login successful');
            // Redirect user to a dashboard or homepage, for example:
            window.location.href = '/progress.html';
        } else {
            alert('Login failed. ' + (result.message || ''));
        }
    })
    .catch(err => {
        alert('Login error. Please try again.');
        console.error('Login Error:', err);
    });
}

// This function checks if the passwords match
function checkPasswordsMatch() {
    let password = $('#password').val();
    let confirmPassword = $('#confirmPassword').val();

    // Check if passwords match
    if (password !== confirmPassword) {
        M.toast({html: 'Passwords do not match!'});
        $('#confirmPassword').addClass('invalid'); // Adds a red underline for materializecss
    } else {
        $('#confirmPassword').removeClass('invalid').addClass('valid'); // Adds a green underline if they match
    }
}


$(document).ready(function(){
    $('.materialbox').materialbox();
    $('select').formSelect();

    // Attach the blur event to the confirmPassword field
    $('#confirmPassword').on('blur', checkPasswordsMatch);

    // Attach event to handle form submission
    $('#signupForm').on('submit', function(event) {
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
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();

        // Gather form data for login
        const loginData = {
            email: $("#email").val(),
            password: $("#password").val()
        };

        // Send the data via a POST request for login
        loginUser(loginData);
    });
})

