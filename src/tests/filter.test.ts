import { expect, test } from 'vitest';
import { makeTestTorrent } from './util';
import { type Torrent } from '$lib/torrent';
import { Filter } from '$lib/filter';

/**
 * Make a test torrent with a given name.
 */
function makeTestTorrentWithTags(tags: string[]): Torrent {
  return {
    ...makeTestTorrent(),
    tags
  };
}

function makeTestFilter(denyTags: string[], allowTags: string[]): Filter {
  return new Filter('test', denyTags, allowTags);
}

const tA = makeTestTorrentWithTags(['a']);
const tB = makeTestTorrentWithTags(['b']);
const tC = makeTestTorrentWithTags(['c']);
const tAB = makeTestTorrentWithTags(['a', 'b']);
const tBC = makeTestTorrentWithTags(['b', 'c']);
const tAC = makeTestTorrentWithTags(['a', 'c']);
const tABC = makeTestTorrentWithTags(['a', 'b', 'c']);

const all = [tA, tB, tC, tAB, tAC, tBC, tABC];

test.each([
  [makeTestFilter([], []), all],
  [Filter.ROOT_FILTER, all],
  [makeTestFilter(['a'], []), [tB, tC, tBC]],
  [makeTestFilter(['b'], []), [tA, tC, tAC]],
  [makeTestFilter(['c'], []), [tA, tB, tAB]],
  [makeTestFilter(['a', 'b'], []), [tC]],
  [makeTestFilter(['b', 'c'], []), [tA]],
  [makeTestFilter(['a', 'c'], []), [tB]],
  [makeTestFilter(['a', 'b', 'c'], []), []],
  [makeTestFilter([], ['a']), all],
  [makeTestFilter([], ['b']), all],
  [makeTestFilter([], ['c']), all],
  [makeTestFilter([], ['a', 'b']), all],
  [makeTestFilter([], ['b', 'c']), all],
  [makeTestFilter([], ['a', 'c']), all],
  [makeTestFilter([], ['a', 'b', 'c']), all],
  [makeTestFilter(['a'], ['b']), [tB, tC, tAB, tBC, tABC]],
  [makeTestFilter(['a'], ['c']), [tB, tC, tAC, tBC, tABC]],
  [makeTestFilter(['b'], ['a']), [tA, tC, tAC, tAB, tABC]],
  [makeTestFilter(['b'], ['c']), [tA, tC, tBC, tAC, tABC]],
  [makeTestFilter(['c'], ['a']), [tA, tB, tAB, tAC, tABC]],
  [makeTestFilter(['c'], ['b']), [tA, tB, tAB, tBC, tABC]],
  [makeTestFilter(['a'], ['b', 'c']), [tB, tC, tAB, tBC, tAC, tABC]],
  [makeTestFilter(['b'], ['a', 'c']), [tA, tC, tBC, tAC, tAB, tABC]],
  [makeTestFilter(['c'], ['a', 'b']), [tA, tB, tAB, tAC, tBC, tABC]],
  [makeTestFilter(['a', 'b'], ['c']), [tC, tAC, tBC, tABC]],
  [makeTestFilter(['b', 'c'], ['a']), [tA, tAB, tAC, tABC]],
  [makeTestFilter(['a', 'c'], ['b']), [tB, tAB, tBC, tABC]]
])('should filter torrents %s', (filter, expected) => {
  const filtered = all.filter((torrent) => filter.call(torrent));

  const actualTags = new Set(filtered.map((torrent) => torrent.tags));
  const expectedTags = new Set(expected.map((torrent) => torrent.tags));

  expect(actualTags).toEqual(expectedTags);
});
