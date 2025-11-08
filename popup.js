document.addEventListener('DOMContentLoaded', function() {
  const tokenDisplay = document.getElementById('token-display');
  const accountIdDisplay = document.getElementById('account-id-display');
  const copyTokenButton = document.getElementById('copy-token-button');
  const cookieSourceDisplay = document.getElementById('cookie-source-display'); // Optional: to show which cookie was used

  function extractAndDisplay() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        const currentUrl = tabs[0].url;
        
        // Try BYTHEN_AUTH first
        chrome.cookies.get({ url: currentUrl, name: 'BYTHEN_AUTH' }, function(cookie) {
          if (cookie) {
            processCookie(cookie, 'BYTHEN_AUTH');
          } else {
            // If BYTHEN_AUTH not found, try BYTHEN_AUTH_GACHA
            chrome.cookies.get({ url: currentUrl, name: 'BYTHEN_AUTH_GACHA' }, function(gachaCookie) {
              if (gachaCookie) {
                processCookie(gachaCookie, 'BYTHEN_AUTH_GACHA');
              } else {
                tokenDisplay.value = 'Neither BYTHEN_AUTH nor BYTHEN_AUTH_GACHA cookie found on this page.';
                accountIdDisplay.textContent = 'Cookie not found.';
                if (cookieSourceDisplay) {
                  cookieSourceDisplay.textContent = 'Source: None';
                }
              }
            });
          }
        });
      } else {
        tokenDisplay.value = 'Could not determine active tab.';
        accountIdDisplay.textContent = 'Could not determine active tab.';
      }
    });
  }

  function processCookie(cookie, cookieName) {
    try {
      const decodedValue = decodeURIComponent(cookie.value);
      const jsonValue = JSON.parse(decodedValue);
      const accessToken = jsonValue.access_token;
      const accountId = jsonValue.account_id;

      tokenDisplay.value = accessToken;
      accountIdDisplay.textContent = accountId;
      
      // Optional: Display which cookie was used
      if (cookieSourceDisplay) {
        cookieSourceDisplay.textContent = `Source: ${cookieName}`;
      }

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
      if (cookieSourceDisplay) {
        cookieSourceDisplay.textContent = `Source: ${cookieName} (parse error)`;
      }
    }
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