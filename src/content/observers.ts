import { shouldBlurStoredElement } from "./blurManager";
import { applyStoredBlurs } from "./storage";

const observersMap = new WeakMap<Element, MutationObserver>();

export function observeElement(
  el: Element,
  verifyFunction: (el: Element) => boolean
): void {
  if (observersMap.has(el)) {
    // Observer already exists
    return;
  }

  const observer: MutationObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        // Re-verify if the blur should be applied
        if (verifyFunction(el)) {
          if (!el.classList.contains("blurred-element")) {
            el.classList.add("blurred-element");
          }
        } else {
          el.classList.remove("blurred-element");
          // Disconnect observer if blur is no longer needed
          observer.disconnect();
          observersMap.delete(el);
        }
      }
    }
  });

  // Start observing the element for attribute changes
  observer.observe(el, { attributes: true, attributeFilter: ["class"] });
  observersMap.set(el, observer);
}

// Function to disconnect observer for an element
export function disconnectObserver(element: HTMLElement): void {
  if (observersMap.has(element)) {
    const observer: MutationObserver | undefined = observersMap.get(element);
    observer?.disconnect();
    observersMap.delete(element);
  }
}

export function observeDynamicContent(): void {
  const observer: MutationObserver = new MutationObserver((mutationsList) => {
    // blurFinancialFields();
    applyStoredBlurs();
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Re-apply stored blurs
        applyStoredBlurs();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
