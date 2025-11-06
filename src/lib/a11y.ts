export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite") {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  element.addEventListener("keydown", handleKeyDown);

  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
}

export function getAriaLabel(element: HTMLElement): string {
  return (
    element.getAttribute("aria-label") ||
    element.getAttribute("aria-labelledby") ||
    element.textContent?.trim() ||
    ""
  );
}

export function ensureAriaLabel(element: HTMLElement, fallback: string): void {
  if (!element.hasAttribute("aria-label") && !element.hasAttribute("aria-labelledby")) {
    element.setAttribute("aria-label", fallback);
  }
}

export function createSkipLink(targetId: string, label: string = "Skip to main content"): HTMLAnchorElement {
  const skipLink = document.createElement("a");
  skipLink.href = `#${targetId}`;
  skipLink.className = "sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-blue-600 focus:text-white";
  skipLink.textContent = label;

  return skipLink;
}

export const keyboardKeys = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
  HOME: "Home",
  END: "End",
} as const;

export function isClickKeyboardEvent(e: KeyboardEvent): boolean {
  return e.key === keyboardKeys.ENTER || e.key === keyboardKeys.SPACE;
}

export function makeClickable(
  element: HTMLElement,
  onClick: (e: MouseEvent | KeyboardEvent) => void,
  role: string = "button"
): void {
  element.setAttribute("role", role);
  element.setAttribute("tabindex", "0");

  element.addEventListener("click", onClick);
  element.addEventListener("keydown", (e) => {
    if (isClickKeyboardEvent(e as KeyboardEvent)) {
      e.preventDefault();
      onClick(e);
    }
  });
}

export function setAriaExpanded(element: HTMLElement, expanded: boolean): void {
  element.setAttribute("aria-expanded", String(expanded));
}

export function setAriaPressed(element: HTMLElement, pressed: boolean): void {
  element.setAttribute("aria-pressed", String(pressed));
}

export function setAriaChecked(element: HTMLElement, checked: boolean): void {
  element.setAttribute("aria-checked", String(checked));
}

export function manageDialogFocus(dialogElement: HTMLElement): () => void {
  const previousActiveElement = document.activeElement as HTMLElement;

  const cleanup = trapFocus(dialogElement);

  const firstFocusable = dialogElement.querySelector<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  firstFocusable?.focus();

  return () => {
    cleanup();
    previousActiveElement?.focus();
  };
}
