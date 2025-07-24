"use strict";
const DEFAULT_TIMEOUT_MINUTES = 30;
const tabActivity = {};
chrome.tabs.onActivated.addListener(({ tabId }) => {
    tabActivity[tabId] = Date.now();
    console.log(`[Tabby] Tab activated: ${tabId}, updated activity.`);
    console.log("Time: " + tabActivity[tabId]);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete") {
        tabActivity[tabId] = Date.now();
        console.log(`[Tabby] Tab updated: ${tabId}, updated activity.`);
    }
});
chrome.alarms.create("checkTabs", { periodInMinutes: 0.5 });
chrome.alarms.create("ensureCorrectness", { periodInMinutes: 0.1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkTabs") {
        console.log("[Tabby] Alarm fired: checkTabs");
        closeInactiveTabs();
    }
    if (alarm.name === "ensureCorrectness") {
        console.log("[Tabby] Alarm fired: ensureCorrectness");
        chrome.tabs.query({}, function (tabs) {
            tabs.forEach((tab) => {
                const tabId = tab.id;
                if (tabId && !(tabId in tabActivity)) {
                    tabActivity[tabId] = Date.now();
                }
            });
        });
    }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "tabby-activity" &&
        sender.tab &&
        sender.tab.id !== undefined) {
        tabActivity[sender.tab.id] = Date.now();
        console.log(`[Tabby] Activity from content script: Tab ${sender.tab.id}`);
    }
});
function closeInactiveTabs() {
    chrome.storage.sync.get(["timeoutMinutes", "closedTabs"], (data) => {
        const timeout = data.timeoutMinutes ?? DEFAULT_TIMEOUT_MINUTES;
        const cutoff = Date.now() - timeout * 60 * 1000;
        const closedTabs = data.closedTabs ?? [];
        chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                if (tab.id !== undefined &&
                    tab.url &&
                    !tab.pinned &&
                    !tab.active &&
                    tabActivity[tab.id] &&
                    tabActivity[tab.id] < cutoff) {
                    closedTabs.push({
                        url: tab.url,
                        title: tab.title || tab.url,
                        closedAt: Date.now(),
                    });
                    console.log(`[Tabby] Closing inactive tab: ${tab.id} (${tab.url})`);
                    delete tabActivity[tab.id];
                    chrome.tabs.remove(tab.id);
                }
            }
            chrome.storage.sync.set({ closedTabs });
        });
    });
}
chrome.tabs.onRemoved.addListener((tabId) => {
    delete tabActivity[tabId];
    console.log(`[Tabby] Tab removed: ${tabId}, activity entry deleted.`);
});
// add a window focus thingy
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        chrome.alarms.clear("checkTabs");
        console.log("Chrome is not focused, timer cleared");
    }
    else {
        chrome.alarms.create("checkTabs", { periodInMinutes: 0.5 });
        console.log("Chrome is focused, timer resumed");
    }
});
