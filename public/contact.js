document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 

       
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Form Data:', data); 

        try {
            const response = await fetch('/submit-contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            

            if (!response.ok) {
                throw new Error('Failed to submit the form.');
            }

            const result = await response.json();
            Toast.show("Contact form submitted successfully!");
            contactForm.reset();
        } catch (error) {
            Toast.show("An error occurred. Please try again.");
        }
    });
});