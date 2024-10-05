// src/content/blurOverlay.ts

export function createBlurOverlay(): void {
  // Check if overlay already exists
  if (document.getElementById("blur-extension-overlay")) {
    return;
  }

  const overlay: any = document.createElement("div");
  overlay.id = "blur-extension-overlay";

  // Set styles for the overlay
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.pointerEvents = "none";
  overlay.style.backdropFilter = "blur(5px)";
  overlay.style.webkitBackdropFilter = "blur(5px)"; // For Safari
  overlay.style.zIndex = "9998"; // Should be less than toolbar's z-index
  overlay.style.backgroundColor = "rgba(255, 255, 255, 0.5)"; // Fallback for unsupported browsers

  document.body.appendChild(overlay);
}

export function removeBlurOverlay(): void {
  const overlay = document.getElementById("blur-extension-overlay");
  if (overlay) {
    overlay.parentNode?.removeChild(overlay);
  }
}
