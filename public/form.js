document.querySelector('form').addEventListener('submit', async (event) => {
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
      // Display a snackbar instead of an alert
      Toast.show("Campaign created successfully!");

      // Reset form fields
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
