import type { Action } from 'svelte/action';
import { settings } from '$stores/settings';

// TOOD: popovers aren't affected 
export const darkMode: Action = (node) => {
  const unsubscribe = settings.subscribe((value) => {
    if (value.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  });

  return {
    destroy() {
      document.body.classList.remove('dark');
      unsubscribe();
    }
  };
};
