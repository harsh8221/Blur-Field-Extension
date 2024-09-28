chrome.commands.onCommand.addListener(function (command) {
  if (command === "blur_everything") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "blur_everything" });
    });
  } else if (command === "toggle_selection_mode") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_selection_mode" });
    });
  }
});

chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, { action: "toggle_selection_mode" });
});