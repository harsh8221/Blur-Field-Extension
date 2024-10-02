// src/content/selectionMode.ts

import { blurElement } from "./blurManager";
import { getUniqueSelector } from "./utils";

let isSelectionMode = false;
let hoverElement: HTMLElement | null = null;

export function initializeSelectionMode(): void {
  // Initialization if needed
}

// Function to toggle selection mode
export function toggleSelectionMode(): void {
  isSelectionMode = !isSelectionMode;
  if (isSelectionMode) {
    document.body.classList.add("blur-selection-mode");
    document.addEventListener("click", handleElementClick, true);
    document.addEventListener("mousemove", handleMouseMove, true);
  } else {
    document.body.classList.remove("blur-selection-mode");
    document.removeEventListener("click", handleElementClick, true);
    document.removeEventListener("mousemove", handleMouseMove, true);
    if (hoverElement) {
      hoverElement.classList.remove("hover-highlight");
      hoverElement = null;
    }
  }
}

// Function to handle element click in selection mode
function handleElementClick(event: Event): void {
  event.preventDefault();
  event.stopPropagation();

  const element = event.target as HTMLElement;
  blurElement(element);
  toggleSelectionMode();
}

// Function to handle mouse move in selection mode
function handleMouseMove(event: MouseEvent): void {
  const element = event.target as HTMLElement;
  if (hoverElement !== element) {
    if (hoverElement) {
      hoverElement.classList.remove("hover-highlight");
    }
    hoverElement = element;
    hoverElement.classList.add("hover-highlight");
  }
}
