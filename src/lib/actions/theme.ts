import type { Action } from 'svelte/action';
import { settings, type Theme } from '$stores/settings';

const themePrefix = 'theme-';

function themeClass(theme: string) {
  return `${themePrefix}${theme}`;
}

function removeTheme(node: HTMLElement) {
  node.classList.forEach((className) => {
    if (className.startsWith(themePrefix)) {
      node.classList.remove(className);
    }
  });
}

function setTheme(theme: Theme, node: HTMLElement) {
  removeTheme(node);
  node.classList.add(themeClass(theme));
}

export const theme: Action = (node) => {
  const unsubscribe = settings.subscribe((value) => {
    setTheme(value.theme, node);
  });

  return {
    destroy() {
      removeTheme(node);
      unsubscribe();
    }
  };
};
