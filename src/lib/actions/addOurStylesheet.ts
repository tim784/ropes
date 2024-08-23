import type { Action } from 'svelte/action';
import stylesheetContent from '$src/app.css?inline'


export const addOurStylesheet: Action = (node) => {
  const style = document.createElement('style');
  style.textContent = stylesheetContent;
  node.appendChild(style);

  return {
    destroy() {
      style.remove();
    }
  };
};
