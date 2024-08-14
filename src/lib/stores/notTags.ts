/**
 * When swapping between from manual to rich tag mode, we validate the tags the
 * user may have free-entered. To prevent doing too much work on patholigical
 * mode switches, we cache tags we've already tried in this NotTagsStore.
 *
 * Because this is an in-memory store, its lifetime is the life of the app
 * (i.e. page reloads will clear it). This is by-design. We don't want to assume that
 * "foobarlicious" will never be a tag in the future. This is in contrast to
 * say, backing with localStorage, where the lifetime becomes the life of the
 * cache key (until cleared...etc).
 *
 * So, that is the compromise: we don't want to (possibly) redo work when
 * switching between tag modes, but will (possibly) redo it on total page
 * reloads.
 */
import { writable } from 'svelte/store';


function createNotTagsStore() {
  const store = writable(new Set<string>());

  return { ...store, clear: () => store.set(new Set()) };
}

export const notTags = createNotTagsStore();
