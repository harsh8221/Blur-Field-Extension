import { observeElement } from "./observers";
import {
  shouldBlurStoredElement,
  handleBlurredElementClick,
} from "./blurManager";

export let storedSelectors: string[] = [];
const hostname = window.location.hostname;

// Function to apply blur to stored selectors
export function applyStoredBlurs(): void {
  chrome.storage.sync.get(
    [hostname],
    function (result: { [key: string]: string[] }) {
      storedSelectors = result[hostname] || [];
      console.log("Extension: ", storedSelectors);
      storedSelectors.forEach((selector: string) => {
        const elements: NodeListOf<Element> =
          document.querySelectorAll(selector);
        elements.forEach((element: Element) => {
          element.classList.add("blurred-element");
          // Attach click event to handle unblurring
          element.addEventListener("click", handleBlurredElementClick, true);
          observeElement(element, shouldBlurStoredElement);
        });
      });
    }
  );
}

export function addSelector(selector: string): void {
  if (storedSelectors.indexOf(selector) === -1) {
    storedSelectors.push(selector);
    chrome.storage.sync.set({ [hostname]: storedSelectors });
  }
}

export function removeSelector(selector: string): void {
  const index = storedSelectors.indexOf(selector);
  if (index > -1) {
    storedSelectors.splice(index, 1);
    chrome.storage.sync.set({ [hostname]: storedSelectors });
  }
}
