# ID & Certificate Generator

A lightweight front-end app for generating employee ID cards and certificates.

## Features

- Generate employee ID cards from a table-based input form
- Live preview as users fill in details
- Generate certificate layouts
- Print and save ID preview as PDF
- Batch export support

## Install as a desktop app (one time)

1. Double-click `Start App.bat`. It opens the app at `http://localhost:8000/`
   (no Python or other installs needed).
2. Click **Install app on this PC** in the top-right corner (or the install
   icon in the Edge/Chrome address bar).
3. Close the `Start App.bat` window.

The app now opens from its desktop / Start menu icon in its own window and
works offline. After changing the app files, run `Start App.bat` once and open
the installed app so it picks up the new version.

## Run locally

Double-click `Start App.bat`, or serve the folder with any static server, e.g.:

```bash
py -m http.server 8000
```

Then open `http://localhost:8000/`.

## Files

- `index.html` — app structure and JavaScript logic
- `style.css` — styling and print layout
- `manifest.webmanifest`, `sw.js`, `icons/` — installable app and offline support
- `Start App.bat`, `serve.ps1` — local launcher using built-in PowerShell
- `README.md` — usage notes

## Notes

This is a front-end project and is best suited for local use or further extension with a backend/database for persistent storage.
