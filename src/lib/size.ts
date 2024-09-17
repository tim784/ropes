import { z } from 'zod';
import { SIZE_MID_NAME, SIZE_UNIT_NAME, SIZE_RANGE_NAME } from '$gather/search';

// dude, i suck at this. this file is a mess.

export const unitValues = ['b', 'kb', 'mb', 'gb', 'tb'] as const;
export type UnitValue = (typeof unitValues)[number];
export const unitLabels: Record<UnitValue, string> = {
  b: 'B',
  kb: 'KiB',
  mb: 'MiB',
  gb: 'GiB',
  tb: 'TiB'
} as const;

export const getUnitPower = (unit: UnitValue): number => unitValues.indexOf(unit);

export function isUnitValue(value: string): value is UnitValue {
  return unitValues.includes(value as UnitValue);
}

export type Size = {
  value: number;
  unit: UnitValue;
};

export function bytesToUnit(bytes: number, unit: UnitValue): number {
  const power = unitValues.indexOf(unit);
  return bytes / Math.pow(1024, power);
}

function unitToBytes(value: number, unit: UnitValue): number {
  const power = unitValues.indexOf(unit);
  return value * Math.pow(1024, power);
}

const goodNumber = z.number().safe().nonnegative();
const noScientificNotationNumericStrings = z.string().refine((s) => {
  return !/[+-]?\d+\.?\d*e[+-]?\d+/i.test(s);
});
const noBinaryHexNumericStrings = z.string().refine((s) => {
  return !/[+-]?0[bx]/i.test(s);
});
const noUnconventionalNumericStrings =
  noScientificNotationNumericStrings.and(noBinaryHexNumericStrings);

/**
 * An unparsed EmpSizeRange. This represents raw data from the URL, which may be
 * invalid or incomplete.
 */
const empSizeRangeSchema = z.object({
  [SIZE_MID_NAME]: z.string().optional(),
  [SIZE_RANGE_NAME]: z.string().optional(),
  [SIZE_UNIT_NAME]: z.string().optional()
});
export type EmpSizeRange = z.infer<typeof empSizeRangeSchema>;

/*

 */

const newEmpSizeRangeSchema = empSizeRangeSchema.transform((params, ctx) => {
  // MID
  // - empty or undefined means this range has no effect (all torrents returned)
  // - if unparseable/bogus mid, its a null range in which no torrents match
  const mid = params[SIZE_MID_NAME];
  const midParsedRet = z.string().min(1)
    .pipe(z.coerce.number().safe().nonnegative())
    .safeParse(mid);
  if (!midParsedRet.success) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'invalid mid'
    });
    return z.NEVER;
  }
  const midParsed = midParsedRet.data;
});

// all this shit is kinda dumb, and we're doing crazy parsing on stuff that
// shouldn't really be mucked with (its in the URL, the site won't generate
// these edge cases unless the user is trying to)
const empSizeRangeParsedSchema = empSizeRangeSchema.transform((params) => {
  // MID
  // - empty or undefined means this range has no effect (all torrents returned)
  // - if unparseable/bogus mid, its a null range in which no torrents match
  const mid = params[SIZE_MID_NAME];
  if (mid === undefined || mid === '') {
    return undefined;
  }
  const midParsedRet = noUnconventionalNumericStrings
    .pipe(z.coerce.number().safe().nonnegative())
    .safeParse(mid);
  if (!midParsedRet.success) {
    return null;
  }
  const midParsed = midParsedRet.data;

  // RANGE
  //
  // emp behavior:
  // - empty, undefined, bogus (e.g., `lol`), or binary/hex literals (e.g.,
  //   `0b1`, `0x1`) means range is (i.e. must be exactly the mid)
  // - scientific notation means null range
  const range = params[SIZE_RANGE_NAME];
  let rangeParsed: number;
  if (range === undefined || range === '' || /^[+-]?0[bx]$/i.test(range)) {
    rangeParsed = 0;
  } else if (/^[+-]?\d+\.?\d*e[+-]?\d+$/i.test(range)) {
    return null;
  } else if (/^[+-]?\d+\.?\d*$/.test(range)) {
    rangeParsed = parseFloat(range);
  } else {
    rangeParsed = 0;
  }

  // UNIT
  const unit = params[SIZE_UNIT_NAME];
  // empty or bogus units default to kb
  const unitParsed = z
    .string()
    .refine(isUnitValue, {
      message: 'invalid unit'
    })
    .catch('kb')
    .parse(unit);

  return {
    [SIZE_MID_NAME]: midParsed,
    [SIZE_RANGE_NAME]: rangeParsed,
    [SIZE_UNIT_NAME]: unitParsed
  };
});
export type EmpSizeRangeParsed = z.infer<typeof empSizeRangeParsedSchema>;

