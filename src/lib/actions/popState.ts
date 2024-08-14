import type { Action } from 'svelte/action';
import { page } from '$stores/page';

export const listenToPopState: Action = () => {
  const removeListener = page.setUpPopstateListener();
  return {
    destroy() {
      removeListener();
    }
  };
};
