
const Toast = {
    container: null,
  
    // Initialize the toast container
    init() {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    },
  
    // Show a toast notification
    show(message, type = 'info', duration = 3000) {
      if (!this.container) {
        this.init();
      }
  
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = message;
  
      this.container.appendChild(toast);
  
      // Trigger animation
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });
  
      // Remove the toast after the duration
      setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
      }, duration);
    }
  };
  
  // Example usage:
  // Toast.show('Campaign created successfully!', 'success');
  // Toast.show('Error creating campaign.', 'error');
  