chrome.commands.onCommand.addListener(function (command) {
  if (command === "blur_everything") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "blur_everything" });
    });
  }
});
