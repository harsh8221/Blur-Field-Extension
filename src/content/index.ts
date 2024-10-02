// src/content/index.ts

import { injectStyles } from "./styles";
import { initializeBlurManager } from "./blurManager";
import { initializeSelectionMode } from "./selectionMode";
import { initializeMessageHandler } from "./messageHandler";
import { applyStoredBlurs } from "./storage";
import { observeDynamicContent } from "./observers";

// Function to initialize the extension after DOM is ready
function initializeExtension(): void {
  injectStyles();
  applyStoredBlurs();
  initializeBlurManager();
  initializeSelectionMode();
  initializeMessageHandler();
  observeDynamicContent();
}

observeDynamicContent();
// Wait for DOM content to be loaded before initializing
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}
