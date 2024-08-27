import { writable } from 'svelte/store';
import { isSearchPage, page, getSearchUrlOfFormData } from '$stores/page';
import { TaglistTag } from '../tag';
import {
  SORT_CRITERIA_NAME,
  SORT_ORDER_NAME,
  TAGLIST_NAME,
  SET_DEFAULT_NAME
} from '../gather/search';

export type LocalFormData = {
  d: FormData;
  submit: () => void;
  getUrl: () => string;
};

function makeLocalFormData(formData: FormData): LocalFormData {
  return {
    d: formData,
    submit: () => page.navigateToSearch(formData),
    getUrl: () => getSearchUrlOfFormData(formData)
  };
}

/**
 * Create a store for local search form data. This is different than
 * $page.dataPromise.searchForm, which does not change. This store, however, is
 * updated by local user interactions with the displayed search form.
 *
 * @returns a writable store for local search form data
 */
function createLocalFormDataStore() {
  const store = writable(makeLocalFormData(new FormData()));
  const { subscribe, set, update } = store;

  // always get values from the page store
  page.subscribe((p) => {
    if (isSearchPage(p)) {
      p.dataPromise.then((data) => {
        set(makeLocalFormData(data.search.formData));
      });
    }
  });

  /** This will error if syntax is valid, so only call from paths that ensure it. */
  function getTags(taglist: string) {
    return TaglistTag.validateSyntax(taglist);
  }

  function addTag(tag: TaglistTag) {
    update((localFormData) => {
      const taglist = localFormData.d.get(TAGLIST_NAME);
      if (taglist) {
        localFormData.d.set(TAGLIST_NAME, `${taglist} ${tag.toString()}`);
      } else {
        localFormData.d.set(TAGLIST_NAME, tag.toString());
      }
      return makeLocalFormData(localFormData.d);
    });
  }

  function negateTag(tag: TaglistTag) {
    const tagName = tag.name;
    update((localFormData) => {
      const tags = getTags((localFormData.d.get(TAGLIST_NAME) as string) ?? '');

      const index = tags.findIndex((t) => t.name === tagName);

      if (index !== -1) {
        tags[index] = tags[index].negate();
      }

      localFormData.d.set(TAGLIST_NAME, TaglistTag.toTaglist(tags));
      return makeLocalFormData(localFormData.d);
    });
  }

  function deleteTag(tag: TaglistTag) {
    update((localFormData) => {
      const tags = getTags((localFormData.d.get(TAGLIST_NAME) as string) ?? '');
      const without = tags.filter((t) => !t.equals(tag));
      localFormData.d.set(TAGLIST_NAME, TaglistTag.toTaglist(without));
      return makeLocalFormData(localFormData.d);
    });
  }

  function setTaglist(taglist: string) {
    update((localFormData) => {
      localFormData.d.set(TAGLIST_NAME, taglist);
      return makeLocalFormData(localFormData.d);
    });
  }

  function clearTags() {
    update((localFormData) => {
      // Empornium eccentricity:
      // - If the taglist query param is not present, the default search is used
      // - If present but empty, a blank search is used
      // - If present and not empty, the taglist is used
      localFormData.d.set(TAGLIST_NAME, '');
      return makeLocalFormData(localFormData.d);
    });
  }

  function clearAll() {
    const formData = new FormData();
    // ditto on taglist comment in clearTags
    formData.set(TAGLIST_NAME, '');
    set(makeLocalFormData(formData));
  }

  function setSortCriteria(sortCriteria: string) {
    update((localFormData) => {
      localFormData.d.set(SORT_CRITERIA_NAME, sortCriteria);
      return makeLocalFormData(localFormData.d);
    });
  }

  function setSortOrder(sortOrder: string) {
    update((localFormData) => {
      localFormData.d.set(SORT_ORDER_NAME, sortOrder);
      return makeLocalFormData(localFormData.d);
    });
  }

  function setMakeDefaultSearch(on: boolean) {
    update((localFormData) => {
      if (on) {
        localFormData.d.set(SET_DEFAULT_NAME, 'Make Default');
      } else {
        localFormData.d.delete(SET_DEFAULT_NAME);
      }
      return makeLocalFormData(localFormData.d);
    });
  }

  return {
    subscribe,
    set,
    update,
    addTag,
    setTaglist,
    negateTag,
    deleteTag,
    clearTags,
    setSortCriteria,
    setSortOrder,
    setMakeDefaultSearch,
    clearAll
  };
}

export const localFormData = createLocalFormDataStore();
