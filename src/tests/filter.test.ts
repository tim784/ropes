import { expect, test } from 'vitest';
import { makeTestTorrent } from './util';
import { type Torrent } from '$lib/torrent';
import { type Filter, FilterGroup } from '$lib/filter';

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
): FilterGroup {
  return new FilterGroup(
    allowTags === null ? null : new Set(allowTags),
    blockTags === null ? null : new Set(blockTags)
  );
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
  // # block: null, allow: X

  // block: null, allow: null
  [makeTestFilterGroup(null, null), all],

  // block: null, allow: 0
  [makeTestFilterGroup(null, []), []],

  // block: null, allow: 1
  [makeTestFilterGroup(null, ['a']), [tA, tAB, tAC, tABC]],
  [makeTestFilterGroup(null, ['b']), [tB, tAB, tBC, tABC]],
  [makeTestFilterGroup(null, ['c']), [tC, tAC, tBC, tABC]],

  // block: null, allow: 2
  [makeTestFilterGroup(null, ['a', 'b']), [tA, tB, tAB, tAC, tBC, tABC]],
  [makeTestFilterGroup(null, ['a', 'c']), [tA, tC, tAB, tAC, tBC, tABC]],
  [makeTestFilterGroup(null, ['b', 'c']), [tB, tC, tAB, tAC, tBC, tABC]],

  // block: null, allow: 3
  [makeTestFilterGroup(null, ['a', 'b', 'c']), all],

  // # block: 0, allow: X

  // block: 0, allow: null
  [makeTestFilterGroup([], null), all],

  // block: 0, allow: 0
  [makeTestFilterGroup([], []), []],

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

  // block: 1, allow: null
  [makeTestFilterGroup(['a'], null), [tB, tC, tBC]],
  [makeTestFilterGroup(['b'], null), [tA, tC, tAC]],
  [makeTestFilterGroup(['c'], null), [tA, tB, tAB]],

  // block: 1, allow: 0
  [makeTestFilterGroup(['a'], []), []],
  [makeTestFilterGroup(['b'], []), []],
  [makeTestFilterGroup(['c'], []), []],

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

  // block: 2, allow: null
  [makeTestFilterGroup(['a', 'b'], null), [tC]],
  [makeTestFilterGroup(['a', 'c'], null), [tB]],
  [makeTestFilterGroup(['b', 'c'], null), [tA]],

  // block: 2, allow: 0
  [makeTestFilterGroup(['a', 'b'], []), []],
  [makeTestFilterGroup(['a', 'c'], []), []],
  [makeTestFilterGroup(['b', 'c'], []), []],

  // block: 2, allow: 1
  [makeTestFilterGroup(['a', 'b'], ['c']), [tC]],
  [makeTestFilterGroup(['a', 'c'], ['b']), [tB]],
  [makeTestFilterGroup(['b', 'c'], ['a']), [tA]],

  // # block: 3, allow: X

  // block: 3, allow: null
  [makeTestFilterGroup(['a', 'b', 'c'], null), []],

  // block: 3, allow: 0
  [makeTestFilterGroup(['a', 'b', 'c'], []), []]
])('should filter torrents %s', (filter, expected) => {
  const filtered = all.filter((torrent) => filter.filter(torrent));

  const actualTags = new Set(filtered.map((torrent) => torrent.tags));
  const expectedTags = new Set(expected.map((torrent) => torrent.tags));

  expect(actualTags).toEqual(expectedTags);
});
