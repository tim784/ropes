import type { Action } from 'svelte/action';
import { appId } from '$lib/constants';
import { page } from '$stores/page';

function isNotOurs(element: Element) {
  return element.closest(`#${appId}`) === null;
}

type HiddenElement = {
  element: HTMLElement;
  oldDisplayValue: string;
};

function getOtherElements() {
  return [...document.querySelectorAll(`body > *`)]
    .filter((element) => element instanceof HTMLElement)
    .filter(isNotOurs);
}

function hideElement(element: HTMLElement) {
  const oldDisplay = element.style.display;

  element.style.display = 'none';

  return {
    element,
    oldDisplayValue: oldDisplay
  };
}

type DisabledStylesheet = {
  styleSheet: StyleSheet;
  oldDisabled: boolean;
};

// svelte components inject their styles (from their the top-level <style> tag)
// into the <head> with an id that's prefixed with 'svelte'. we don't want to
// disable these stylesheets. (it stinks that svelte doesn't give us more
// control over where/how these get injected)
function isNotSvelteIdPrefixed(element: Element) {
  return !element.id.startsWith('svelte');
}

function getOtherStyleSheets() {
  return [...document.styleSheets].filter((styleSheet) => {
    const ownerNode = styleSheet.ownerNode;
    if (ownerNode == null || ownerNode instanceof ProcessingInstruction) {
      return false;
    }
    return isNotSvelteIdPrefixed(ownerNode) && isNotOurs(ownerNode);
  });
}

function disableStyleSheet(styleSheet: StyleSheet) {
  const oldDisabled = styleSheet.disabled;

  styleSheet.disabled = true;

  return {
    styleSheet,
    oldDisabled
  };
}

type ClearedStyleElement = {
  element: HTMLElement;
  oldStyle: string;
};

function clearElementStyle(element: HTMLElement) {
  const oldStyle = element.getAttribute('style');

  element.setAttribute('style', '');

  return {
    element,
    oldStyle
  } as ClearedStyleElement;
}

export const cleanseEmpornium: Action = () => {
  const elements: HiddenElement[] = getOtherElements().map(hideElement);
  const styleSheets: DisabledStylesheet[] = getOtherStyleSheets().map(disableStyleSheet);
  const rootStyleElement = clearElementStyle(document.documentElement);
  const bodyStyleElement = clearElementStyle(document.body);

  // wait a little bit, then redo this. some other userscripts may be loaded
  // after us. this is probaly brittle and race-condition-y
  setTimeout(() => {
    const newElements = getOtherElements().filter(
      (element) => !elements.some(({ element: oldElement }) => element === oldElement)
    );
    elements.push(...newElements.map(hideElement));

    const newStyleSheets = getOtherStyleSheets().filter(
      (styleSheet) =>
        !styleSheets.some(({ styleSheet: oldStyleSheet }) => styleSheet === oldStyleSheet)
    );
    styleSheets.push(...newStyleSheets.map(disableStyleSheet));

    rootStyleElement.oldStyle += document.documentElement.getAttribute('style') || '';
    bodyStyleElement.oldStyle += document.body.getAttribute('style') || '';
  }, 100);

  return {
    destroy() {
      if (page.isDomDirty()) {
        location.reload();
      } else {
        elements.forEach(({ element, oldDisplayValue }) => {
          element.style.display = oldDisplayValue;
        });
        styleSheets.forEach(({ styleSheet, oldDisabled }) => {
          styleSheet.disabled = oldDisabled;
        });
        rootStyleElement.element.setAttribute('style', rootStyleElement.oldStyle);
        bodyStyleElement.element.setAttribute('style', bodyStyleElement.oldStyle);
      }
    }
  };
};
