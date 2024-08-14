import type { Action } from 'svelte/action';
import stylesheet from '$src/app.css?inline';
import { empornium } from '$stores/empornium';
import { page } from '$stores/page';

function insertStyleSheet(contents: string) {
  const style = document.createElement('style');
  style.textContent = contents;
  document.body.appendChild(style);
  return style;
}

export const cleanSlate: Action = () => {
  empornium.clear();

  // this must come after clear
  let styleSheetElement: HTMLStyleElement = insertStyleSheet(stylesheet);

  return {
    destroy() {
      if (page.isDomDirty()) {
        // reload the page because the old dom doesn't reflect current content.
        location.reload();
      } else {
        styleSheetElement.remove();
        empornium.restore();
      }
    }
  };
};
