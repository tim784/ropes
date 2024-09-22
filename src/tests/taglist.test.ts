import { Taglist } from '$lib/tag';
import { expect, test } from 'vitest';

test.each([
  ['tag1 tag2 tag3', ['tag1', 'tag2', 'tag3']],
  ['tag', ['tag']],
  ['tag1 and tag2', ['tag1', 'tag2']],
  ['tag1 & tag2', ['tag1', 'tag2']],
  ['tag1&tag2', ['tag1', 'tag2']],
  ['tag1 &tag2', ['tag1', 'tag2']],
  ['tag1& tag2', ['tag1', 'tag2']],
  ['tag1 and tag2', ['tag1', 'tag2']],
  ['tag1 and not tag2', ['tag1', '-tag2']],
  ['tag1 and ! tag2', ['tag1', '-tag2']],
  ['tag1 and - tag2', ['tag1', '-tag2']],
  ['not tag1', ['-tag1']],
  ['!tag1', ['-tag1']],
  ['-tag1', ['-tag1']],
  ['not tag1', ['-tag1']],
  ['tag1 -tag2', ['tag1', '-tag2']],
  ['tag1 - tag2', ['tag1', '-tag2']],
  ['tag1 !tag2', ['tag1', '-tag2']],
  ['tag1 ! tag2', ['tag1', '-tag2']],
  ['standing', ['standing']], // contains "and"
  ['stand', ['stand']], // contains "and"
  ['android', ['android']], // contains "and"
  ['more', ['more']], // contains "or"
  ['order', ['order']], // contains "or"
  ['poor', ['poor']], // contains "or"
  ['snotty', ['snotty']], // contains "not"
  ['snot', ['snot']], // contains "not"
  ['nothing', ['nothing']] // contains "not"
] as [string, string[]][])('legal Taglist.fromString(%s)', (taglist, expectedTagStrings) => {
  const parsed = Taglist.fromString(taglist);
  expect(parsed.success).toBe(true);
  if (parsed.success) {
    expect(parsed.value.tags.map((tag) => tag.toString())).toEqual(expectedTagStrings);
  }
});

test.each([
  'dupe dupe',
  'dupe dupe dupe',
  'dUpe dupe',
  'dupe -dupe',
  'dupe -duPe',
  '-dupe dupe',
  '-dupE dupe',
  '-dupe -dupe',
  '-dupe -Dupe'
])('Taglist.fromString dupes disallowed %s', () => {
  expect(Taglist.fromString('dupe dupe').success).toBe(false);
});

test.each([
  ['Tag1 Tag2 Tag3', ['tag1', 'tag2', 'tag3']],
  ['tag1 TAG2 tag3', ['tag1', 'tag2', 'tag3']],
  ['tAgGiNg', ['tagging']]
] as [string, string[]][])(
  'normalization Taglist.fromString(%s)',
  (taglist, expectedTagStrings) => {
    const parsed = Taglist.fromString(taglist);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.value.tags.map((tag) => tag.toString())).toEqual(expectedTagStrings);
    }
  }
);

test.each([
  'tag1-tag2', // `-` requires left whitespace
  'a-', // no operand
  '-!foo', // double negation
  '!-foo', // double negation
  '$', // invalid character
  '🎨', // invalid character
  '👩🏾‍❤️‍👨🏼', // invalid character
  '㴴', // invalid character
  '(', // not closed
  ')', // not opened
  '|', // missing operands
  '(a', // not closed
  ')a', // not opened
  '|a', // missing operand
  'a(', // not closed
  'a)', // not opened
  'a|', // missing operand
  'a(b', // not closed
  'a)b', // not opened
  'a|b', // missing operand
  'foo|bar', // missing operand
  'foo| bar', // missing operand
  'foo |bar', // missing operand
  'foo or bar', // missing operand
  'or bar', // missing operand
  'foo or', // missing operand
  'or', // missing operand
  '- -foo', // double negation
  '- !foo', // double negation
  '- not foo', // double negation
  '! -foo', // double negation
  '! !foo', // double negation
  '! not foo', // double negation
  'not -foo', // double negation
  'not !foo', // double negation
  'not not foo', // double negation
  'foo -' // missing operand
] as string[])('illegal parseTaglist(%s)', (taglist) => {
  const parsed = Taglist.fromString(taglist);
  expect(parsed.success).toBe(false);
});
