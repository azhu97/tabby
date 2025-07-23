"use strict";
const DEFAULT_TIMEOUT_MINUTES = 5;
const tabActivity = {};
chrome.tabs.onActivated.addListener(({ tabId }) => {
    tabActivity[tabId] = Date.now();
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete") {
        tabActivity[tabId] = Date.now();
    }
});
chrome.alarms.create("checkTabs", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkTabs") {
        closeInactiveTabs();
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
});
