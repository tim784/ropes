import type { Action } from 'svelte/action';
import { appId } from '$lib/constants';
import { page } from '$stores/page';

function isNotOurs(element: HTMLElement) {
  return element.closest(`#${appId}`) === null;
}

type HiddenElement = {
  element: HTMLElement;
  oldDisplayValue: string;
};

export const hideEmporniumElements: Action = () => {
  let hidden: HiddenElement[] = [...document.querySelectorAll(`body > *`)]
    .filter((element) => element instanceof HTMLElement)
    .filter(isNotOurs)
    .map((element) => {
      const oldDisplay = element.style.display;

      element.style.display = 'none';

      return {
        element,
        oldDisplayValue: oldDisplay
      };
    });

  return {
    destroy() {
      if (page.isDomDirty()) {
        location.reload();
      } else {
        hidden.forEach(({ element, oldDisplayValue: oldDisplay }) => {
          element.style.display = oldDisplay;
        });
      }
    }
  };
};
