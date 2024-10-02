import { observeElement } from "./observers";

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
