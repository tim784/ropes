import type { Action } from 'svelte/action';
import { settings, type Theme } from '$stores/settings';

const themePrefix = 'theme-';

function themeClass(theme: string) {
  return `${themePrefix}${theme}`;
}

function removeTheme() {
  document.body.classList.forEach((className) => {
    if (className.startsWith(themePrefix)) {
      document.body.classList.remove(className);
    }
  });
}

function setTheme(theme: Theme) {
  removeTheme();
  document.body.classList.add(themeClass(theme));
}

export const theme: Action = () => {
  const unsubscribe = settings.subscribe((value) => {
    setTheme(value.theme);
  });

  return {
    destroy() {
      removeTheme();
      unsubscribe();
    }
  };
};
