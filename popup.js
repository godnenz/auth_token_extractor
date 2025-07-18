document.addEventListener('DOMContentLoaded', function() {
  const tokenDisplay = document.getElementById('token-display');
  const accountIdDisplay = document.getElementById('account-id-display');
  const copyTokenButton = document.getElementById('copy-token-button');

  function extractAndDisplay() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        const currentUrl = tabs[0].url;
        chrome.cookies.get({ url: currentUrl, name: 'BYTHEN_AUTH' }, function(cookie) {
          if (cookie) {
            try {
              const decodedValue = decodeURIComponent(cookie.value);
              const jsonValue = JSON.parse(decodedValue);
              const accessToken = jsonValue.access_token;
              const accountId = jsonValue.account_id;

              tokenDisplay.value = accessToken;
              accountIdDisplay.textContent = accountId;

              // Auto-copy access token
              navigator.clipboard.writeText(accessToken).then(() => {
                copyTokenButton.textContent = 'Copied!';
                setTimeout(() => {
                  copyTokenButton.textContent = 'Copy Again';
                }, 2000);
              });

            } catch (e) {
              tokenDisplay.value = 'Error parsing cookie value.';
              accountIdDisplay.textContent = 'Error parsing cookie value.';
            }
          } else {
            tokenDisplay.value = 'BYTHEN_AUTH cookie not found on this page.';
            accountIdDisplay.textContent = 'BYTHEN_AUTH cookie not found on this page.';
          }
        });
      } else {
        tokenDisplay.value = 'Could not determine active tab.';
        accountIdDisplay.textContent = 'Could not determine active tab.';
      }
    });
  }

  copyTokenButton.addEventListener('click', () => {
    navigator.clipboard.writeText(tokenDisplay.value).then(() => {
      copyTokenButton.textContent = 'Copied!';
      setTimeout(() => {
        copyTokenButton.textContent = 'Copy Again';
      }, 2000);
    });
  });

  extractAndDisplay();
});