import { toasts } from '$stores/toasts';
import ErrorToast from '$components/toasts/ErrorToast.svelte';

class HTTPError extends Error {
  status: number;
  statusText: string;

  constructor(public response: Response) {
    // Set the error message using the response status and status text
    super(`HTTP Error: ${response.status} ${response.statusText}`);

    // Set the name of the error to "HTTPError"
    this.name = 'HTTPError';

    // Assign the status and statusText from the response
    this.status = response.status;
    this.statusText = response.statusText;

    // Maintain proper stack trace (optional)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError);
    }
  }
}

/**
 * Performs a fetch request and emits an error toast if the request fails.
 *
 * @param url The URL to fetch
 *
 * @param options Options to pass to the fetch function
 *
 * @param description A description of the fetch request, for logging. Should be
 * in the form of "lowercase-present-tense-verb object". For example, "thanking
 * torrent uploader". Do not include the url being fetched. Be user-friendly.
 * This is going in a toast with a direction to get more data in the console if
 * needed.
 *
 * @returns A promise that resolves to the response of the fetch
 */
export async function safeFetch(url: string, options: RequestInit, description: string) {
  let response;

  // absolute-ize
  url = new URL(url, window.location.origin).toString();

  try {
    response = await fetch(url, options);
  } catch (error) {
    if (error instanceof Error) {
      toasts.add(ErrorToast, { description, error });
    }
    throw error;
  }

  if (!response.ok) {
    const error = new HTTPError(response);
    toasts.add(ErrorToast, { description, error });
    throw error;
  }

  return response;
}
