import type { Action } from 'svelte/action';
import { portal } from '$stores/portal';
import { get } from 'svelte/store';

export const addPortal: Action = (node) => {
  node.appendChild(get(portal));

  return {
    destroy() {}
  };
};
