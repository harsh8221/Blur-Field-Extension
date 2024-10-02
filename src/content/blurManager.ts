import { getUniqueSelector, isExtensionClass } from "./utils";
import { storedSelectors, removeSelector, addSelector } from "./storage";
import { observeElement, disconnectObserver } from "./observers";

export function initializeBlurManager(): void {
  // Any initialization if needed
}

// Function to blur an element
export function blurElement(element: HTMLElement): void {
  const selector = getUniqueSelector(element);
  element.classList.add("blurred-element");
  element.addEventListener("click", handleBlurredElementClick, true);
  addSelector(selector);
  observeElement(element, shouldBlurStoredElement);
}

// Function to unblur an element
function unblurElement(element: HTMLElement): void {
  const selector = getUniqueSelector(element);
  element.classList.remove("blurred-element");
  element.removeEventListener("click", handleBlurredElementClick, true);
  removeSelector(selector);
  disconnectObserver(element);
}

// Handler for clicking on a blurred element to unblur it
export function handleBlurredElementClick(event: Event): void {
  event.preventDefault();
  event.stopPropagation();

  const element = event.currentTarget as HTMLElement;
  unblurElement(element);
}

// Function to check if an element should remain blurred
export function shouldBlurStoredElement(element: Element): boolean {
  return true; // Adjust logic if needed
}
