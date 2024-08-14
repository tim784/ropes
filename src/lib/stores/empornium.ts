// Clears and restores empornium elements and stylesheets
// This ensures that empornium elements are hidden and empornium stylesheets are disabled (and vice versa)
import { writable, get } from 'svelte/store';
import { appId, appStylesId } from '$lib/constants';

type EmporniumElement = {
  ref: HTMLElement;
  oldDisplay: string;
};

function hideEmporniumElements() {
  // don't target ourselves
  const emporniumElements = [...document.querySelectorAll(`body > *:not(#${appId})`)]
    .filter((element) => element instanceof HTMLElement)
    .map((element) => {
      const oldDisplay = element.style.display;

      element.style.display = 'none';

      return {
        ref: element,
        oldDisplay
      } as EmporniumElement;
    });
  return emporniumElements;
}

function showEmporniumElements(emporniumElements: EmporniumElement[]) {
  emporniumElements.forEach(({ ref: element, oldDisplay: display }) => {
    element.style.display = display;
  });
}

type EmporniumStyleSheet = {
  ref: CSSStyleSheet;
  oldDisabled: boolean;
};

function isAppyStyleSheet(styleSheet: CSSStyleSheet) {
  const owner = styleSheet.ownerNode as HTMLStyleElement | null;

  // check if its our stylesheet or vite's dev server stylesheet
  return owner?.id === appStylesId;
}

function isViteDevServerStyleSheet(styleSheet: CSSStyleSheet) {
  const owner = styleSheet.ownerNode as HTMLStyleElement | null;

  return owner?.hasAttribute('data-vite-dev-id');
}

function isOurStyleSheet(styleSheet: CSSStyleSheet) {
  return isAppyStyleSheet(styleSheet) || isViteDevServerStyleSheet(styleSheet);
}

function disableEmporniumStyleSheets() {
  const documentStyleSheets = document.styleSheets;
  const originalStyleSheets: EmporniumStyleSheet[] = [];
  for (let i = 0; i < documentStyleSheets.length; i++) {
    let styleSheet = documentStyleSheets[i];

    if (!isOurStyleSheet(styleSheet)) {
      const oldDisabled = styleSheet.disabled;
      styleSheet.disabled = true;
      originalStyleSheets.push({
        ref: styleSheet,
        oldDisabled
      } as EmporniumStyleSheet);
    } else {
      // this branch isn't really necessary, but during development with the
      // vite dev server, something about HMR injection of our stylesheets
      // causes them to be disabled. doing this doesn't hurt production.
      styleSheet.disabled = false;
    }
  }

  return originalStyleSheets;
}

function enableEmporniumStyleSheets(originalStyleSheets: EmporniumStyleSheet[]) {
  originalStyleSheets.forEach((styleSheet) => {
    styleSheet.ref.disabled = styleSheet.oldDisabled;
  });

  // again, this isn't necessary for production. vite dev server HMR injection
  // of our stylesheets breaks our stylesheet toggling. doesn't hurt production.
  const documentStyleSheets = document.styleSheets;
  for (let i = 0; i < documentStyleSheets.length; i++) {
    let styleSheet = documentStyleSheets[i];
    if (isOurStyleSheet(styleSheet)) {
      styleSheet.disabled = true;
    }
  }
}

type emporniumResources = {
  elements: EmporniumElement[];
  styleSheets: EmporniumStyleSheet[];
};

function createEmporniumStore() {
  const emporniumStore = writable<emporniumResources>({
    elements: [],
    styleSheets: []
  });

  return {
    clear: () => {
      emporniumStore.set({
        elements: hideEmporniumElements(),
        styleSheets: disableEmporniumStyleSheets()
      });
    },
    restore: () => {
      const { elements, styleSheets } = get(emporniumStore);
      showEmporniumElements(elements);
      enableEmporniumStyleSheets(styleSheets);
      emporniumStore.set({
        elements: [],
        styleSheets: []
      });
    }
  };
}

export const empornium = createEmporniumStore();
