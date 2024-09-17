import { querySelector, removeNonNumericChars } from './util';

export type ResultRange = {
  start: number;
  end: number;
};

export type Pagination = {
  /**
   * The number of results on a full (normal) page
   */
  resultsPerPage: number;

  /**
   * The number of results on the current page, which may be less than the
   * number of results on a full page if this is the last page.
   */
  resultsOnThisPage: number;

  /**
   * The range of results on the current page, as a tuple of [start, end]
   */
  thisPageRange: ResultRange;

  /**
   * The current page number
   */
  currentPage: number;

  /**
   * The total number of pages
   */
  totalPages: number;

  /**
   * The total number of results
   */
  totalResultCount: number;
};

function getPageFromUrl(url: string): number {
  const urlObj = new URL(url, window.location.href);
  const search = urlObj.searchParams;
  const page = parseInt(search.get('page') || '1');
  return page;
}

// strange that this is placed in the search form, but whateva
function getResultCount(doc: Document) {
  const text = querySelector('.numsearchresults span', doc)!.textContent!;
  const resultCountString = text.split(' ')[0];
  const resultCount = Number(removeNonNumericChars(resultCountString));
  return resultCount;
}

// matches 1-100, for example
//
// we match against commas too to be safe, even though the site doesn't appear
// to use them.
const resultsOnThisPagePattern = /(?<start>[0-9,]+)-(?<end>[0-9,]+)/;

function getPageResultRange(pagerText: string): ResultRange {
  const match = pagerText.match(resultsOnThisPagePattern);
  if (!match) {
    throw new Error(`Could not parse pager text: ${pagerText}`);
  }
  const start = parseInt(removeNonNumericChars(match.groups!.start));
  const end = parseInt(removeNonNumericChars(match.groups!.end));
  return { start, end };
}

function resultsInRange(resultRange: ResultRange): number {
  return resultRange.end - resultRange.start + 1;
}

export function getPagination(doc: Document): Pagination {
  /*
  cases:

  - 0 results: .linkbox.pager has no children
  
    {
      resultsPerPage: 0,
      resultsOnThisPage: 0,
      totalResultCount: 0
      currentPage: 1,
      totalPages: 1,
    }

   - 1 page of results: .linkbox.pager has no children, but resultCount > 0

     {
       resultsPerPage: resultCount,
       resultsOnThisPage: resultCount,
       totalResultCount: resultCount
       currentPage: 1,
       totalPages: 1,
     }

   - otherwise: .linkbox.pager exists, and has children

     {
       resultsPerPage: resultCount,
       resultsOnThisPage: resultsOnThisPage,
       totalResultCount: resultCount
       currentPage: currentPage,
       totalPages: totalPages,
     }
  */
  const totalResultCount = getResultCount(doc);

  const pagerElement = querySelector('.linkbox.pager', doc)!;
  const hasChildNodes = pagerElement.hasChildNodes();
  if (!hasChildNodes) {
    return {
      resultsPerPage: totalResultCount,
      resultsOnThisPage: totalResultCount,
      totalResultCount: totalResultCount,
      thisPageRange: { start: totalResultCount === 0 ? 0 : 1, end: totalResultCount },
      currentPage: 1,
      totalPages: 1
    };
  }

  const rangeOnThisPage = getPageResultRange(
    querySelector('.pager.pager_on', pagerElement)!.textContent!
  );
  const resultsOnThisPage = resultsInRange(rangeOnThisPage);
  const rangeOnOtherPage = getPageResultRange(
    querySelector('.pager.pager_page', pagerElement)!.textContent!
  );
  const resultsPerPage = Math.max(resultsOnThisPage, resultsInRange(rangeOnOtherPage));

  // currentPage: can be got a couple of ways, but the simplest seems to be
  // looking at one of the torrent table's sort button URLs. it's a query
  // param named `page`, or 1 if it's not there
  const sortableTableHeadingElement = querySelector(
    '.colhead > td:nth-child(5) > a:nth-child(1)',
    doc
  );
  const href = sortableTableHeadingElement?.getAttribute('href');
  const currentPage = getPageFromUrl(href!);

  // totalPages: ditto, but on the link of .pager_last. if there is no .pager_last,
  // then its the same as currentPage
  const lastPageElement = querySelector('.pager_last', doc);
  const totalPages = lastPageElement
    ? getPageFromUrl(lastPageElement.getAttribute('href')!)
    : currentPage;

  return {
    resultsPerPage,
    resultsOnThisPage,
    thisPageRange: rangeOnThisPage,
    currentPage,
    totalPages,
    totalResultCount
  };
}
