# Tabby - Automatic Tab Closer

Tabby is a Chrome extension that automatically closes inactive tabs after a user-defined period of inactivity. Closed tabs are saved and can be easily reopened from the extension popup. The extension tracks real user activity (mouse, keyboard, scroll, etc.) for accurate inactivity detection and provides controls to pause/resume the auto-closing timer.

---

## 🚀 Features

- **Automatic Tab Closing:** Closes inactive tabs after a set period (default: 30 minutes).
- **User Activity Tracking:** Only closes tabs that have not been interacted with (mouse, keyboard, scroll, etc.).
- **Closed Tab Recovery:** View and reopen recently closed tabs from the popup.
- **Custom Timeout:** Set your preferred inactivity timeout in minutes.
- **Pause/Resume:** Temporarily stop or resume the auto-closing timer with a single button.
- **Clear History:** Remove all saved closed tabs with one click.
- **Modern UI:** Clean, responsive popup interface.

---

## 🛠️ Installation

1. **Clone or Download the Repository:**
   ```sh
   git clone <this-repo-url>
   cd tabby
   ```
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Build the Extension:**
   ```sh
   npx tsc --outDir dist
   ```
4. **Load the Extension in Chrome:**
   - Go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project directory

---

## 💡 Usage

- **Set Timeout:**
  In the popup, enter the number of minutes after which inactive tabs should be closed. Click "Save". The current timeout is displayed below the input.

- **Pause/Resume:**
  Click the "Running"/"Stopped" button to pause or resume the auto-closing timer.

  - **Running:** Tabs will be closed automatically.
  - **Stopped:** No tabs will be closed.

- **View Closed Tabs:**
  The popup lists recently closed tabs. Click a tab’s title to reopen it.

- **Remove Individual Tabs:**
  Click the 🗑️ button next to a closed tab to remove it from the list.

- **Clear All:**
  Click "Clear All" to remove all closed tabs from the list.

---

## 🧩 How It Works

- **Background Script:**
  Tracks tab activity and closes tabs that have been inactive for longer than the set timeout. Stores closed tabs for recovery.

- **Content Script:**
  Injected into all pages to listen for user activity (mouse, keyboard, scroll, touch). Notifies the background script to update the tab’s last activity time.

- **Popup:**
  Provides a UI for managing closed tabs, setting the timeout, and pausing/resuming the timer.

---

## 🏗️ Development

- **Source Code:**

  - `src/background.ts` — Background logic for tab management.
  - `src/content.ts` — Content script for user activity tracking.
  - `src/popup.ts` — Popup UI logic.
  - `style.css` — Popup styling.

- **Build:**
  Compiles TypeScript from `src/` to JavaScript in `dist/`.

- **Manifest:**
  `manifest.json` (Manifest V3) configures permissions, background, and content scripts.

---

## 🔒 Permissions

- `tabs` — Manage and close browser tabs.
- `storage` — Store closed tabs and user settings.
- `alarms` — Schedule periodic checks for inactive tabs.
- `scripting` — Inject content scripts.
- `host_permissions: <all_urls>` — Run content script on all pages.

---

## 📄 License

ISC

---

