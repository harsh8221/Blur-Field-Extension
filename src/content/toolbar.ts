import { toggleSelectionMode, toggleEntirePageBlur } from "./selectionMode";

export function createToolbar(): HTMLElement {
  const toolbar = document.createElement("div");
  toolbar.id = "blur-extension-toolbar";

  //set initial styles
  toolbar.style.position = "fixed";
  toolbar.style.bottom = "0";
  toolbar.style.left = "0";
  toolbar.style.width = "100%";
  toolbar.style.height = "50px";
  toolbar.style.backgroundColor = "#333";
  toolbar.style.color = "#fff";
  toolbar.style.display = "flex";
  toolbar.style.alignItems = "center";
  toolbar.style.justifyContent = "space-around";
  toolbar.style.zIndex = "9999";
  toolbar.style.boxShadow = "0 -2px 5px rgba(0, 0, 0, 0.3)";

  toolbar.style.display = "none";

  const blurButton = document.createElement("button");
  blurButton.innerText = "Blur Selection Mode";
  blurButton.style.padding = "10px 20px";
  blurButton.style.fontSize = "14px";
  blurButton.style.cursor = "pointer";

  blurButton.addEventListener("click", toggleSelectionMode);

  // Blur Entire Page Button
  const blurPageButton = document.createElement("button");
  blurPageButton.innerText = "Blur Entire Page";
  blurPageButton.style.padding = "10px 20px";
  blurPageButton.style.fontSize = "14px";
  blurPageButton.style.cursor = "pointer";

  blurPageButton.addEventListener("click", () => {
    let isPageBlurred = toggleEntirePageBlur();
    if (isPageBlurred) {
      blurPageButton.innerText = "Unblur Page";
    } else {
      blurPageButton.innerText = "Blur Entire Page";
    }
  });

  // Append buttons to the toolbar
  toolbar.appendChild(blurButton);
  toolbar.appendChild(blurPageButton);

  return toolbar;
}

export function showToolbar(): void {
  const toolbar = document.getElementById("blur-extension-toolbar");
  if (toolbar) {
    toolbar.style.display = "flex";
  }
}

export function hideToolbar(): void {
  const toolbar = document.getElementById("blur-extension-toolbar");
  if (toolbar) {
    toolbar.style.display = "none";
  }
}

export function toggleToolbar(): void {
  const toolbar = document.getElementById("blur-extension-toolbar");
  if (toolbar) {
    if (toolbar.style.display === "none") {
      toolbar.style.display = "flex";
    } else {
      toolbar.style.display = "none";
    }
  }
}
