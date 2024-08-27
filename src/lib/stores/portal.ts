import { writable } from 'svelte/store';
import { makeAppIdentifier } from '$lib/constants';

function createDivPortal() {
  const portal = document.createElement('div');
  portal.id = makeAppIdentifier('portal');
  return portal;
}

/**
 * Store for the portal element. This element won't be in the DOM until Ropes is
 * mounted/enabled. But, we need this element to still exist because other
 * components that use it (e.g., modals, popovers, dropdowns, etc from
 * shadcn-svelte) will mount their content onto the body if this isn't
 * available, and the body won't have styling -- only our app element does.
 */
export const portal = writable<HTMLDivElement>(createDivPortal());
