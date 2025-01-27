
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('campaignForm');

  if (!form) {
    console.error('Form element not found.');
    return;
  }

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

    const formData = {
      campaignName: getValue('campaign-name'),
      deviceFormat: getValue('device-format'),
      trafficType: getValue('traffic-type'),
      connectionType: getValue('connection-type'),
      adUnit: getValue('ad-unit'),
      pricingType: getCheckedValue('pricing-type'),
      landingUrl: getValue('landing-url'),
      countries: getValue('countries')?.split('\n').map((country) => country.trim()) || [],
      price: parseFloat(getValue('price')) || 0,
      schedule: getCheckedValue('schedule'),
      blacklistWhitelist: getValue('blacklist-whitelist')?.split('\n').map((id) => id.trim()) || [],
      ipRanges: getValue('ip-range')?.split('\n').map((range) => range.trim()) || [],
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
      // Toast.show('Error creating campaign: ' + data.message);
    }
  } catch (error) {
    // Toast.show('Error submitting form: ' + error.message);
  }
});
});
