import { writable, get } from 'svelte/store';
import { getTorrents } from '$gather/torrents';
import { type Torrent } from '$lib/torrent';
import { type Search, getSearch } from '$gather/search';
import { type Pagination, getPagination } from '$gather/pagination';
import { getMe, type Me } from '$gather/me';
import { getLatestForumPosts, type LatestForumPost } from '../gather/latestForumPosts';
import { getEmporiumNavigation, type EmporniumNavigation } from '../gather/emporniumNavigation';
import { fetchPage } from '$api/page';
import { settings } from '$stores/settings';
import { cloneFormData } from '../util';

const domParser = new DOMParser();

export type Page<T extends PageData> = {
  // need type to be able to narrow with type guards
  type: PageType;
  dataPromise: Promise<T>;

  /**
   * The last scroll position of the page. This is used to restore the scroll.
   *
   * @todo because of the layout shift during image load (i.e. images of
   * variable size going from height 0 to full height), this is hard to get
   * right. for now, we should just scroll to the top of the page.
   */
  scrollY: number;
};

export enum PageType {
  Search,
  Torrent,
  Unsupported
}

export interface PageData {}

export interface UnsupportedPageData extends PageData {}

function makeUnsupportedPageData(): UnsupportedPageData {
  return { type: PageType.Unsupported };
}

export function isUnsupportedPage(page: Page<PageData>): page is Page<UnsupportedPageData> {
  return page.type === PageType.Unsupported;
}

interface SupportedPageData extends PageData {
  me: Me;
  navigation: EmporniumNavigation;
}

export function isSupportedPage(page: Page<PageData>): page is Page<SupportedPageData> {
  return page.type !== PageType.Unsupported;
}

export interface TorrentPageData extends SupportedPageData {
  // TBD. we may later want to start injecting into torrent detail pages
  //
  // title: string;
  // imageUrl: string;
  // etc...
  type: PageType.Torrent;
}

function makeTorrentPageData(doc: Document): TorrentPageData {
  return { type: PageType.Torrent, me: getMe(doc), navigation: getEmporiumNavigation(doc) };
}

function makeTorrentUrl(id: number): string {
  return `/torrents.php?id=${id}`;
}

export function isTorrentPage(page: Page<PageData>): page is Page<TorrentPageData> {
  return page.type === PageType.Torrent;
}

export interface SearchPageData extends SupportedPageData {
  type: PageType.Search;
  torrents: Torrent[];
  search: Search;
  pagination: Pagination;
  latestForumPosts: LatestForumPost[];
}

function makeSearchPageData(doc: Document): SearchPageData {
  const searchForm = getSearch(doc);
  return {
    type: PageType.Search,
    torrents: getTorrents(doc),
    search: searchForm,
    pagination: getPagination(doc),
    latestForumPosts: getLatestForumPosts(doc),
    navigation: getEmporiumNavigation(doc),
    me: getMe(doc)
  };
}

function urlFromFormData(formData: FormData, href?: string | URL): string {
  const url = new URL(href ?? window.location.href);
  for (const [key, value] of formData.entries()) {
    if (!(typeof value === 'string')) {
      continue;
    }
    url.searchParams.set(key, value as string);
  }
  return url.toString();
}

export function getSearchUrlOfFormData(formData: FormData) {
  return urlFromFormData(formData, new URL('/torrents.php', window.location.href));
}

export function isSearchPage(page: Page<PageData>): page is Page<SearchPageData> {
  return page.type === PageType.Search;
}

export function determinePageType(href: string = window.location.href): PageType {
  let u = new URL(href, window.location.href);
  if (u.host === window.location.host) {
    if (u.pathname === '/torrents.php') {
      const action = u.searchParams.get('action');
      if (action === 'advanced' || (!action && !u.searchParams.has('id'))) {
        return PageType.Search;
      }
      // uncomment this when we actually start supporting torrent detail pages
      // else if (u.searchParams.has('id')) {
      //   return PageType.Torrent;
      // }
    }
  }
  return PageType.Unsupported;
}

function getPageData(doc: Document, type: PageType): PageData {
  // allow undefined type to be passed in for when we already know the type, but
  // we can always figure it out from the url.
  switch (type) {
    case PageType.Search:
      return makeSearchPageData(doc);
    case PageType.Torrent:
      return makeTorrentPageData(doc);
    case PageType.Unsupported:
      return makeUnsupportedPageData();
  }
}

