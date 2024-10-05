chrome.commands.onCommand.addListener(function (command: any) {
  if (command === "blur_everything") {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "blur_everything" });
      }
    );
  } else if (command === "toggle_selection_mode") {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggle_selection_mode",
        });
      }
    );
  } else if (command === "toggle_toolbar") {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs: any) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_toolbar" });
      }
    );
  }
});

chrome.action.onClicked.addListener(function (tab: any) {
  chrome.tabs.sendMessage(tab.id, { action: "toggle_toolbar" });
});
