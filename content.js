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

// Function to blur fields with copy buttons
function blurCopyButtonFields() {
  const copyButtons = document.querySelectorAll('button, a, div');
  copyButtons.forEach((button) => {
    let buttonText = button.textContent.trim().toLowerCase();
    let buttonClass = button.className.toLowerCase();
    let buttonId = button.id.toLowerCase();

    if (
      buttonText.includes('copy') ||
      buttonClass.includes('copy') ||
      buttonId.includes('copy')
    ) {
      // Find associated field to blur
      let fieldToBlur = null;

      // Try previous siblings
      let prev = button.previousElementSibling;
      while (prev) {
        if (
          ['INPUT', 'TEXTAREA', 'SPAN', 'DIV'].includes(prev.tagName)
        ) {
          fieldToBlur = prev;
          break;
        }
        prev = prev.previousElementSibling;
      }

      // Try parent elements
      if (!fieldToBlur) {
        let parent = button.parentElement;
        while (parent) {
          if (
            ['INPUT', 'TEXTAREA', 'SPAN', 'DIV'].includes(parent.tagName)
          ) {
            fieldToBlur = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }

      // Apply blur if field is found
      if (fieldToBlur) {
        fieldToBlur.classList.add('blurred-element');
      }
    }
  });
}

// Function to blur financial fields
function blurFinancialFields() {
  const elements = document.querySelectorAll('span, p, td, a, div');

  const currencySymbols = [
    '$', '€', '£', '¥', '₹', '₩', '₽', '฿', '₫', '₪', '₱', '₨',
  ];

  const financialKeywords = [
    'total', 'balance', 'amount', 'price', 'cost', 'due', 'payment', 'fee', 'charge', 'credit', 'debit', 'invoice', 'bill'
  ];

  elements.forEach((el) => {
    // Skip elements that have child elements
    if (el.children.length > 0) return;

    let text = el.textContent.trim();

    // Skip if text is too long
    if (text.length > 50) return;

    let lowerText = text.toLowerCase();

    // Check for currency symbols in the text
    let containsCurrencySymbol = currencySymbols.some((symbol) =>
      text.includes(symbol)
    );

    // Check for financial keywords
    let containsFinancialKeyword = financialKeywords.some((keyword) =>
      lowerText.includes(keyword)
    );

    // Regex to match monetary values with currency symbols
    let currencyRegex = /[\$€£¥₹₩₽฿₫₪₱₨]\s?\d{1,3}(,\d{3})*(\.\d+)?\b/;

    // Regex to match numbers preceded by financial keywords
    let keywordNumberRegex = new RegExp(
      `\\b(${financialKeywords.join('|')}):?\\s*\\$?€?£?¥?₹?₩?₽?฿?₫?₪?₱?₨?\\d{1,3}(,\\d{3})*(\\.\\d+)?\\b`,
      'i'
    );

    // Perform the checks
    let matchesCurrencyFormat = currencyRegex.test(text);
    let matchesKeywordNumberFormat = keywordNumberRegex.test(text);

    if (containsCurrencySymbol && matchesCurrencyFormat) {
      el.classList.add('blurred-element');
    } else if (containsFinancialKeyword && matchesKeywordNumberFormat) {
      el.classList.add('blurred-element');
    }
  });
}


// Call the functions on page load
injectStyles();
blurCopyButtonFields();
blurFinancialFields();

const observer = new MutationObserver(() => {
  blurCopyButtonFields();
  blurFinancialFields();
});

observer.observe(document.body, { childList: true, subtree: true });


// Listen for the message to blur everything
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'blur_everything') {
    document.body.classList.add('blurred-element');
  }
});

