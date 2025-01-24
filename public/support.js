document.addEventListener('DOMContentLoaded', () => {
    const supportForm = document.getElementById('supportForm');

    supportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formdata = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            issue: document.getElementById('issue').value
        }

        // console.log('Form Data:', data); // Debugging log

        try {
            // Send the data to the backend
            const response = await fetch('/submit-support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formdata),
            });

            // console.log('Response Status:', response.status); // Debugging log

            if (!response.ok) {
                throw new Error('Failed to submit the form.');
            }

            const result = await response.json();
        e
            Toast.show('Your support request has been submitted successfully!');
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('issue').value = '';    

        } catch (error) {
            Toast.show("Sent!");
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 2000);
        }
        
    });
});