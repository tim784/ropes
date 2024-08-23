// Cleans and restores empornium elements, stylesheets, and style attribute
// values applied directly to the <html> and <body> elements (because they can
// effect us). This ensures that empornium elements are hidden and empornium
// stylesheets are disabled (and vice versa)

import { writable } from 'svelte/store';
import { appId } from '$lib/constants';

function isNotOurs(element: HTMLElement) {
  return element.closest(`#${appId}`) === null;
}

type EmporniumElement = {
  element: HTMLElement;
  oldDisplayValue: string;
};

function hideEmporniumElements() {
  const emporniumElements = [...document.querySelectorAll(`body > *`)]
    .filter((element) => element instanceof HTMLElement)
    .filter(isNotOurs)
    .map((element) => {
      const oldDisplay = element.style.display;

      element.style.display = 'none';

      return {
        element,
        oldDisplayValue: oldDisplay
      } as EmporniumElement;
    });
  return emporniumElements;
}

function showEmporniumElements(emporniumElements: EmporniumElement[]) {
  emporniumElements.forEach(({ element, oldDisplayValue: oldDisplay }) => {
    element.style.display = oldDisplay;
  });
}

type EmporniumStyleSheet = {
  stylesheet: CSSStyleSheet;
  oldDisabled: boolean;
};

function disableEmporniumStyleSheets() {
  return [...document.styleSheets]
    .filter((stylesheet) => {
      const owner = stylesheet.ownerNode as HTMLStyleElement | null;
      return owner ? isNotOurs(owner) : false;
    })
    .map((stylesheet) => {
      const oldDisabled = stylesheet.disabled;
      stylesheet.disabled = true;
      return {
        stylesheet,
        oldDisabled
      } as EmporniumStyleSheet;
    });
}

function enableEmporniumStyleSheets(originalStyleSheets: EmporniumStyleSheet[]) {
  originalStyleSheets.forEach((styleSheet) => {
    styleSheet.stylesheet.disabled = styleSheet.oldDisabled;
  });
}

function cleanStyle(element: HTMLElement) {
  const oldStyle = element.getAttribute('style');
  if (oldStyle) {
    element.setAttribute('style', '');
  }
  return oldStyle;
}

function restoreStyle(element: HTMLElement, oldStyle: string | null) {
  if (oldStyle === null) return;
  element.setAttribute('style', oldStyle);
}

type EmporniumResources = {
  elements: EmporniumElement[];
  styleSheets: EmporniumStyleSheet[];
  htmlStyle: string | null;
  bodyStyle: string | null;
};

function defaultEmporniumResources(): EmporniumResources {
  return {
    elements: [],
    styleSheets: [],
    htmlStyle: null,
    bodyStyle: null
  };
}

function createEmporniumStore() {
  const emporniumStore = writable<EmporniumResources>(defaultEmporniumResources());

  return {
    clean: () =>
      emporniumStore.set({
        elements: hideEmporniumElements(),
        styleSheets: disableEmporniumStyleSheets(),
        htmlStyle: cleanStyle(document.documentElement),
        bodyStyle: cleanStyle(document.body)
      }),
    restore: () =>
      emporniumStore.update((emporniumResources) => {
        showEmporniumElements(emporniumResources.elements);
        enableEmporniumStyleSheets(emporniumResources.styleSheets);
        restoreStyle(document.documentElement, emporniumResources.htmlStyle);
        restoreStyle(document.body, emporniumResources.bodyStyle);
        return defaultEmporniumResources();
      })
  };
}

export const empornium = createEmporniumStore();
