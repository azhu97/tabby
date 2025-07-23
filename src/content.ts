// Content script to track user activity and notify background

function notifyActivity() {
  chrome.runtime.sendMessage({ type: "tabby-activity" });
}

["mousemove", "keydown", "mousedown", "scroll", "touchstart"].forEach(
  (event) => {
    window.addEventListener(event, notifyActivity, { passive: true });
  }
);
