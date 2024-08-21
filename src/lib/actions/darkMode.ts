import type { Action } from 'svelte/action';
import { settings } from '$stores/settings';

export const darkMode: Action = () => {
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
