export function injectStyles(): void {
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
    .blurred-page {
      filter: blur(5px);
      transition: filter 0.3s;
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
