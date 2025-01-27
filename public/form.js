
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('campaignForm');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

  const formData = {
    campaignName: document.getElementById('campaign-name').value,
    deviceFormat: document.getElementById('device-format').value,
    trafficType: document.getElementById('traffic-type').value,
    connectionType: document.getElementById('connection-type').value,
    adUnit: document.getElementById('ad-unit').value,
    pricingType: document.getElementById('pricing-type').value,
    landingUrl: document.getElementById('landing-url').value,
    countries: document.getElementById('countries').value.split('\n').map(country => country.trim()),
    price: parseFloat(document.getElementById('price').value),
    schedule: document.querySelector('input[name="schedule"]:checked').value,
    blacklistWhitelist: document.getElementById('blacklist-whitelist').value.split('\n').map(id => id.trim()),
    ipRanges: document.getElementById('ip-range').value.split('\n').map(range => range.trim())
  };

  try {
    const response = await fetch('/api/campaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (data.success) {
      
      Toast.show("Campaign created successfully!");

      document.getElementById('campaign-name').value = '';
      document.getElementById('device-format').value = '';
      document.getElementById('traffic-type').value = '';
      document.getElementById('connection-type').value = '';
      document.getElementById('ad-unit').value = '';
      document.getElementById('pricing-type').value = '';
      document.getElementById('landing-url').value = '';
      document.getElementById('countries').value = '';
      document.getElementById('price').value = '';
      document.querySelector('input[name="schedule"]:checked').checked = false;
      document.getElementById('blacklist-whitelist').value = '';
      document.getElementById('ip-range').value = '';
    } else {
      Toast.show('Error creating campaign: ' + data.message);
    }
  } catch (error) {
    Toast.show('Error submitting form: ' + error.message);
  }
});
});
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('country-search');
  const countryOptions = document.querySelectorAll('.country-option');
  const selectedCountriesContainer = document.querySelector('.selected-countries');
  const originalSelect = document.getElementById('countries');

  // Function to filter countries
  searchInput.addEventListener('input', function(e) {
      const searchText = e.target.value.toLowerCase();
      countryOptions.forEach(option => {
          const countryName = option.textContent.toLowerCase();
          option.style.display = countryName.includes(searchText) ? 'block' : 'none';
      });
  });

  // Function to add selected country
  function addSelectedCountry(countryName, countryValue) {
      const tag = document.createElement('div');
      tag.className = 'selected-country-tag';
      tag.innerHTML = `
          ${countryName}
          <span class="remove-country" data-value="${countryValue}">×</span>
      `;
      selectedCountriesContainer.appendChild(tag);

      // Select the option in the original select element
      const option = originalSelect.querySelector(`option[value="${countryValue}"]`);
      if (option) {
          option.selected = true;
      }
  }

  // Function to remove selected country
  function removeSelectedCountry(countryValue) {
      const tag = selectedCountriesContainer.querySelector(`[data-value="${countryValue}"]`).parentElement;
      tag.remove();

      // Deselect the option in the original select element
      const option = originalSelect.querySelector(`option[value="${countryValue}"]`);
      if (option) {
          option.selected = false;
      }
  }

  // Add click handlers for country options
  countryOptions.forEach(option => {
      option.addEventListener('click', function() {
          const countryValue = this.dataset.value;
          const countryName = this.textContent;
          
          // Check if country is already selected
          const existingTag = selectedCountriesContainer.querySelector(`[data-value="${countryValue}"]`);
          if (!existingTag) {
              addSelectedCountry(countryName, countryValue);
          }
      });
  });

  // Add click handler for removing countries
  selectedCountriesContainer.addEventListener('click', function(e) {
      if (e.target.classList.contains('remove-country')) {
          removeSelectedCountry(e.target.dataset.value);
      }
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const adUnitButtons = document.querySelectorAll('.ad-unit-btn');
  const hiddenInput = document.getElementById('ad-unit');

  adUnitButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Remove active class from all buttons
          adUnitButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Update hidden input value
          hiddenInput.value = this.dataset.value;
      });
  });
});