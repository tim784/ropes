import { storageBacked } from './storageBacked';
import { makeAppIdentifier } from '../constants';
import pDebounce from 'p-debounce';

const batchIntervalMilliseconds = 500;
const key = makeAppIdentifier('seen-torrents');
const defaultSeen: () => Set<string> = () => new Set();

function createSeenTorrentsStore() {
  const store = storageBacked<Set<string>>(
    key,
    defaultSeen,
    (set) => JSON.stringify([...set]),
    (str) => new Set(JSON.parse(str))
  );
  const { subscribe, update } = store;

  // ARCHIVAL NOTE: alright, this store is causing performance problems. there's
  // perhaps a few explanataions:
  //
  // 1. the store is slow because its a Set and building/rebuilding the set from
  //    JSON might be slow. maybe should be an array instead.
  // 2. torrent id's are strings because we wanted to treat them as opaque
  //    identifiers, but maybe string processing is too slow and we should parse
  //    them as numbers just this one time.
  // 3. the asynchronous nature of adding torrents as they're scrolled into view
  //    can cause a lot of I/O to this store. further, because it's
  //    localStorage-backed, adds from other pages arrive to this one in events
  //    and cause all sorts of thrashing. maybe we should batch the adds and
  //    only update the store every 500ms or so. This will introduce race
  //    conditions in, at least, the following circumstances:
  //
  //    - If 2 (or more) page's commitBatch "critical section" have been entered
  //      simultaneously, only the last one to commit will win, effectively
  //      erasing the changes of the others. (There is no obvious way to
  //      synchronize this with mutexes or anything. The pages can't really
  //      speak to each other.)
  //
  //    - If a store shuts down before its batch it commited, its new data will
  //      be lost.
  //
  //    This is a non-critical feature, and that might be ok.
  //
  //  UPDATE: I implemented the batch strategy as it seemed the most effective,
  //  and it does improve things. The other options don't seem necessary to
  //  implement now, but I'll keep them around for posterity.

  const batch = new Set<string>();

  function commitBatch() {
    if (batch.size > 0) {
      update((seen) => {
        // ! START critical section !
        for (const id of batch) {
          seen.add(id);
        }
        return seen;
        // ! END critical section !
      });

      batch.clear();
    }
  }

  const commitBatchDebounced = pDebounce(commitBatch, batchIntervalMilliseconds);

  return {
    subscribe,

    /**
     * Attempt to add one torrent's id to the seen list. Note that this is not
     * added immediately, but is debounced.
     *
     * @param id The id of the torrent to add to the seen list.
     */
    add: (id: string) => {
      batch.add(id);
      commitBatchDebounced();
    },
    clear: () => {
      update(() => defaultSeen());
    }
  };
}

export const seenTorrents = createSeenTorrentsStore();
