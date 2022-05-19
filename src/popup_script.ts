chrome.runtime.sendMessage(
  {
    message: 'get_name'
  },
  (response) => {
    const querySelector = document.querySelector('div');
    if (response.message === 'success' && querySelector) {
      querySelector.innerHTML = `Hello ${response.payload}`;
    }
  }
);
