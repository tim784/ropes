import { expect, test } from 'vitest';
import { SizeRange, type EmpSizeRangeParsed, type EmpSizeRange } from '$lib/size';
import { SIZE_MID_NAME, SIZE_UNIT_NAME, SIZE_RANGE_NAME } from '$gather/search';

type SizeRangeParams = Parameters<typeof SizeRange.from>[0];

test.each([
  // normal
  { minBytes: 0, maxBytes: 0 },

  // fractional bytes don't really make sense, but they're allowed because we're
  // doing unit conversions that might result in them
  { minBytes: 0.123, maxBytes: 0.234 },

  // undefined is allowed, and it defaults to DEFAULT_MIN_BYTES and
  // DEFAULT_MAX_BYTES
  { minBytes: undefined, maxBytes: 1 },
  { minBytes: 0, maxBytes: undefined },
  { minBytes: undefined, maxBytes: undefined }
] as SizeRangeParams[])('SizeRange.from %s', (params) => {
  SizeRange.from(params);
});

test.each([
  // min > max
  { minBytes: 1, maxBytes: 0 },

  // negative
  { minBytes: -5, maxBytes: 0 },
  { minBytes: -5, maxBytes: -5 },

  // NaN and Infinities
  { minBytes: NaN, maxBytes: 0 },
  { minBytes: 0, maxBytes: NaN },
  { minBytes: +Infinity, maxBytes: 0 },
  { minBytes: 0, maxBytes: -Infinity },

  // this is a crufty corner case: when maxBytes is undefined, it defaults to
  // DEFAULT_MAX_BYTES. if minBytes is greater than that, it should fail.
  { minBytes: SizeRange.DEFAULT_MAX_BYTES + 1, maxBytes: undefined }
] as SizeRangeParams[])('invalid SizeRange.from %s', (params) => {
  expect(() => SizeRange.from(params)).toThrow();
});

// helper to make the test data more readable
function r(
  mid: EmpSizeRange[typeof SIZE_MID_NAME],
  range: EmpSizeRange[typeof SIZE_RANGE_NAME],
  unit: EmpSizeRange[typeof SIZE_UNIT_NAME]
): EmpSizeRange {
  return {
    [SIZE_MID_NAME]: mid,
    [SIZE_RANGE_NAME]: range,
    [SIZE_UNIT_NAME]: unit
  };
}

test.each([
  // various units
  [r('100', '20', 'b'), SizeRange.from({ minBytes: 80, maxBytes: 120 })],
  [r('100', '20', 'kb'), SizeRange.from({ minBytes: 81920, maxBytes: 122880 })],
  [r('100', '20', 'mb'), SizeRange.from({ minBytes: 83886080, maxBytes: 125829120 })],
  [r('100', '20', 'gb'), SizeRange.from({ minBytes: 85899345920, maxBytes: 128849018880 })],
  [r('100', '20', 'tb'), SizeRange.from({ minBytes: 87960930222080, maxBytes: 131941395333120 })],

  // bad units ok, default to kb
  [r('1', '1', 'lol'), SizeRange.from({ minBytes: 0, maxBytes: 2048 })],
  [r('1', '1', 'B'), SizeRange.from({ minBytes: 0, maxBytes: 2048 })],
  [r('1', '1', 'GB'), SizeRange.from({ minBytes: 0, maxBytes: 2048 })],
  [r('1', '1', ''), SizeRange.from({ minBytes: 0, maxBytes: 2048 })],
  [r('1', '1', undefined), SizeRange.from({ minBytes: 0, maxBytes: 2048 })],

  // if min would be negative, it's 0
  [r('5', '10', 'kb'), SizeRange.from({ minBytes: 0, maxBytes: 15360 })],

  // empty or undefined mid means undefined
  [r('', '10', 'kb'), undefined],
  [r(undefined, '10', 'kb'), undefined],

  // bogus mid means null
  [r('lol', '10', 'kb'), null],
  [r('123abc', '10', 'kb'), null],
  [r('0b1', '10', 'kb'), null],
  [r('0x1', '10', 'kb'), null],
  [r('1e1', '10', 'kb'), null],

  // empty/undefined range means 0
  [r('5', '', 'kb'), SizeRange.from({ minBytes: 5120, maxBytes: 5120 })],
  [r('5', undefined, 'kb'), SizeRange.from({ minBytes: 5120, maxBytes: 5120 })],
  [r('5', 'lol', 'kb'), SizeRange.from({ minBytes: 5120, maxBytes: 5120 })],
  [r('5', '0b1', 'kb'), SizeRange.from({ minBytes: 5120, maxBytes: 5120 })],
  [r('5', '0x1', 'kb'), SizeRange.from({ minBytes: 5120, maxBytes: 5120 })],

  // bogus range means null
  [r('5', '1e1', 'kb'), null]
] as [EmpSizeRange, SizeRange][])('Size.fromEmpSizeRange %s', (params, expected) => {
  expect(SizeRange.fromEmpSizeRange(params)).toEqual(expected);
});

test.each([
  [SizeRange.from({ minBytes: 0, maxBytes: 0 }).toEmpSizeRange(), r('0', '0', 'kb')],
  [SizeRange.from({ minBytes: 0, maxBytes: 0, outputUnit: 'kb' }).toEmpSizeRange(), r('0', '0', 'kb')],
  [SizeRange.from({ minBytes: 0, maxBytes: 0, outputUnit: 'mb'}).toEmpSizeRange(), r('0', '0', 'mb')],
  [SizeRange.from({ minBytes: 0, maxBytes: 0, outputUnit: 'gb'}).toEmpSizeRange(), r('0', '0', 'gb')],
  [SizeRange.from({ minBytes: 0, maxBytes: 0, outputUnit: 'tb'}).toEmpSizeRange(), r('0', '0', 'tb')],
] as [SizeRange, EmpSizeRange][])('Size.toEmpSizeRange %s', (sizeRange, expected) => {
  expect(sizeRange).toEqual(expected);
});

