// Helper function to check for extension-added classes
export function isExtensionClass(cls: string): boolean {
  return (
    cls === "blurred-element" ||
    cls === "hover-highlight" ||
    cls === "blur-selection-mode"
  );
}

// Helper function to check for dynamic IDs
export function isDynamicId(id: any): boolean {
  // Customize this function based on common patterns for dynamic IDs
  const dynamicPatterns = [/^ember/, /^react/, /^vue/, /^angular/, /^ng-/];
  return dynamicPatterns.some((pattern) => pattern.test(id));
}

// Updated function to generate a unique CSS selector for an element
export function getUniqueSelector(element: HTMLElement): string {
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
