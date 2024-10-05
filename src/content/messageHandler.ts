// src/content/messageHandler.ts

import { toggleToolbar } from "./toolbar";
import { toggleSelectionMode, toggleEntirePageBlur } from "./selectionMode";
import { createBlurOverlay, removeBlurOverlay } from "./blurOverlay";

let isPageBlurred = false;

export function initializeMessageHandler(): void {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggle_selection_mode") {
      toggleSelectionMode();
    } else if (request.action === "blur_everything") {
      if (!isPageBlurred) {
        createBlurOverlay();
        isPageBlurred = true;
      } else {
        removeBlurOverlay();
        isPageBlurred = false;
      }
    } else if (request.action === "toggle_toolbar") {
      toggleToolbar();
    }
  });
}
