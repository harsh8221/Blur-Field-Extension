// src/content/messageHandler.ts

import { toggleSelectionMode } from "./selectionMode";

export function initializeMessageHandler(): void {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle_selection_mode") {
      toggleSelectionMode();
    } else if (request.action === "blur_everything") {
      document.body.classList.add("blurred-element");
    }
  });
}
