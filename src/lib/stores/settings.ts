import { makeAppIdentifier } from '$lib/constants';
import { localStorageBacked } from './localStorageBacked';

export type Theme =
  | 'blue'
  // | 'gray'
  | 'green'
  // | 'neutral'
  | 'orange'
  | 'red'
  | 'rose'
  // | 'slate'
  // | 'stone'
  | 'violet'
  | 'yellow'
  | 'zinc';

export type Settings = {
  sfwMode: boolean;
  preferRichTagMode: boolean;
  openNonRopesInNewTab: boolean;
  showLatestForumThreads: boolean;
  darkMode: boolean;
  spaMode: boolean;
  theme: Theme;
};

const watchMedia = window.matchMedia('(prefers-color-scheme: dark)');

function defaultSettings(): Settings {
  return {
    sfwMode: false,
    preferRichTagMode: true,
    openNonRopesInNewTab: true,
    showLatestForumThreads: true,
    darkMode: watchMedia.matches,
    spaMode: true,
    theme: 'zinc'
  };
}

const key = makeAppIdentifier('settings');

function createSettingsStore() {
  const settings = localStorageBacked<Settings>(key, defaultSettings, JSON.stringify, (str) => ({
    ...defaultSettings(),
    ...JSON.parse(str)
  }));

  // update dark mode setting when the user changes their system preference
  watchMedia.addEventListener('change', (e) => {
    settings.update((s) => ({ ...s, darkMode: e.matches }));
  });

  return settings;
}

export const settings = createSettingsStore();