async function navigate(url: string, isBack: boolean = false): Promise<PageData> {
  if (!isBack) {
    pushHistory(url);
  }
  const response = await fetchPage(url);
  const text = await response.text();

  const doc = domParser.parseFromString(text, 'text/html');
  const pageType = determinePageType(url);

  return getPageData(doc, pageType);
}

type HistoryState = {
  scrollY: number;
};

function pushHistory(url: string) {
  // push new
  history.pushState({ scrollY: window.screenY } as HistoryState, '', url);
}

function createPageStore() {
  const initialType = determinePageType();
  const store = writable<Page<PageData>>(
    // when this store is created, page data is available immediately (without
    // an async network request), so we initialize with an already-resolved
    // promise.
    {
      type: initialType,
      dataPromise: Promise.resolve(getPageData(document, initialType)),
      scrollY: 0
    }
  );
  const { subscribe, set } = store;

  /**
   * Set the store if we're an SPA. Otherwise, navigate to the given URL.
   * 
   * @todo do we really need this? if we're non-spa, we should just be using
   * <a href>'s (browser delegation), not setting state through the store.
   *
   * @param pageFn A function that returns a page object. The return is exactly
   * what you'd pass to `set`. It's a function because we don't want to evalute
   * the value until we know we need it.
   *
   * @param url The URL to navigate to if we're not in SPA mode.
   */
  function setIfSpa(pageFn: () => Page<PageData>, url: string) {
    if (get(settings).spaMode) {
      set(pageFn());
    } else {
      window.location.href = url;
    }
  }

  const originalDomUrl = window.location.href;

  function isDomDirty() {
    return window.location.href !== originalDomUrl;
  }

  // on initial load, place our state. this is what SPAs do. If we didn't do
  // this, navigating back to this page wouldn't have any state attached to it.
  history.replaceState({ lastScrollY: 0 }, '');

  function setUpPopstateListener() {
    const popstateListener = (e: PopStateEvent) => {
      const scrollY = (e.state as HistoryState).scrollY;

      setIfSpa(
        () => ({
          type: determinePageType(window.location.href),
          dataPromise: navigate(window.location.href, true),
          scrollY
        }),
        window.location.href
      );
    };

    window.addEventListener('popstate', popstateListener);
    return () => window.removeEventListener('popstate', popstateListener);
  }
  setUpPopstateListener();

  return {
    subscribe,

    /**
     * Navigate to a search page with the given form data.
     *
     * @param formData A FormData object or `undefined`. If `undefined`, the
     * existing search form data will be used, if it is available (or error).
     * This undefined-ness is useful for when we're already on a search page and
     * want to navigate to a new page with the otherwise same search form data.
     *
     * @param pageNumber An optional page number to navigate to. Defaults to 1.
     */
    navigateToSearch: async (formData?: FormData, pageNumber: number = 1) => {
      // while you could argue that we use the store's update(updaterFn) function here to
      // get the formData, updaterFn can't be async, and we need to await the
      // dataPromise to get it.
      if (!formData) {
        const cur = get(store);
        if (!isSearchPage(cur)) {
          throw new Error('formData should be provided if not on a search page');
        }
        formData = (await cur.dataPromise).search.formData;
      }

      // the formData we get passed in is by reference, which means that if we
      // mutate it (to change the page), it affects everyone else who has a
      // reference to it. So we clone it to avoid that.
      let newFormData = cloneFormData(formData);
      if (pageNumber !== 1) {
        newFormData.set('page', pageNumber.toString());
      }

      const url = getSearchUrlOfFormData(newFormData);

      setIfSpa(
        () => ({
          type: PageType.Search,
          dataPromise: navigate(url),
          scrollY: 0
        }),
        url
      );
    },
    navigateToTorrent: (id: number) => {
      // TDB, but something like this
      const url = makeTorrentUrl(id);

      setIfSpa(
        () => ({
          type: PageType.Torrent,
          dataPromise: navigate(url),
          scrollY: 0
        }),
        url
      );
    },
    isDomDirty,
    setUpPopstateListener
  };
}

export const page = createPageStore();
