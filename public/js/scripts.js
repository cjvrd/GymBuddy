document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize dropdowns
    setTimeout(function() {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
    }, 0);
    

// Signup form submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        
        const data = {
            fullName: document.getElementById('fullName').value,
            age: document.getElementById('age').value,
            Gender: document.getElementById('Gender').value,
            weight: document.getElementById('weight').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            phone: document.getElementById('phone').value,
            goal: document.getElementById('goal').value
        };
        
        fetch('/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.statusCode === 201) {
                alert('Signup successful!');
                window.location.href = '/details.html';
            } else {
                alert(data.message || 'Error signing up.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error signing up.');
        });
    });
}

    // Login form submission
    const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.statusCode === 200) {
                    alert('Login successful!');
                    window.location.href = '/details.html';
                } else {
                    alert(data.message || 'Error logging in.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error logging in.');
            });
        });
    }
});