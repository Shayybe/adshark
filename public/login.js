const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
    document.getElementById("login-error").style.display = "none";
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
    document.getElementById("signup-error").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");

    if (mode === "signup") {
        container.classList.add("sign-up-mode");
        document.getElementById("login-error").style.display = "none";
    } else {
        container.classList.remove("sign-up-mode");
        document.getElementById("signup-error").style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.sign-up-form').addEventListener('submit', async (event) => {
        event.preventDefault(); 

        const usernameInput = document.querySelector('.sign-up-form input[name="username"]');
        const emailInput = document.querySelector('.sign-up-form input[name="email"]');
        const passwordInput = document.querySelector('.sign-up-form input[name="password"]');
        const rePasswordInput = document.querySelector('.sign-up-form input[name="password2"]');

        if (!usernameInput || !emailInput || !passwordInput || !rePasswordInput) {
            console.error('One or more form inputs are missing in the DOM.');
            return;
        }

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const rePassword = rePasswordInput.value;

        if (password !== rePassword) {
            document.getElementById('signup-error').textContent = 'Passwords do not match';
            document.getElementById('signup-error').style.display = 'block';
            return;
        }

        try {
            const response = await fetch('/check-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email }),
            });

            if (!response.ok) {
                const data = await response.json();
                document.getElementById('signup-error').textContent = data.error;
                document.getElementById('signup-error').style.display = 'block';
                return;
            }

            document.querySelector('.sign-up-form').submit();
        } catch (error) {
            console.error('Error checking user:', error);
            document.getElementById('signup-error').textContent = 'An error occurred. Please try again.';
            document.getElementById('signup-error').style.display = 'block';
        }
    });
});


document.querySelector('.sign-in-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting

    const email = document.querySelector('.sign-in-form input[name="email"]').value;
    const password = document.querySelector('.sign-in-form input[name="password"]').value;

    // Clear previous error messages
    const errorElement = document.getElementById('login-error');
    errorElement.textContent = '';
    errorElement.style.display = 'none';

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Login successful
            Toast.show("Sign-in successful!");
            setTimeout(() => {
                window.location.href = data.redirectUrl; // Redirect to dashboard
            }, 2000);
        } else {
            // Login failed
            if (data.message === 'User not found') {
                errorElement.textContent = 'User not found. Please check your email.';
            } else if (data.message === 'Invalid credentials') {
                errorElement.textContent = 'Invalid password. Please try again.';
            } else if (data.error === 'Please verify your email before logging in') {
                errorElement.textContent = 'Please verify your email before logging in.';
            } else {
                errorElement.textContent = 'An unexpected error occurred. Please try again.';
            }
            errorElement.style.display = 'block'; // Show the error message
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorElement.textContent = 'An error occurred. Please try again later.';
        errorElement.style.display = 'block'; // Show the error message
    }
});