export class SizeRange {
  static DEFAULT_MIN_BYTES = 0;
  static DEFAULT_MAX_BYTES = 10 * Math.pow(1024, 4); // 10TB

  private constructor(
    public readonly minBytes: number,
    public readonly maxBytes: number,
    public readonly outputUnit: UnitValue = 'kb'
  ) {}

  static schema = z
    .object({
      minBytes: z.optional(goodNumber).default(SizeRange.DEFAULT_MIN_BYTES),
      maxBytes: z.optional(goodNumber).default(SizeRange.DEFAULT_MAX_BYTES),
      outputUnit: z.optional(z.string().refine(isUnitValue, 'invalid unit'))
    })
    .refine((params) => {
      const min = params.minBytes ?? SizeRange.DEFAULT_MIN_BYTES;
      const max = params.maxBytes ?? SizeRange.DEFAULT_MAX_BYTES;
      return min <= max;
    }, 'min is greater than max');

  static from(params: z.infer<typeof SizeRange.schema>): SizeRange {
    const parsed = SizeRange.schema.parse(params);
    return new SizeRange(parsed.minBytes, parsed.maxBytes, parsed.outputUnit);
  }

  /**
   * Creates a SizeRange from an EmpSizeRange.
   *
   * This should never fail. This is data from emp (or the user's interaction on
   * emp) over which we have no control.
   */
  static fromEmpSizeRange(params: EmpSizeRange): SizeRange | undefined | null {
    const parsed = empSizeRangeParsedSchema.safeParse(params);
    if (parsed === undefined || parsed === null) {
      return parsed;
    }

    const mid = parsed[SIZE_MID_NAME];
    const range = parsed[SIZE_RANGE_NAME];
    const unit = parsed[SIZE_UNIT_NAME];

    const midBytes = unitToBytes(mid, unit);
    const rangeBytes = unitToBytes(range, unit);

    return SizeRange.from({
      minBytes: Math.max(midBytes - rangeBytes, 0),
      maxBytes: midBytes + rangeBytes,
      outputUnit: unit
    });
  }

  static fromSizes(min: Size | undefined, max: Size | undefined): SizeRange {
    min = min ?? { value: SizeRange.DEFAULT_MIN_BYTES / Math.pow(1024, 1), unit: 'kb' };
    max = max ?? { value: SizeRange.DEFAULT_MAX_BYTES / Math.pow(1024, 4), unit: 'tb' };

    const largerUnit = unitValues[Math.max(getUnitPower(min.unit), getUnitPower(max.unit))];
    return new SizeRange(
      unitToBytes(min.value, min.unit),
      unitToBytes(max.value, max.unit),
      largerUnit
    );
  }

  toEmpSizeRange(): EmpSizeRange {
    // make low and high, defaulting to DEFAULT_LOW and DEFAULT_HIGH
    const min = this.minBytes ?? SizeRange.DEFAULT_MIN_BYTES;
    const max = this.maxBytes ?? SizeRange.DEFAULT_MAX_BYTES;

    // do the math
    const mid = (min + max) / 2;
    const range = (max - min) / 2;

    // convert to unit
    const midSize = bytesToUnit(mid, this.outputUnit);
    const rangeSize = bytesToUnit(range, this.outputUnit);

    // return the EmpSizeRange
    return {
      [SIZE_MID_NAME]: midSize.toString(),
      [SIZE_RANGE_NAME]: rangeSize.toString(),
      [SIZE_UNIT_NAME]: this.outputUnit
    };
  }

  get minSize(): Size {
    return {
      value: bytesToUnit(this.minBytes, this.outputUnit),
      unit: this.outputUnit
    };
  }

  get maxSize(): Size {
    return {
      value: bytesToUnit(this.maxBytes, this.outputUnit),
      unit: this.outputUnit
    };
  }

  bytesEquals(other: unknown): boolean {
    if (!(other instanceof SizeRange)) {
      return false;
    }
    return this.minBytes === other.minBytes && this.maxBytes === other.maxBytes;
  }
}
