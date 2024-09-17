import { writable } from 'svelte/store';
import {
  SORT_CRITERIA_NAME,
  SORT_ORDER_NAME,
  TAGLIST_NAME,
  SET_DEFAULT_NAME
} from '$gather/searchForm';

// these are the only keys we support provide controls on the form for
// currently. ignore the others.
const keepKeys = [SORT_CRITERIA_NAME, SORT_ORDER_NAME, TAGLIST_NAME, SET_DEFAULT_NAME];

function formDataFromUrl(initialUrl: string) {
  const formData = new FormData();
  for (const [key, value] of new URL(initialUrl).searchParams.entries()) {
    if (keepKeys.includes(key)) {
      formData.set(key, value);
    }
  }
  return formData;
}

export function urlFromFormData(formData: FormData): string {
  const url = new URL('/torrents.php', window.location.origin);
  for (const [key, value] of formData.entries()) {
    if (!(typeof value === 'string')) {
      continue;
    }
    url.searchParams.set(key, value as string);
  }
  return url.toString();
}

export function createLocalFormDataStore(initialUrl: string, searchFormTaglistValue: string) {
  const initialFormData = formDataFromUrl(initialUrl);

  // emp does something surprising with taglist:
  //
  // - if the taglist key is present in the query params, those are the tags
  //   (even if empty)
  //
  // - if not present in the query params, the taglist is the user's default
  //   tags
  if (!initialFormData.has(TAGLIST_NAME)) {
    initialFormData.set(TAGLIST_NAME, searchFormTaglistValue);
  }

  const store = writable(initialFormData);

  return store;
}

export type LocalFormDataStore = ReturnType<typeof createLocalFormDataStore>;
