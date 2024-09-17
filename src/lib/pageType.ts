export enum PageType {
  Search
  // Torrent,
}

export function determinePageType(href: string = window.location.href): PageType | null {
  let u = new URL(href, window.location.href);
  if (u.host === window.location.host) {
    if (u.pathname === '/torrents.php') {
      const action = u.searchParams.get('action');
      if (action === 'advanced' || (!action && !u.searchParams.has('id'))) {
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
