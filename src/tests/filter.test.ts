import { expect, test } from 'vitest';
import { makeTestTorrent } from './util';
import { type Torrent } from '$lib/torrent';
import { type Filter, CombinedFilter } from '$lib/filter';

/**
 * Make a test torrent with a given name.
 */
function makeTestTorrentWithTags(tags: string[]): Torrent {
  return {
    ...makeTestTorrent(),
    tags
  };
}

function makeTestFilterGroup(
  blockTags: Filter['blockTags'],
  allowTags: Filter['allowTags']
): CombinedFilter {
  return new CombinedFilter(new Set(allowTags), new Set(blockTags));
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
  // # block: 0, allow: X

  // block: 0, allow: 0
  [makeTestFilterGroup([], []), all],

  // block: 0, allow: 1
  [makeTestFilterGroup([], ['a']), [tA, tAB, tAC, tABC]],
  [makeTestFilterGroup([], ['b']), [tB, tAB, tBC, tABC]],
  [makeTestFilterGroup([], ['c']), [tC, tAC, tBC, tABC]],

  // block: 0, allow: 2
  [makeTestFilterGroup([], ['a', 'b']), [tA, tB, tAB, tAC, tBC, tABC]],
  [makeTestFilterGroup([], ['a', 'c']), [tA, tC, tAB, tAC, tBC, tABC]],
  [makeTestFilterGroup([], ['b', 'c']), [tB, tC, tAB, tAC, tBC, tABC]],

  // block: 0, allow: 3
  [makeTestFilterGroup([], ['a', 'b', 'c']), all],

  // # block: 1, allow: X

  // block: 1, allow: 0
  [makeTestFilterGroup(['a'], []), [tB, tC, tBC]],
  [makeTestFilterGroup(['b'], []), [tA, tC, tAC]],
  [makeTestFilterGroup(['c'], []), [tA, tB, tAB]],

  // block: 1, allow: 1
  [makeTestFilterGroup(['a'], ['b']), [tB, tBC]],
  [makeTestFilterGroup(['a'], ['c']), [tC, tBC]],
  [makeTestFilterGroup(['b'], ['a']), [tA, tAC]],
  [makeTestFilterGroup(['b'], ['c']), [tC, tAC]],
  [makeTestFilterGroup(['c'], ['a']), [tA, tAB]],
  [makeTestFilterGroup(['c'], ['b']), [tB, tAB]],

  // block: 1, allow: 2
  [makeTestFilterGroup(['a'], ['b', 'c']), [tB, tC, tBC]],
  [makeTestFilterGroup(['b'], ['a', 'c']), [tA, tC, tAC]],
  [makeTestFilterGroup(['c'], ['a', 'b']), [tA, tB, tAB]],

  // # block: 2, allow: X

  // block: 2, allow: 0
  [makeTestFilterGroup(['a', 'b'], []), [tC]],
  [makeTestFilterGroup(['a', 'c'], []), [tB]],
  [makeTestFilterGroup(['b', 'c'], []), [tA]],

  // block: 2, allow: 1
  [makeTestFilterGroup(['a', 'b'], ['c']), [tC]],
  [makeTestFilterGroup(['a', 'c'], ['b']), [tB]],
  [makeTestFilterGroup(['b', 'c'], ['a']), [tA]],

  // # block: 3, allow: X

  // block: 3, allow: 0
  [makeTestFilterGroup(['a', 'b', 'c'], []), []]
])('should filter torrents %s', (filter, expected) => {
  const filtered = all.filter((torrent) => filter.filter(torrent));

  const actualTags = new Set(filtered.map((torrent) => torrent.tags));
  const expectedTags = new Set(expected.map((torrent) => torrent.tags));

  expect(actualTags).toEqual(expectedTags);
});
