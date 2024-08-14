import PQueue from 'p-queue';
import { safeFetch } from './util';

/**
 * A rate limiter queue that can be used to limit the number and frequency of
 * requests to Empornium. We're trying to be nice here.
 */
export const apiQueue = new PQueue({
  // one request at a time
  concurrency: 1,

  // wait 100ms after the last request finished before starting the next one
  interval: 100,

  // only allow one request per interval
  intervalCap: 1,

  // even though we don't have a timeout, signal to typescript that we're always
  // going to return a promise and not void.
  throwOnTimeout: true
});

type Priority = number;

/**
 * Priority of operation. Operations with greater priority will be scheduled first.
 */
export const priorities: Record<string, Priority> = {
  thank: 10,
  bookmark: 10,
  validateTag: 10,
  autocomplete: 20
};

export async function queueFetch(
  url: string,
  options: RequestInit,
  description: string,
  priority: Priority
): Promise<Response> {
  return await apiQueue.add(async () => safeFetch(url, options, description), {
    priority,

    // ditto from above: this just means we always get a response. typing escape
    // hatch. we don't have a timeout on this queue.
    throwOnTimeout: true
  });
}
