// __tests__/content.test.js

const fs = require('fs');
const path = require('path');

// Load and execute the content script code
const contentScript = fs.readFileSync(path.resolve(__dirname, '../content.js'), 'utf8');
eval(contentScript);

describe('Content Script', () => {
  beforeEach(() => {
    // Clear the document body before each test
    document.body.innerHTML = '';
  });

  test('blurCopyButtonFields blurs fields associated with copy buttons', () => {
    // Set up the DOM
    document.body.innerHTML = `
      <div>
        <input id="secretField" value="Sensitive Data">
        <button id="copyButton">Copy</button>
      </div>
    `;

    // Call the function
    blurCopyButtonFields();

    // Get the field and check if the blur class was added
    const field = document.getElementById('secretField');
    expect(field.classList.contains('blurred-element')).toBe(true);
  });

  test('blurFinancialFields blurs elements with financial information', () => {
    // Set up the DOM
    document.body.innerHTML = `
      <span>$1,000.00</span>
      <p>Your balance is €500</p>
      <div>Total: 1000</div>
      <span>No financial info here</span>
    `;

    // Call the function
    blurFinancialFields();

    // Select elements
    const spans = document.querySelectorAll('span');
    const p = document.querySelector('p');
    const div = document.querySelector('div');

    // Check that financial elements have the blur class
    expect(spans[0].classList.contains('blurred-element')).toBe(true); // $1,000.00
    expect(p.classList.contains('blurred-element')).toBe(true); // €500
    expect(div.classList.contains('blurred-element')).toBe(false); // Total: 1000 (no currency symbol)
    expect(spans[1].classList.contains('blurred-element')).toBe(false); // No financial info here
  });

  test('blur effect is removed on hover', () => {
    // Set up the DOM
    document.body.innerHTML = `
      <span class="blurred-element">Sensitive Data</span>
    `;

    // Since jsdom doesn't support :hover, we can check if the style is applied
    const styleElement = document.querySelector('style');
    expect(styleElement.textContent).toContain('.blurred-element:hover');
  });

  test('blurFinancialFields does not blurs elements without financial information', () => {
    // Set up the DOM
    document.body.innerHTML = `
      <span>25,333 Vehicle(s)</span>
      <p>Population: 100,000</p>
      <div>Chapter 5, Page 123</div>
      <span>No financial info here</span>
    `;

    // Call the function
    blurFinancialFields();

    // Select elements
    const spans = document.querySelectorAll('span');
    const p = document.querySelector('p');
    const div = document.querySelector('div');

    // Check that financial elements have the blur class
    expect(spans[0].classList.contains('blurred-element')).toBe(false); // 25,333 Vehicle(s)
    expect(p.classList.contains('blurred-element')).toBe(false); // Population: 100,000
    expect(div.classList.contains('blurred-element')).toBe(false); // Chapter 5, Page 123
    expect(spans[1].classList.contains('blurred-element')).toBe(false); // No financial info here
  })
});
