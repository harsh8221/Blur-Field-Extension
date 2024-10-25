import { toggleSelectionMode, toggleEntirePageBlur } from "./selectionMode";
import blurOn from '../icons/blurOn';
import blurOff from '../icons/blurOff';
import selectIcon from '../icons/selectIcon';

const iconButtonStyle = `
    width: 24px;
    height: 24px;
    margin: 0 15px;
    cursor: pointer;
    transition: transform 0.2s;
  `;

function createBlurSelectionButton(): HTMLElement {
  const blurButton = document.createElement('button');
  blurButton.style.padding = '8px 8px';
  blurButton.style.fontSize = '14px';
  blurButton.style.cursor = 'pointer';
  const blurPageIcon = document.createElement('span');
  blurPageIcon.innerHTML = selectIcon;
  blurPageIcon.style.cssText = iconButtonStyle;

  blurButton.appendChild(blurPageIcon);

  blurButton.addEventListener('click', toggleSelectionMode);
  return blurButton;
}

function createtoggleBlurPageButton(): HTMLElement {
  const blurPageButton = document.createElement('button');
  blurPageButton.style.padding = '8px 8px';
  blurPageButton.style.fontSize = '14px';
  blurPageButton.style.cursor = 'pointer';

  const blurPageIcon = document.createElement('span');
  blurPageIcon.innerHTML = blurOn;
  blurPageIcon.style.cssText = iconButtonStyle;

  blurPageButton.addEventListener('click', () => {
    let isPageBlurred = toggleEntirePageBlur();
    if (isPageBlurred) {
      blurPageIcon.innerHTML = blurOff;
    } else {
      blurPageIcon.innerHTML = blurOn;
    }
  });

  blurPageButton.appendChild(blurPageIcon);
  return blurPageButton;
}

export function createToolbar(): HTMLElement {
  const toolbarContainer = document.createElement('div');
  toolbarContainer.id = 'blur-extension-toolbar';

  toolbarContainer.style.position = 'fixed';
  toolbarContainer.style.bottom = '12px';
  toolbarContainer.style.width = '100%';
  toolbarContainer.style.display = 'flex';
  toolbarContainer.style.justifyContent = 'center';
  toolbarContainer.style.zIndex = '9999';

  const toolbar = document.createElement('div');

  //set initial styles
  toolbar.style.width = 'fit-content';
  toolbar.style.padding = '8px 24px';
  toolbar.style.gap = '8px';
  toolbar.style.borderRadius = '100px';
  toolbar.style.backgroundColor = '#333';
  toolbar.style.color = '#fff';
  toolbar.style.display = 'flex';
  toolbar.style.alignItems = 'center';
  toolbar.style.justifyContent = 'space-around';
  toolbar.style.zIndex = '9999';
  toolbar.style.boxShadow = '0 -2px 5px rgba(0, 0, 0, 0.3)';

  const blurButton = createBlurSelectionButton();

  // Blur Entire Page Button
  const blurPageButton = createtoggleBlurPageButton();

  // Append buttons to the toolbar
  toolbar.appendChild(blurButton);
  toolbar.appendChild(blurPageButton);

  toolbarContainer.appendChild(toolbar);
  return toolbarContainer;
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
