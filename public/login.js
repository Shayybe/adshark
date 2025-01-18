const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{
    container.classList.remove("sign-up-mode");
});

document.getElementById('sign-up-btn').addEventListener('click', () => {
    document.querySelector('.signin-signup').classList.add('sign-up-mode');
  });
  
  document.getElementById('sign-in-btn').addEventListener('click', () => {
    document.querySelector('.signin-signup').classList.remove('sign-up-mode');
  });

//signup
  document.querySelector('.sign-up-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally
  
    const username = document.querySelector('input[name="username"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
  
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
  
      // If no error, submit the form programmatically
      document.querySelector('.sign-up-form').submit();
    } catch (error) {
      console.error('Error checking user:', error);
      document.getElementById('signup-error').textContent = 'An error occurred. Please try again.';
      document.getElementById('signup-error').style.display = 'block';
    }
  });
  
  document.querySelector('.sign-in-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
  