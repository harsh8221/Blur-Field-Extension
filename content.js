function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .blurred-element {
      filter: blur(5px);
      transition: filter 0.3s;
    }
    .blurred-element:hover {
      filter: none;
    }
  `;
  document.head.appendChild(style);
}


// Map to keep track of MutationObservers
const observersMap = new WeakMap();

// Function to observe class attribute changes
function observeElement(el, verifyFunction) {
  if (observersMap.has(el)) {
    // Observer already exists
    return;
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // Re-verify if the blur should be applied
        if (verifyFunction(el)) {
          if (!el.classList.contains('blurred-element')) {
            el.classList.add('blurred-element');
          }
        } else {
          el.classList.remove('blurred-element');
          // Disconnect observer if blur is no longer needed
          observer.disconnect();
          observersMap.delete(el);
        }
      }
    }
  });

  // Start observing the element for attribute changes
  observer.observe(el, { attributes: true, attributeFilter: ['class'] });
  observersMap.set(el, observer);
}

// Function to verify if an element should be blurred (financial fields)
function shouldBlurFinancialField(el) {
// Include the same logic used in blurFinancialFields() for individual elements
  const currencySymbols = [
    '$', '€', '£', '¥', '₹', '₩', '₽', '฿', '₫', '₪', '₱', '₨',
  ];

  const financialKeywords = [
    'total', 'balance', 'amount', 'price', 'cost', 'due', 'payment',
    'fee', 'charge', 'credit', 'debit', 'invoice', 'bill',
  ];

  // Skip elements that have child elements
  if (el.children.length > 0) return false;

  let text = el.textContent.trim();
  if (text.length > 50) return false;

  let lowerText = text.toLowerCase();

  let containsCurrencySymbol = currencySymbols.some((symbol) =>
    text.includes(symbol)
  );

  let containsFinancialKeyword = financialKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );

  let currencyRegex = /[\$€£¥₹₩₽฿₫₪₱₨]\s?\d{1,3}(,\d{3})*(\.\d+)?\b/;
  let keywordNumberRegex = new RegExp(
    `\\b(${financialKeywords.join('|')}):?\\s*\\$?€?£?¥?₹?₩?₽?฿?₫?₪?₱?₨?\\d{1,3}(,\\d{3})*(\\.\\d+)?\\b`,
    'i'
  );

  let matchesCurrencyFormat = currencyRegex.test(text);
  let matchesKeywordNumberFormat = keywordNumberRegex.test(text);

  return (
    (containsCurrencySymbol && matchesCurrencyFormat) ||
    (containsFinancialKeyword && matchesKeywordNumberFormat)
  );
}

// Function to blur financial fields
function blurFinancialFields() {
  const elements = document.querySelectorAll('span, p, td, a, div, h3, h4, h5, h6');

  elements.forEach((el) => {
    if (shouldBlurFinancialField(el)) {
      el.classList.add('blurred-element');
      observeElement(el, shouldBlurFinancialField);
    }
  });
}


// Call the functions on page load
injectStyles();
blurFinancialFields();

const observer = new MutationObserver(() => {
  blurFinancialFields();
});

observer.observe(document.body, { childList: true, subtree: true });


// Listen for the message to blur everything
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'blur_everything') {
    document.body.classList.add('blurred-element');
  }
});

