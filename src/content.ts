// declare const chrome: any;

let isSelectionMode: boolean = false;
let storedSelectors: string[] = [];
let hoverElement: HTMLElement | null = null;

// Get the current hostname
const hostname: string = window.location.hostname;

// Map to keep track of MutationObservers
const observersMap = new WeakMap();

function injectStyles(): void {
  if (document.getElementById("blur-extension-styles")) {
    return;
  }
  const style: HTMLElement = document.createElement("style");
  style.textContent = `
    .blurred-element {
      filter: blur(5px);
      transition: filter 0.3s;
    }
    .blurred-element:hover {
      filter: none;
    }
    .blur-selection-mode * {
      cursor: crosshair !important;
    }
    .blur-selection-mode .hover-highlight {
      outline: 2px solid red !important;
    }
  `;
  document.head.appendChild(style);
}

// Function to apply blur to stored selectors
function applyStoredBlurs(): void {
  chrome.storage.sync.get(
    [hostname],
    function (result: { [key: string]: string[] }) {
      storedSelectors = result[hostname] || [];
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

// Function to toggle selection mode
function toggleSelectionMode(): void {
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

// Function to hanlde element click in selection mode
function handleElementClick(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();

  const element: HTMLElement = event.target as HTMLElement;
  const selector: string = getUniqueSelector(element);

  // Add Blur Class
  element.classList.add("blurred-element");

  // Attach click event to handle unblurring
  element.addEventListener("click", handleBlurredElementClick, true);

  // Add selector to stored selectors
  if (storedSelectors.indexOf(selector) === -1) {
    storedSelectors.push(selector);
    // Store the updated selectors in chrome storage
    chrome.storage.sync.set({ [hostname]: storedSelectors });
  }

  // Observe the element for class changes
  observeElement(element, shouldBlurStoredElement);

  // Exit selection mode
  toggleSelectionMode();
}

// Function to disconnect observer for an element
function disconnectObserver(element: HTMLElement): void {
  if (observersMap.has(element)) {
    const observer = observersMap.get(element);
    observer.disconnect();
    observersMap.delete(element);
  }
}

// Function to handle click on a blurred element to unblur it
function handleBlurredElementClick(event: Event): void {
  event.preventDefault();
  event.stopPropagation();

  const element: HTMLElement = event.currentTarget as HTMLElement;
  const selector: string = getUniqueSelector(element);

  // Remove blur class
  element.classList.remove("blurred-element");

  // Remove the click event listener
  element.removeEventListener("click", handleBlurredElementClick, true);

  // Remove selector from storedSelectors
  const index: number = storedSelectors.indexOf(selector);
  if (index > -1) {
    storedSelectors.splice(index, 1);
    // Update storage
    chrome.storage.sync.set({ [hostname]: storedSelectors });
  }

  // Disconnect the observer for this element
  disconnectObserver(element);
}

// Function to handle mouse move in selection mode
function handleMouseMove(event: Event): void {
  const element: HTMLElement = event.target as HTMLElement;
  if (hoverElement !== element) {
    if (hoverElement) {
      hoverElement.classList.remove("hover-highlight");
    }
    hoverElement = element;
    hoverElement.classList.add("hover-highlight");
  }
}

// Helper function to check for extension-added classes
function isExtensionClass(cls: string): boolean {
  return (
    cls === "blurred-element" ||
    cls === "hover-highlight" ||
    cls === "blur-selection-mode"
  );
}

// Helper function to check for dynamic IDs
function isDynamicId(id: any): boolean {
  // Customize this function based on common patterns for dynamic IDs
  const dynamicPatterns = [/^ember/, /^react/, /^vue/, /^angular/, /^ng-/];
  return dynamicPatterns.some((pattern) => pattern.test(id));
}

// Updated function to generate a unique CSS selector for an element
function getUniqueSelector(element: HTMLElement): string {
  if (element.id && !isDynamicId(element.id)) {
    return "#" + CSS.escape(element.id);
  } else {
    const path: string[] = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector: string = element.nodeName.toLowerCase();

      // Get class names excluding extension-added classes
      const classList: string[] = Array.from(element.classList).filter(
        (cls) => !isExtensionClass(cls)
      );

      if (classList.length > 0) {
        selector += "." + classList.map((cls) => CSS.escape(cls)).join(".");
      }

      // Add nth-of-type if necessary
      const parent: HTMLElement = element.parentNode as HTMLElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (sib) => sib.nodeName === element.nodeName
        );
        if (siblings.length > 1) {
          const index: number = siblings.indexOf(element) + 1;
          selector += `:nth-of-type(${index})`;
        }
      }

      path.unshift(selector);
      element = element.parentElement as HTMLElement;
    }

    return path.join(" > ");
  }
}

// Function to observe class attribute changes
function observeElement(
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

function shouldBlurStoredElement(el: Element): boolean {
  // Always return true; adjust logic if needed
  return true;
}

// Function to verify if an element should be blurred (financial fields)
function shouldBlurFinancialField(el: Element): boolean {
  // Include the same logic used in blurFinancialFields() for individual elements
  const currencySymbols: string[] = [
    "$",
    "€",
    "£",
    "¥",
    "₹",
    "₩",
    "₽",
    "฿",
    "₫",
    "₪",
    "₱",
    "₨",
  ];

  const financialKeywords: string[] = [
    "total",
    "balance",
    "amount",
    "price",
    "cost",
    "due",
    "payment",
    "fee",
    "charge",
    "credit",
    "debit",
    "invoice",
    "bill",
  ];

  // Skip elements that have child elements
  if (el.children.length > 0) return false;

  let text: string = el.textContent ? el.textContent.trim() : "";
  if (text.length > 50) return false;

  let lowerText: string = text.toLowerCase();

  let containsCurrencySymbol: boolean = currencySymbols.some((symbol) =>
    text.includes(symbol)
  );

  let containsFinancialKeyword: boolean = financialKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  let currencyRegex: RegExp = /[\$€£¥₹₩₽฿₫₪₱₨]\s?\d{1,3}(,\d{3})*(\.\d+)?\b/;
  let keywordNumberRegex: RegExp = new RegExp(
    `\\b(${financialKeywords.join(
      "|"
    )}):?\\s*\\$?€?£?¥?₹?₩?₽?฿?₫?₪?₱?₨?\\d{1,3}(,\\d{3})*(\\.\\d+)?\\b`,
    "i"
  );

  let matchesCurrencyFormat: boolean = currencyRegex.test(text);
  let matchesKeywordNumberFormat: boolean = keywordNumberRegex.test(text);

  return (
    (containsCurrencySymbol && matchesCurrencyFormat) ||
    (containsFinancialKeyword && matchesKeywordNumberFormat)
  );
}

// Function to blur financial fields
function blurFinancialFields(): void {
  const elements: NodeListOf<Element> = document.querySelectorAll(
    "span, p, td, a, div, h3, h4, h5, h6"
  );

  elements.forEach((el) => {
    if (shouldBlurFinancialField(el)) {
      el.classList.add("blurred-element");
      observeElement(el, shouldBlurFinancialField);
    }
  });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function (
  request: any,
  sender: any,
  sendResponse: any
) {
  if (request.action === "toggle_selection_mode") {
    toggleSelectionMode();
  } else if (request.action === "blur_everything") {
    document.body.classList.add("blurred-element");
  }
});

// Function to initialize the extension after DOM is ready
function initializeExtension() {
  injectStyles();
  applyStoredBlurs();
  blurFinancialFields();
}

// Call the functions on page load
initializeExtension();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}

const observer = new MutationObserver((mutationsList) => {
  blurFinancialFields();
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // Re-apply stored blurs
      applyStoredBlurs();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for the message to blur everything
chrome.runtime.onMessage.addListener(function (
  request: any,
  sender: any,
  sendResponse: any
) {
  if (request.action === "blur_everything") {
    document.body.classList.add("blurred-element");
  }
});
