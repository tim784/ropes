import { querySelector, removeNonNumericChars } from './util';

export type Pagination = {
  currentPage: number;
  totalPages: number;
  resultCount: number;
};

function getPageFromUrl(url: string): number {
  const urlObj = new URL(url, window.location.href);
  const search = urlObj.searchParams;
  const page = parseInt(search.get('page') || '1');
  return page;
}

// strange that this is placed in the search form, but whateva
function getResultCount(doc: Document) {
  let text = querySelector('.numsearchresults span', doc)!.textContent!;
  let resultCountString = text.split(' ')[0];
  let resultCount = Number(removeNonNumericChars(resultCountString));
  return resultCount;
}

export function getPagination(doc: Document): Pagination {
  // cases:
  // 1. 0 or at most 1 page of results: .pager has no child elements, therefore
  //    currentPage = 1, totalPages = 1
  //
  // 2. otherwise:
  //
  //    currentPage: can be got a couple of ways, but the simplest seems to be
  //    looking at one of the torrent table's sort button URLs. it's a query
  //    param named `page`, or 1 if it's not there
  //
  //    totalPages: ditto, but on the link of .pager_last. if there is no .pager_last,
  //    then its the same as currentPage
  const resultCount = getResultCount(doc);

  const pagerElement = querySelector('.linkbox.pager', doc);
  const hasChildNodes = pagerElement?.hasChildNodes();
  if (!hasChildNodes) {
    return {
      currentPage: 1,
      totalPages: 1,
      resultCount
    };
  }

  const sortableTableHeadingElement = querySelector(
    '.colhead > td:nth-child(5) > a:nth-child(1)',
    doc
  );
  const href = sortableTableHeadingElement?.getAttribute('href')!;
  const currentPage = getPageFromUrl(href);

  const lastPageElement = querySelector('.pager_last', doc);
  const totalPages = lastPageElement
    ? getPageFromUrl(lastPageElement.getAttribute('href')!)
    : currentPage;

  return {
    currentPage,
    totalPages,
    resultCount
  };
}
