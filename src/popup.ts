interface ClosedTab {
  url: string;
  title: string;
  closedAt: number;
}

function renderTabs(): void {
  chrome.storage.sync.get("closedTabs", (data) => {
    const closedTabs: ClosedTab[] = data.closedTabs || [];
    const list = document.getElementById("tab-list")!;
    list.innerHTML = "";

    if (closedTabs.length === 0) {
      list.innerHTML = "<p>No closed tabs found.</p>";
      return;
    }

    closedTabs.forEach((tab, index) => {
      const item = document.createElement("div");
      item.className = "tab-item";

      const link = document.createElement("a");
      link.href = "#";
      link.textContent = tab.title;
      link.onclick = () => {
        chrome.tabs.create({ url: tab.url });
      };

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "🗑️";
      removeBtn.onclick = () => removeTab(index);

      item.appendChild(link);
      item.appendChild(removeBtn);
      list.appendChild(item);
    });
  });
}

function removeTab(index: number): void {
  chrome.storage.sync.get("closedTabs", (data) => {
    const tabs: ClosedTab[] = data.closedTabs || [];
    tabs.splice(index, 1);
    chrome.storage.sync.set({ closedTabs: tabs }, renderTabs);
  });
}

function clearAllTabs(): void {
  chrome.storage.sync.set({ closedTabs: [] }, renderTabs);
}

// Load saved timeout value
chrome.storage.sync.get("timeoutMinutes", (data) => {
  const timeoutInput = document.getElementById("timeout") as HTMLInputElement;
  const timeoutLabel = document.getElementById("timeout-label");
  const timeoutValue = data.timeoutMinutes ?? 30;
  timeoutInput.value = timeoutValue.toString();
  if (timeoutLabel) {
    timeoutLabel.textContent = `Current timeout: ${timeoutValue} minute${
      timeoutValue === 1 ? "" : "s"
    }`;
  }
});

// Save timeout value'

document.getElementById("save-timeout")?.addEventListener("click", () => {
  const timeoutInput = document.getElementById("timeout") as HTMLInputElement;
  const timeout = parseInt(timeoutInput.value, 10);
  if (!isNaN(timeout) && timeout > 0) {
    chrome.storage.sync.set({ timeoutMinutes: timeout }, () => {
      const timeoutLabel = document.getElementById("timeout-label");
      if (timeoutLabel) {
        timeoutLabel.textContent = `Current timeout: ${timeout} minute${
          timeout === 1 ? "" : "s"
        }`;
      }
    });
  }
});

// stop resume buttom
document.getElementById("stop-resume")?.addEventListener("click", (event) => {
  const button = event.target as HTMLButtonElement;
  const currentText = button.textContent?.trim();

  if (currentText === "Running") {
    chrome.alarms.clear("checkTabs", (wasCleared) => {
      if (wasCleared) {
        console.log("Timer cleared");
        button.textContent = "Stopped";
        button.style.backgroundColor = "red";
      } else {
        console.log("Alarm wasn't active");
      }
    });
  } else {
    chrome.alarms.get("checkTabs", (alarm) => {
      if (alarm) {
        console.log("Alarm already running");
      } else {
        console.log("Alarm created");
        chrome.alarms.create("checkTabs", { periodInMinutes: 0.2 });
        button.textContent = "Running";
        button.style.backgroundColor = "green";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  setupStopResumeButton();

  const clearBtn = document.getElementById("clear-all");
  if (clearBtn) {
    clearBtn.addEventListener("click", clearAllTabs);
  }
});

function setupStopResumeButton() {
  const button = document.getElementById("stop-resume") as HTMLButtonElement;
  if (!button) return;

  chrome.alarms.get("checkTabs", (alarm) => {
    if (alarm) {
      button.textContent = "Running";
      button.style.backgroundColor = "green";
    } else {
      button.textContent = "Stopped";
      button.style.backgroundColor = "red";
    }
  });
}
