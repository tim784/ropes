import type { Action } from 'svelte/action';
import { empornium } from '$stores/empornium';
import { page } from '$stores/page';


export const cleanSlate: Action = () => {
  empornium.clean();

  return {
    destroy() {
      if (page.isDomDirty()) {
        // reload the page because the old dom doesn't reflect current content.
        location.reload();
      } else {
        empornium.restore();
      }
    }
  };
};
