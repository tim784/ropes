import { writable, get, derived, type Readable } from 'svelte/store';
import { fetchPage } from '$api/page';
import { getMe, type Me } from '$gather/me';
import { getLatestForumPosts, type LatestForumPost } from '../gather/latestForumPosts';
import { getEmporiumNavigation, type EmporniumNavigation } from '../gather/emporniumNavigation';
import { type Torrent } from '$lib/torrent';
import { type SearchForm, getSearchForm } from '$gather/searchForm';
import { type Pagination, getPagination } from '$gather/pagination';
import { getTorrents } from '$gather/torrents';

const domParser = new DOMParser();

export type PageData = {
  url: string;
  doc: Document;
  isLoading: boolean;
  isDirty: boolean;
};

export function createPageDataStore() {
  const originalUrl = window.location.href;
  const store = writable<PageData>({
    url: originalUrl,
    doc: document,
    isLoading: false,
    isDirty: false
  });
  const { subscribe, set, update } = store;

  history.replaceState({}, '', originalUrl);

  async function navigate(url: string, isBack: boolean = false) {
    update((page) => ({
      ...page,
      isLoading: true
    }));

    const response = await fetchPage(url);
    const text = await response.text();
    const doc = domParser.parseFromString(text, 'text/html');
    const isDirty = url !== originalUrl;

    if (!isBack) {
      history.pushState({}, '', url);
    }

    set({
      url,
      doc,
      isLoading: false,
      isDirty
    });
  }

  return {
    subscribe,
    navigate
  };
}

export type PageDataStore = ReturnType<typeof createPageDataStore>;

// base data that is common to all pages (i.e., if we do a TorrentData type, it
// would share these properties)
//
// we keep this out of PageData because it's a different layer of abstraction:
// PageData is about, like, the browser definition of a page, while BaseData is
// scraped from the page's contents.
type BaseData = {
  me: Me;
  navigation: EmporniumNavigation;
};

export function createBaseDataStore(
  pageStore: ReturnType<typeof createPageDataStore>
): Readable<BaseData> {
  function fromPage(page: PageData): BaseData {
    return {
      me: getMe(page.doc),
      navigation: getEmporiumNavigation(page.doc)
    };
  }

  return derived(pageStore, fromPage, fromPage(get(pageStore)));
}

export type BaseDataStore = ReturnType<typeof createBaseDataStore>;

export type SearchData = {
  torrents: Torrent[];
  searchForm: SearchForm;
  pagination: Pagination;
  latestForumPosts: LatestForumPost[];
};

export function createSearchPageStore(
  pageStore: ReturnType<typeof createPageDataStore>
): Readable<SearchData> {
  function fromPage(page: PageData): SearchData {
    return {
      torrents: getTorrents(page.doc),
      searchForm: getSearchForm(page.doc),
      pagination: getPagination(page.doc),
      latestForumPosts: getLatestForumPosts(page.doc)
    };
  }

  return derived(pageStore, fromPage, fromPage(get(pageStore)));
}

export type SearchDataStore = ReturnType<typeof createSearchPageStore>;
