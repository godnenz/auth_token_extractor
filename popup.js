document.addEventListener("DOMContentLoaded", function () {
    const tokenDisplay = document.getElementById("token-display");
    const accountIdDisplay = document.getElementById("account-id-display");
    const copyTokenButton = document.getElementById("copy-token-button");

    function extractAndDisplay() {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                if (tabs[0]) {
                    const currentUrl = tabs[0].url;

                    // Try cookies in priority order: BYTHEN_AUTH -> bythen_cms -> BYTHEN_AUTH_GACHA
                    tryCookie(currentUrl, "BYTHEN_AUTH", function (success) {
                        if (!success) {
                            tryCookie(
                                currentUrl,
                                "bythen_cms",
                                function (success) {
                                    if (!success) {
                                        tryCookie(
                                            currentUrl,
                                            "BYTHEN_AUTH_GACHA",
                                            function (success) {
                                                if (!success) {
                                                    tokenDisplay.value =
                                                        "No authentication cookies found (BYTHEN_AUTH, bythen_cms, or BYTHEN_AUTH_GACHA).";
                                                    accountIdDisplay.textContent =
                                                        "Cookie not found.";
                                                }
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    });
                } else {
                    tokenDisplay.value = "Could not determine active tab.";
                    accountIdDisplay.textContent =
                        "Could not determine active tab.";
                }
            }
        );
    }

    function tryCookie(url, cookieName, callback) {
        chrome.cookies.get({ url: url, name: cookieName }, function (cookie) {
            if (cookie) {
                processCookie(cookie, cookieName);
                callback(true);
            } else {
                callback(false);
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
            tokenDisplay.value = "Error parsing cookie value.";
            accountIdDisplay.textContent = "Error parsing cookie value.";
        }
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
