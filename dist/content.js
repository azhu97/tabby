"use strict";
// Content script to track user activity and notify background
function notifyActivity() {
    try {
        chrome.runtime.sendMessage({ type: "tabby-activity" });
    }
    catch (err) {
        console.log(err);
    }
}
["mousemove", "keydown", "mousedown", "scroll", "touchstart"].forEach((event) => {
    window.addEventListener(event, notifyActivity, { passive: true });
});
