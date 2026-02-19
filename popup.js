document.addEventListener("DOMContentLoaded", function () {
    const tokenDisplay = document.getElementById("token-display");
    const accountIdDisplay = document.getElementById("account-id-display");
    const cookieSourceDisplay = document.getElementById("cookie-source-display");
    const copyTokenButton = document.getElementById("copy-token-button");

    const COOKIE_NAMES = [
        "BYTHEN_AUTH",
        "bythen_cms",
        "BYTHEN_AUTH_GACHA",
        "BYTHEN_PLATFORM_TOKEN",
    ];

    function extractAndDisplay() {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                if (tabs[0]) {
                    const currentUrl = tabs[0].url;
                    tryNextCookie(currentUrl, 0);
                } else {
                    displayError("Could not determine active tab.");
                }
            }
        );
    }

    function tryNextCookie(url, index) {
        if (index >= COOKIE_NAMES.length) {
            displayError(
                `No authentication cookies found (${COOKIE_NAMES.join(", ")}).`
            );
            return;
        }

        const cookieName = COOKIE_NAMES[index];
        chrome.cookies.get({ url: url, name: cookieName }, function (cookie) {
            if (cookie) {
                processCookie(cookie, cookieName);
            } else {
                tryNextCookie(url, index + 1);
            }
        });
    }

    function processCookie(cookie, cookieName) {
        try {
            const decodedValue = decodeURIComponent(cookie.value);
            let accessToken = decodedValue;
            let accountId = null;

            try {
                // Try parsing as JSON first
                const jsonValue = JSON.parse(decodedValue);
                if (jsonValue && typeof jsonValue === "object") {
                    accessToken = jsonValue.access_token || accessToken;
                    accountId = jsonValue.account_id;
                }
            } catch (e) {
                // Not JSON, use raw value as token
            }

            tokenDisplay.value = accessToken;
            cookieSourceDisplay.textContent = cookieName;

            // Only display account ID if it exists
            if (accountId !== undefined && accountId !== null) {
                accountIdDisplay.textContent = accountId;
            } else {
                accountIdDisplay.textContent = "N/A";
            }

            // Auto-copy access token
            navigator.clipboard.writeText(accessToken).then(() => {
                copyTokenButton.textContent = "Copied!";
                setTimeout(() => {
                    copyTokenButton.textContent = "Copy Again";
                }, 2000);
            });
        } catch (e) {
            displayError("Error parsing cookie value.");
        }
    }

    function displayError(message) {
        tokenDisplay.value = message;
        accountIdDisplay.textContent = "Error";
        cookieSourceDisplay.textContent = "Error";
    }

    copyTokenButton.addEventListener("click", () => {
        navigator.clipboard.writeText(tokenDisplay.value).then(() => {
            copyTokenButton.textContent = "Copied!";
            setTimeout(() => {
                copyTokenButton.textContent = "Copy Again";
            }, 2000);
        });
    });

    extractAndDisplay();
});
