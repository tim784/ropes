import { TaglistTag } from '$lib/tag';
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
  ['standing', ['standing']], // contains and
  ['stand', ['stand']], // contains and
  ['android', ['android']], // contains and
  ['more', ['more']], // contains or
  ['order', ['order']], // contains or
  ['poor', ['poor']], // contains or
  ['snotty', ['snotty']], // contains not
  ['snot', ['snot']], // contains not
  ['nothing', ['nothing']], // contains not
  ['dupe dupe', ['dupe']]
] as [string, string[]][])('legal parseTaglist(%s)', (taglist, expectedStrs) => {
  const expected = expectedStrs.map(TaglistTag.fromString);
  const parsed = TaglistTag.validateSyntax(taglist);
  expect(parsed).toEqual(expected);
});

test.each([
  ['Tag1 Tag2 Tag3', ['tag1', 'tag2', 'tag3']],
  ['tag1 TAG2 tag3', ['tag1', 'tag2', 'tag3']],
  ['tAgGiNg', ['tagging']],
] as [string, string[]][])('normalization parseTaglist(%s)', (taglist, expectedStrs) => {
  const expected = expectedStrs.map(TaglistTag.fromString);
  const parsed = TaglistTag.validateSyntax(taglist);
  expect(parsed).toEqual(expected);
});

test.each([
  ['tag1-tag2', 'start of token'],
  ['a-', 'start of token'],
  ['-!foo', 'start of token'],
  ['!-foo', 'start of token'],
  ['$', 'Character'],
  ['🎨', 'Character'],
  ['👩🏾‍❤️‍👨🏼', 'Character'],
  ['㴴', 'Character'],
  ['(', 'not supported'],
  [')', 'not supported'],
  ['|', 'not supported'],
  ['(a', 'not supported'],
  [')a', 'not supported'],
  ['|a', 'not supported'],
  ['a(', 'not supported'],
  ['a)', 'not supported'],
  ['a|', 'not supported'],
  ['a(a', 'not supported'],
  ['a)a', 'not supported'],
  ['a|a', 'not supported'],
  ['foo|bar', 'not supported'],
  ['foo| bar', 'not supported'],
  ['foo |bar', 'not supported'],
  ['foo or bar', 'not supported'],
  ['or bar', 'not supported'],
  ['foo or', 'not supported'],
  ['or', 'not supported'],
  ['- -foo', 'Negation should not be doubled'],
  ['- !foo', 'Negation should not be doubled'],
  ['- not foo', 'Negation should not be doubled'],
  ['! -foo', 'Negation should not be doubled'],
  ['! !foo', 'Negation should not be doubled'],
  ['! not foo', 'Negation should not be doubled'],
  ['not -foo', 'Negation should not be doubled'],
  ['not !foo', 'Negation should not be doubled'],
  ['not not foo', 'Negation should not be doubled'],
  ['foo -', 'Negation operator should not be at end'],
  ['foo -foo', 'duplicated with different negation']
] as [string, string][])('illegal parseTaglist(%s)', (taglist, errorSubstring) => {
  expect(() => TaglistTag.validateSyntax(taglist)).toThrow(errorSubstring);
});
