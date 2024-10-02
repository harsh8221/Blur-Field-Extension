// function injectStyles() {
//   if (document.getElementById('blur-extension-styles')) {
//     return;
//   }
//   const style = document.createElement('style');
//   style.textContent = `
//     .blurred-element {
//       filter: blur(5px);
//       transition: filter 0.3s;
//     }
//     .blurred-element:hover {
//       filter: none;
//     }
//     .blur-selection-mode * {
//       cursor: crosshair !important;
//     }
//     .blur-selection-mode .hover-highlight {
//       outline: 2px solid red !important;
//     }
//   `;
//   document.head.appendChild(style);
// }

// // Variables
// let isSelectionMode = false;
// let storedSelectors = [];
// let hoverElement = null;

// // Get the current hostname
// const hostname = window.location.hostname;

// // Function to apply blur to stored selectors
// function applyStoredBlurs() {
//   chrome.storage.local.get([hostname], function (result) {
//     console.log("From extension content script", result);
//     storedSelectors = result[hostname] || [];
//     storedSelectors.forEach(selector => {
//       const elements = document.querySelectorAll(selector);
//       elements.forEach(el => {
//         el.classList.add('blurred-element');
//         // Attach click event to handle unblurring
//         el.addEventListener('click', handleBlurredElementClick, true);
//         observeElement(el, shouldBlurStoredElement);
//       });
//     });
//   });
// }

// // Function to toggle selection mode
// function toggleSelectionMode() {
//   isSelectionMode = !isSelectionMode;
//   if (isSelectionMode) {
//     document.body.classList.add('blur-selection-mode');
//     document.addEventListener('click', handleElementClick, true);
//     document.addEventListener('mousemove', handleMouseMove, true);
//   } else {
//     document.body.classList.remove('blur-selection-mode');
//     document.removeEventListener('click', handleElementClick, true);
//     document.removeEventListener('mousemove', handleMouseMove, true);
//     if (hoverElement) {
//       hoverElement.classList.remove('hover-highlight');
//       hoverElement = null;
//     }
//   }
// }

// // Function to handle element click in selection mode
// function handleElementClick(event) {
//   event.preventDefault();
//   event.stopPropagation();

//   const element = event.target;
//   const selector = getUniqueSelector(element);

//   // Add blur class
//   element.classList.add('blurred-element');

//   // Attach click event to handle unblurring
//   element.addEventListener('click', handleBlurredElementClick, true);

//   // Add selector to storedSelectors
//   if (!storedSelectors.includes(selector)) {
//     storedSelectors.push(selector);
//     // Store the updated selectors in chrome.storage
//     chrome.storage.local.set({ [hostname]: storedSelectors });
//   }

//   // Observe the element for class changes
//   observeElement(element, shouldBlurStoredElement);

//   // Exit selection mode
//   toggleSelectionMode();
// }

// // Function to disconnect observer for an element
// function disconnectObserver(el) {
//   if (observersMap.has(el)) {
//     const observer = observersMap.get(el);
//     observer.disconnect();
//     observersMap.delete(el);
//   }
// }

// // Function to handle click on a blurred element to unblur it
// function handleBlurredElementClick(event) {
//   event.preventDefault();
//   event.stopPropagation();

//   const element = event.currentTarget;
//   const selector = getUniqueSelector(element);

//   // Remove blur class
//   element.classList.remove('blurred-element');

//   // Remove the click event listener
//   element.removeEventListener('click', handleBlurredElementClick, true);

//   // Remove selector from storedSelectors
//   const index = storedSelectors.indexOf(selector);
//   if (index > -1) {
//     storedSelectors.splice(index, 1);
//     // Update storage
//     chrome.storage.local.set({ [hostname]: storedSelectors });
//   }

//   // Disconnect the observer for this element
//   disconnectObserver(element);
// }

// // Function to handle mouse move in selection mode
// function handleMouseMove(event) {
//   const element = event.target;
//   if (hoverElement !== element) {
//     if (hoverElement) {
//       hoverElement.classList.remove('hover-highlight');
//     }
//     hoverElement = element;
//     hoverElement.classList.add('hover-highlight');
//   }
// }

// // Helper function to check for extension-added classes
// function isExtensionClass(cls) {
//   return cls === 'blurred-element' || cls === 'hover-highlight' || cls === 'blur-selection-mode';
// }

// // Helper function to check for dynamic IDs
// function isDynamicId(id) {
//   // Customize this function based on common patterns for dynamic IDs
//   const dynamicPatterns = [/^ember/, /^react/, /^vue/, /^angular/, /^ng-/];
//   return dynamicPatterns.some((pattern) => pattern.test(id));
// }

// // Updated function to generate a unique CSS selector for an element
// function getUniqueSelector(element) {
//   if (element.id && !isDynamicId(element.id)) {
//     return '#' + CSS.escape(element.id);
//   } else {
//     const path = [];
//     while (element && element.nodeType === Node.ELEMENT_NODE) {
//       let selector = element.nodeName.toLowerCase();

