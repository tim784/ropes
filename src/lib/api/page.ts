import { safeFetch } from './util';

/**
 * Fetch a page with a GET request to the given URL.
 *
 * @param url The URL to fetch
 *
 * @returns A promise that resolves to the response of the fetch
 */
export async function fetchPage(url: string) {
  return await safeFetch(
    url,
    {
      credentials: 'same-origin'
    },
    `fetching page`
  );
}
