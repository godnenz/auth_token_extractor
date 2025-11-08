# Bythen Auth Token Extractor

A simple Chrome extension to extract `access_token` and `account_id` from `BYTHEN_AUTH` or `BYTHEN_AUTH_GACHA` cookies.

## Features

- Extracts `account_id` and `access_token` from the `BYTHEN_AUTH` or `BYTHEN_AUTH_GACHA` cookie.
- Automatically copies the `access_token` to the clipboard when the extension popup is opened.
- Displays the `account_id` and the source of the cookie (`BYTHEN_AUTH` or `BYTHEN_AUTH_GACHA`).
- Refreshes the token information automatically when you switch tabs or navigate to a new page.
- Simple and clean user interface.

## Installation

1.  **Download or Clone:** Get the extension files by either downloading the ZIP or cloning this repository.
2.  **Open Chrome Extensions:** In your Chrome browser, navigate to `chrome://extensions`.
3.  **Enable Developer Mode:** Turn on the "Developer mode" toggle in the top right corner.
4.  **Load Unpacked:** Click the "Load unpacked" button and select the directory where you saved the extension files.

## How to Use

1.  Navigate to the website where the `BYTHEN_AUTH` or `BYTHEN_AUTH_GACHA` cookie is set.
2.  Click on the extension icon in your browser toolbar.
3.  The popup will display your `account_id` and the cookie source. The `access_token` will be automatically copied to your clipboard.
4.  You can click the "Copy Again" button to manually copy the token.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.
