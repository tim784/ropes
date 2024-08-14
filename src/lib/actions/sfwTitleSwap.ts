import type { Action } from 'svelte/action';
import { settings } from '$stores/settings';
import { appTitle } from '$lib/constants';
import { sfwAppSubtitle } from '$lib/sfwMode';

const sfwTitle = `${appTitle} - ${sfwAppSubtitle}`;

export const sfwTitleSwap: Action = () => {
  const originalTitle = document.title;

  const unsubscribe = settings.subscribe((value) => {
    if (value.sfwMode) {
      document.title = sfwTitle;
    } else {
      document.title = originalTitle;
    }
  });

  return {
    destroy() {
      unsubscribe();
    }
  };
};
