/**
 * Split a CSS value into a number and a unit.
 *
 * @param value The string CSS value to split.
 *
 * @returns a tuple of the number and the unit.
 *
 * @see https://github.com/sveltejs/svelte/blob/993fff0045c92571af6722dd9e12433ba1d2bfc7/packages/svelte/src/transition/index.js#L23
 */
export function split_css_unit(value: string | number): [number, string] {
  if (typeof value === 'string') {
    const match = value.match(/^(-?\d*\.?\d*)(.*)$/);
    if (match) {
      return [parseFloat(match[1]), match[2]];
    } else {
      return [parseFloat(value), 'px'];
    }
  }
  return [value, 'px'];
}

/**
 * Get the relative (human-readable) difference between two Date objects.
 *
 * This mimics git's relative date format. I like it because it doesn't just do
 * strict "unit-ing". For example, it won't say "X minutes" for 75 seconds --
 * it'll say 75 seconds, because choosing "1 minute" or "2 minutes" introduces
 * too much error. In general, it overflows the units a little bit near the
 * breakpoints.
 *
 * @param ref A DateTime to compare against.  This is the "earlier" time.
 *
 * @param now A DateTime to compare with. Defaults to the current time. This is
 * the "later" time.
 *
 * @returns A human-readable string representing the relative difference between
 * the two times.
 *
 * @see
 * https://github.com/git/git/blob/39bf06adf96da25b87c9aa7d35a32ef3683eb4a4/date.c#L135
 */
export function getRelativeDifference(ref: Date, now: Date | undefined = undefined): string {
  now = now || new Date();
  const diffMillis = differenceInMilliseconds(now, ref);

  if (diffMillis === 0) {
    return 'now';
  }

  if (diffMillis < 0) {
    return 'in the future';
  }

  const diffSeconds = diffMillis / 1000;
  if (diffSeconds < 90) {
    return diffSeconds === 1 ? '1 second ago' : `${Math.floor(diffSeconds)} seconds ago`;
  }

  const diffMinutes = Math.floor((diffSeconds + 30) / 60);
  if (diffMinutes < 90) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  }

  const diffHours = Math.floor((diffMinutes + 30) / 60);
  if (diffHours < 36) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  const diffDays = Math.floor((diffHours + 12) / 24);
  if (diffDays < 14) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }

  const diffWeeks = Math.floor((diffDays + 3) / 7);
  if (diffWeeks < 10) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  }

  const diffMonths = Math.floor((diffDays + 15) / 30);
  if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  }

  const diffYears = Math.floor((diffDays + 183) / 365);
  if (diffYears < 5) {
    const totalMonths = Math.floor((diffDays * 12 * 2 + 365) / (365 * 2));
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    if (months) {
      const yearString = years === 1 ? '1 year' : `${years} years`;
      const monthString = months === 1 ? '1 month ago' : `${months} months ago`;
      return `${yearString}, ${monthString}`;
    }
    return years === 1 ? '1 year ago' : `${years} years ago`;
  }

  return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
}

/**
 * Returns the difference in milliseconds between two dates.
 *
 * @param a The first date.
 *
 * @param b The second date.
 *
 * @returns A number of millseconds representing the difference between the two. If a is
 * before b, the result will be negative.
 */
export function differenceInMilliseconds(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

/**
 * Parse a date in the format 'LLL dd yyyy, HH:mm'. For example, 'Jul 08 2024,
 * 00:28'.
 *
 * We home brew this because including the datefns library is a lot of bloat for
 * the bundle, especially when our format is fixed. Homebrewing this may be more
 * error prone though.
 *
 * @param date The date string to parse.
 *
 * @returns A Date object representing the parsed date.
 *
 * @throws An error if the date string could not be parsed.
 */
export function parseEmpDate(date: string): Date {
  // const match = date.match(DATE_PATTERN);
  // if (!match) {
  //   throw new Error(`Could not parse date: ${date}`);
  // }
  // const { month, day, year, hour, minute } = match.groups!;
  // const monthIndex = MONTHS.indexOf(month);
  // if (monthIndex === -1) {
  //   throw new Error(`Could not parse month: ${month}`);
  // }
  // return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute));
  // wow! scratch that! new Date(string) works!
  return new Date(date);
}

const numberFormatter = new Intl.NumberFormat();
/**
 * Format a number according to the user's locale. For example, insert commas every 3 digits.
 *
 * @param num The number to format.
 *
 * @returns The formatted number.
 */
export function formatNumber(num: number) {
  return numberFormatter.format(num);
}

/**
 * Return a random integer between min and max (inclusive).
 *
 * @param min the minimum possible value
 *
 * @param max the maximum possible value
 *
 * @returns a random integer between min and max (inclusive)
 */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return a random float between min and max.
 *
 * @param min the minimum possible value
 *
 * @param max the maximum possible value
 *
 * @returns a random float between min and max
 */
export function randFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Return a random item from an array.
 * 
 * @param arr the array to choose from
 * 
 * @returns a random item from the array
 */
export function randItemFromArray<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

/**
 * Clone a FormData object.
 * 
 * @param formData the original FormData object
 * 
 * @returns a new FormData object with the same key-value pairs as the original
 */
export function cloneFormData(formData: FormData): FormData {
  const newFormData = new FormData();
  for (const [key, value] of formData) {
    newFormData.set(key, value);
  }
  return newFormData;
}