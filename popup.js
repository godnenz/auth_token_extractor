document.addEventListener('DOMContentLoaded', function() {
  const tokenDisplay = document.getElementById('token-display');
  const copyButton = document.getElementById('copy-button');

  function extractAndCopyToken() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        const currentUrl = tabs[0].url;
        chrome.cookies.get({ url: currentUrl, name: 'BYTHEN_AUTH' }, function(cookie) {
          if (cookie) {
            try {
              const decodedValue = decodeURIComponent(cookie.value);
              const jsonValue = JSON.parse(decodedValue);
              const accessToken = jsonValue.access_token;
              tokenDisplay.value = accessToken;
              navigator.clipboard.writeText(accessToken).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                  copyButton.textContent = 'Copy to Clipboard';
                }, 2000);
              });
            } catch (e) {
              tokenDisplay.value = 'Error parsing cookie value.';
            }
          } else {
            tokenDisplay.value = 'BYTHEN_AUTH cookie not found on this page.';
          }
        });
      } else {
        tokenDisplay.value = 'Could not determine active tab.';
      }
    });
  }

  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(tokenDisplay.value).then(() => {
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy to Clipboard';
      }, 2000);
    });
  });

  extractAndCopyToken();
});