//       // Get class names excluding extension-added classes
//       const classList = Array.from(element.classList).filter(
//         (cls) => !isExtensionClass(cls)
//       );

//       if (classList.length > 0) {
//         selector += '.' + classList.map((cls) => CSS.escape(cls)).join('.');
//       }

//       // Add nth-of-type if necessary
//       const parent = element.parentNode;
//       if (parent) {
//         const siblings = Array.from(parent.children).filter(
//           (sib) => sib.nodeName === element.nodeName
//         );
//         if (siblings.length > 1) {
//           const index = siblings.indexOf(element) + 1;
//           selector += `:nth-of-type(${index})`;
//         }
//       }

//       path.unshift(selector);
//       element = element.parentElement;
//     }

//     return path.join(' > ');
//   }
// }


// // Map to keep track of MutationObservers
// const observersMap = new WeakMap();

// // Function to observe class attribute changes
// function observeElement(el, verifyFunction) {
//   if (observersMap.has(el)) {
//     // Observer already exists
//     return;
//   }

//   const observer = new MutationObserver((mutationsList) => {
//     for (const mutation of mutationsList) {
//       if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
//         // Re-verify if the blur should be applied
//         if (verifyFunction(el)) {
//           if (!el.classList.contains('blurred-element')) {
//             el.classList.add('blurred-element');
//           }
//         } else {
//           el.classList.remove('blurred-element');
//           // Disconnect observer if blur is no longer needed
//           observer.disconnect();
//           observersMap.delete(el);
//         }
//       }
//     }
//   });

//   // Start observing the element for attribute changes
//   observer.observe(el, { attributes: true, attributeFilter: ['class'] });
//   observersMap.set(el, observer);
// }

// function shouldBlurStoredElement(el) {
//   // Always return true; adjust logic if needed
//   return true;
// }
// // Function to verify if an element should be blurred (financial fields)
// function shouldBlurFinancialField(el) {
// // Include the same logic used in blurFinancialFields() for individual elements
//   const currencySymbols = [
//     '$', '€', '£', '¥', '₹', '₩', '₽', '฿', '₫', '₪', '₱', '₨',
//   ];

//   const financialKeywords = [
//     'total', 'balance', 'amount', 'price', 'cost', 'due', 'payment',
//     'fee', 'charge', 'credit', 'debit', 'invoice', 'bill',
//   ];

//   // Skip elements that have child elements
//   if (el.children.length > 0) return false;

//   let text = el.textContent.trim();
//   if (text.length > 50) return false;

//   let lowerText = text.toLowerCase();

//   let containsCurrencySymbol = currencySymbols.some((symbol) =>
//     text.includes(symbol)
//   );

//   let containsFinancialKeyword = financialKeywords.some((keyword) =>
//     lowerText.includes(keyword)
//   );

//   let currencyRegex = /[\$€£¥₹₩₽฿₫₪₱₨]\s?\d{1,3}(,\d{3})*(\.\d+)?\b/;
//   let keywordNumberRegex = new RegExp(
//     `\\b(${financialKeywords.join('|')}):?\\s*\\$?€?£?¥?₹?₩?₽?฿?₫?₪?₱?₨?\\d{1,3}(,\\d{3})*(\\.\\d+)?\\b`,
//     'i'
//   );

//   let matchesCurrencyFormat = currencyRegex.test(text);
//   let matchesKeywordNumberFormat = keywordNumberRegex.test(text);

//   return (
//     (containsCurrencySymbol && matchesCurrencyFormat) ||
//     (containsFinancialKeyword && matchesKeywordNumberFormat)
//   );
// }

// // Function to blur financial fields
// function blurFinancialFields() {
//   const elements = document.querySelectorAll('span, p, td, a, div, h3, h4, h5, h6');

//   elements.forEach((el) => {
//     if (shouldBlurFinancialField(el)) {
//       el.classList.add('blurred-element');
//       observeElement(el, shouldBlurFinancialField);
//     }
//   });
// }

// // Listen for messages from background script
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'toggle_selection_mode') {
//     toggleSelectionMode();
//   } else if (request.action === 'blur_everything') {
//     document.body.classList.add('blurred-element');
//   }
// });

// // Function to initialize the extension after DOM is ready
// function initializeExtension() {
//   injectStyles();
//   applyStoredBlurs();
//   blurFinancialFields();
// }

// // Call the functions on page load
// initializeExtension();

// if (document.readyState === 'loading') {
//   document.addEventListener('DOMContentLoaded', initializeExtension);
// } else {
//   initializeExtension();
// }

// const observer = new MutationObserver((mutationsList) => {
//   blurFinancialFields(); 
//   for (const mutation of mutationsList) {
//     if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
//       // Re-apply stored blurs
//       applyStoredBlurs();
//     }
//   }
// });

// observer.observe(document.body, { childList: true, subtree: true });


// // Listen for the message to blur everything
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.action === 'blur_everything') {
//     document.body.classList.add('blurred-element');
//   }
// });

