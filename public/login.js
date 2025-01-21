const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () => {
    container.classList.add("sign-up-mode");
    document.getElementById('login-error').style.display = 'none'; // Clear login error
});

sign_in_btn.addEventListener('click', () => {
    container.classList.remove("sign-up-mode");
    document.getElementById('signup-error').style.display = 'none'; // Clear signup error
});

// Wait for the DOM to load before attaching the event listener
document.addEventListener('DOMContentLoaded', () => {
    // Attach a submit event listener to the sign-up form
    document.querySelector('.sign-up-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting normally

        // Get references to the form inputs
        const usernameInput = document.querySelector('.sign-up-form input[name="username"]');
        const emailInput = document.querySelector('.sign-up-form input[name="email"]');
        const passwordInput = document.querySelector('.sign-up-form input[name="password"]');
        const rePasswordInput = document.querySelector('.sign-up-form input[name="password2"]');

        // Check if all elements exist
        if (!usernameInput || !emailInput || !passwordInput || !rePasswordInput) {
            console.error('One or more form inputs are missing in the DOM.');
            return;
        }

        // Get the values from the inputs
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const rePassword = rePasswordInput.value;

        // Check if passwords match
        if (password !== rePassword) {
            document.getElementById('signup-error').textContent = 'Passwords do not match';
            document.getElementById('signup-error').style.display = 'block';
            return;
        }

        try {
            // Send a request to the server to check if the user already exists
            const response = await fetch('/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email }),
            });

            // Handle the response
            if (!response.ok) {
                const data = await response.json();
                document.getElementById('signup-error').textContent = data.error;
                document.getElementById('signup-error').style.display = 'block';
                return;
            }

            // If no error, submit the form programmatically
            document.querySelector('.sign-up-form').submit();
        } catch (error) {
            console.error('Error checking user:', error);
            document.getElementById('signup-error').textContent = 'An error occurred. Please try again.';
            document.getElementById('signup-error').style.display = 'block';
        }
    });
});
document.querySelector('.sign-in-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const email = document.querySelector('.sign-in-form input[name="email"]').value;
    const password = document.querySelector('.sign-in-form input[name="password"]').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
            // Redirect to the dashboard if login is successful
            window.location.href = data.redirectUrl;
        } else {
            // Display the error message
            const errorElement = document.getElementById('login-error');
            errorElement.textContent = data.error;
            errorElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error during login:', error);
        const errorElement = document.getElementById('login-error');
        errorElement.textContent = 'Check Password and Email again';
        errorElement.style.display = 'block';
    }
});



//login.js
// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//         // Send a POST request to the backend to login the user
//         const response = await fetch('/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ email, password }),  // Send email and password to the server
//         });

//         const data = await response.json();

//         if (response.ok) {
//             console.log('Login successful:', data);  // Log success message
//         } else {
//             console.error('Login failed:', data.message);  // Log error message
//         }
//     } catch (error) {
//         console.error('Error logging in:', error);
//     }
// });

//signup.js
// document.getElementById('registerForm').addEventListener('submit', async (event) => {
//     event.preventDefault(); // Prevent the default form submission

//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     try {
//         const response = await fetch('/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, email, password }),
//         });

//         const data = await response.json();
//         const messageDiv = document.getElementById('message');
//         messageDiv.innerText = data.message;
//         messageDiv.style.color = data.success ? 'green' : 'red';
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
