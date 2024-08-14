import { test, expect } from 'vitest';
import { getRelativeDifference } from "$src/lib/util";
import { add, sub, subMilliseconds } from 'date-fns';

const now = new Date();

test.each([
  ['in the future', add(now, { days: 1 }), now],
  ['now', now, now],
  ['0 seconds ago', subMilliseconds(now, 999), now],
  ['1 second ago', sub(now, { seconds: 1 }), now],
  ['45 seconds ago', sub(now, { seconds: 45 }), now],
  ['70 seconds ago', sub(now, { seconds: 70 }), now],
  ['75 minutes ago', sub(now, { minutes: 75 }), now],
  ['30 hours ago', sub(now, { hours: 30 }), now],
  ['10 days ago', sub(now, { days: 10 }), now],
  ['5 weeks ago', sub(now, { weeks: 5 }), now],
  ['8 months ago', sub(now, { months: 8 }), now],
  ['2 years ago', sub(now, { years: 2 }), now],
  ['3 years, 6 months ago', sub(now, { years: 3, months: 6 }), now]
])('should return "%s" for reference time %s', (expected, ref, now) => {
  expect(getRelativeDifference(ref, now)).toBe(expected);
});
