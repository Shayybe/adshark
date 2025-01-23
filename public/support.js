document.addEventListener('DOMContentLoaded', () => {
    const supportForm = document.getElementById('supportForm');

    supportForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission

        // Get form data
        const formData = new FormData(supportForm);
        const data = Object.fromEntries(formData.entries());

        // console.log('Form Data:', data); // Debugging log

        try {
            // Send the data to the backend
            const response = await fetch('/submit-support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // console.log('Response Status:', response.status); // Debugging log

            if (!response.ok) {
                throw new Error('Failed to submit the form.');
            }

            const result = await response.json();
            // console.log('Form submission successful:', result); // Debugging log

            // Show a success message
            Toast.show('Your support request has been submitted successfully!');
            supportForm.reset(); // Clear the form
        } catch (error) {
            console.error('Error submitting the form:', error);
            alert('An error occurred. Please try again.');
        }
    });
});