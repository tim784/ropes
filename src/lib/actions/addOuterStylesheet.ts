import type { Action } from 'svelte/action';
import { makeAppIdentifier } from '$lib/constants';
import stylesheetContent from '$src/outer.css?inline';

export const addOuterStylesheet: Action = () => {
  const outerStyle = document.createElement('style');
  outerStyle.textContent = stylesheetContent;
  outerStyle.id = makeAppIdentifier('outer-style');
  document.head.appendChild(outerStyle);

  return {
    destroy() {
      outerStyle.remove();
    }
  };
};
