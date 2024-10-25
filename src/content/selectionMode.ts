// src/content/selectionMode.ts

import { blurElement } from './blurManager';
import { getUniqueSelector } from './utils';
import { createBlurOverlay, removeBlurOverlay } from './blurOverlay';

let isSelectionMode = false;
let isPageBlurred = false;
let hoverElement: HTMLElement | null = null;
let keydownListener: ((event: KeyboardEvent) => void) | null = null;

export function initializeSelectionMode(): void {
  // Initialization if needed
}

// Function to toggle selection mode
export function toggleSelectionMode(): void {
  isSelectionMode = !isSelectionMode;
  if (isSelectionMode) {
    document.body.classList.add('blur-selection-mode');
    document.addEventListener('click', handleElementClick, true);
    document.addEventListener('mousemove', handleMouseMove, true);

    // Add keydown listener to exit selection mode
    keydownListener = handleKeyDown;
    document.addEventListener('keydown', keydownListener, true);
  } else {
    document.body.classList.remove('blur-selection-mode');
    document.removeEventListener('click', handleElementClick, true);
    document.removeEventListener('mousemove', handleMouseMove, true);

    if (keydownListener) {
      document.removeEventListener('keydown', keydownListener, true);
      keydownListener = null;
    }

    if (hoverElement) {
      hoverElement.classList.remove('hover-highlight');
      hoverElement = null;
    }
  }
}

export function toggleEntirePageBlur(): boolean {
  if (!isPageBlurred) {
    createBlurOverlay();
    isPageBlurred = true;
  } else {
    removeBlurOverlay();
    isPageBlurred = false;
  }
  return isPageBlurred;
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
      hoverElement.classList.remove('hover-highlight');
    }
    hoverElement = element;
    hoverElement.classList.add('hover-highlight');
  }
}

// Function to handle keydown events in selection mode
function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.preventDefault();
    event.stopPropagation();

    // Exit blur selection mode
    toggleSelectionMode();
  }
}