document.addEventListener('DOMContentLoaded', function() {
    // Handle filter changes
    const filterSelects = document.querySelectorAll('.custom-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            
            console.log('Filter changed:', this.value);
        });
    });

    // Handle create campaign buttons
    const campaignButtons = document.querySelectorAll('.create-campaign-btn');
    campaignButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Navigate to new campaign page with pre-filled data
            showTab('newCampaign');
        });
    });
});