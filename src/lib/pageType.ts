export enum PageType {
  Search
  // Torrent,
}

export function determinePageType(href: string | URL = window.location.href): PageType | null {
  const url = new URL(href, window.location.origin);
  if (url.host === window.location.host) {
    if (url.pathname === '/torrents.php') {
      const action = url.searchParams.get('action');
      if (action === 'advanced' || (!action && !url.searchParams.has('id'))) {
        return PageType.Search;
      }
      // uncomment this if/when we actually start supporting torrent detail pages
      // else if (u.searchParams.has('id')) {
      //   return PageType.Torrent;
      // }
    }
  }
  return null;
}

export function isSupportedPageType(href?: string): boolean {
  return determinePageType(href) !== null;
}
