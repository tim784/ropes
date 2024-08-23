import type { Action } from 'svelte/action';
import { settings } from '$stores/settings';

export const darkMode: Action = (node) => {
  const unsubscribe = settings.subscribe((value) => {
    if (value.darkMode) {
      node.classList.add('dark');
    } else {
      node.classList.remove('dark');
    }
  });

  return {
    destroy() {
      node.classList.remove('dark');
      unsubscribe();
    }
  };
};
