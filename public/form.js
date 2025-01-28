document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('campaignForm');
  const selectedCountries = new Set();

  if (!form) {
      console.error('Form element not found.');
      return;
  }

  // Handle Ad Unit button selection
  const adUnitButtons = document.querySelectorAll('.ad-unit-btn');
  const adUnitInput = document.getElementById('ad-unit');

  adUnitButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Remove active class from all buttons
          adUnitButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          button.classList.add('active');
          // Set the hidden input value
          adUnitInput.value = button.dataset.value;
      });
  });

  // Handle country selection
  const countryOptions = document.querySelectorAll('.country-option');
  const selectedCountriesContainer = document.querySelector('.selected-countries');

  countryOptions.forEach(option => {
      option.addEventListener('click', () => {
          const countryCode = option.dataset.value;
          const countryName = option.textContent;

          if (selectedCountries.has(countryCode)) {
              // Remove country
              selectedCountries.delete(countryCode);
              const elementToRemove = selectedCountriesContainer.querySelector(`[data-value="${countryCode}"]`);
              if (elementToRemove) elementToRemove.remove();
              option.classList.remove('selected');
          } else {
              // Add country
              selectedCountries.add(countryCode);
              const countryElement = document.createElement('div');
              countryElement.className = 'selected-country';
              countryElement.dataset.value = countryCode;
              countryElement.innerHTML = `
                  ${countryName}
                  <span class="remove-country">&times;</span>
              `;
              selectedCountriesContainer.appendChild(countryElement);
              option.classList.add('selected');

              // Add remove functionality
              countryElement.querySelector('.remove-country').addEventListener('click', () => {
                  selectedCountries.delete(countryCode);
                  countryElement.remove();
                  option.classList.remove('selected');
              });
          }
      });
  });

  // Handle country search
  const searchInput = document.getElementById('country-search');
  searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      countryOptions.forEach(option => {
          const countryName = option.textContent.toLowerCase();
          option.style.display = countryName.includes(searchTerm) ? 'block' : 'none';
      });
  });

  form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const getValue = (id) => {
          const element = document.getElementById(id);
          return element ? element.value : null;
      };

      const getCheckedValue = (name) => {
          const element = document.querySelector(`input[name="${name}"]:checked`);
          return element ? element.value : null;
      };

      // Create formData object
      const formData = {
          campaignName: getValue('campaign-name'),
          deviceFormat: getValue('device-format'),
          trafficType: getValue('traffic-type'),
          connectionType: getValue('connection-type'),
          adUnit: getValue('ad-unit'),
          pricingType: getCheckedValue('pricing-type'),
          landingUrl: getValue('landing-url'),
          countries: Array.from(selectedCountries),
          price: parseFloat(getValue('budget')) || 0,
          schedule: getCheckedValue('schedule'),
          blacklistWhitelist: getValue('blacklist-whitelist')?.split('\n').filter(id => id.trim()) || [],
          ipRanges: getValue('ip-range')?.split('\n').filter(range => range.trim()) || []
      };

      try {
          const response = await fetch('/api/campaigns', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              credentials: 'include',
              body: JSON.stringify(formData)
          });

          const data = await response.json();
          if (data.success) {
              Toast.show("Campaign created successfully!");
              form.reset();
              selectedCountries.clear();
              selectedCountriesContainer.innerHTML = '';
              adUnitButtons.forEach(btn => btn.classList.remove('active'));
              document.querySelector('.selected-countries').innerHTML = '';
              
              // Show campaign tab after successful creation
              showTab('campaign');
          } else {
              Toast.show(data.message || 'Error creating campaign', 'error');
          }
      } catch (error) {
          Toast.show('Error submitting form: ' + error.message, 'error');
      }
  });
});