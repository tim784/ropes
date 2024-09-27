import type { User } from './gather/user';

export enum InteractionState {
  None,
  Seeding, // the torrent has been downloaded and is being seeded
  Snatched, // the torrent has been downloaded and is not being seeded
  Leeching, // the torrent is downloading
  Grabbed // the torrent file has been downloaded
}

export enum FreeleechState {
  None,
  Personal, // purchased with slot
  Sitewide, // special site holiday or something
  Unlimited // free forever if >30GB (or purchased by uploader)
}

export enum DoubleseedState {
  None,
  Personal, // purchased with slot
  Sitewide // special site holiday or something, never seen this
}

export type Torrent = {
  id: string;
  name: string;
  pageHref: string;
  imageHref: string | null;
  downloadHref: string | null;
  freeleechHref: string | null;
  doubleseedHref: string | null;
  uploadDateTime: Date;
  size: string;
  snatches: number;
  seeders: number;
  leechers: number;
  uploader: User | null;
  isWarned: boolean;
  freeleechState: FreeleechState;
  doubleseedState: DoubleseedState;
  interactionState: InteractionState;
  tags: string[] | null;
  isBookmarked: boolean;
};

export type TorrentInGroup = {
  torrent: Torrent;
  variantString: string;
};

// lookbehind for punctuation, whitespace, or start-of-string. this is like \b
// but includes more characters. also, start a group
const startTokenPattern = '(?<=^|[\\p{P}\\p{Z}])(';

// close the group and again, match punctuation, whitespace, or end-of-string
// with a lookahead assertion
const endTokenPattern = ')(?=[\\p{P}\\p{Z}]|$)';

// create a mega regex that matches all the variant tokens we care about. this
// is done by joining all the regexes with | and then wrapping them in a group.
// we construct the regex this way for maintainability: it gives us, like,
// sub-patterns which can be line-broken and comments in source code.
const variantTokenPatterns = new RegExp(
  startTokenPattern +
    [
      // standard resolutions (heights) with optional p or i suffix
      /((120|144|240|360|480|720|1080|2160|4320|8640)[pi]?)/,

      // arbirartry resolutions (heights), but with required p or i suffix to
      // avoid matching years or other numbers with semantic meaning
      /(\d{3,4}[pi])/,

      // 2k, 4k, 8K, 16k(?), etc
      /(\d{1,2}k)/,

      // sd, hd, uhd
      /(s|(u?h))d/,

      // VR tags
      /(((ps|gear)vr)|oculus|go|vive|rift|apple\s+vision\s+pro)/,

      // encoders
      /([xh]\.?26[45])/,
      /(hevc|avc)/,

      // containers (that might themselves be encoders too)
      /(mp4|mkv|avi|mov|wmv|flv|webm|mpeg|mpg|vob|divx|xvid)/
    ]
      .map((r) => r.source)
      .join('|') +
    endTokenPattern,
  // i for case-insensitivity, g for all matches (in a string.match call), u for
  // unicode-construct support
  'igu'
);

// similar to above, but for tokens we want to ignore
const ignoredTokenPatterns = new RegExp(
  startTokenPattern +
    [/(req(uest)?)/, /(re(-)?encode)/, /(ai)/, /(upscale)/].map((r) => r.source).join('|') +
    endTokenPattern,
  'igu'
);

// contiguous strings of chars that are not whitespace or punctuation
const notWhitespaceOrPunctuation = /[^\p{P}\p{Z}]+/igu;

type ParsedTitle = {
  titleTokens: string[];
  variantTokens: string[];
  ignoredTokens: string[];
};

function parseTitle(title: string): ParsedTitle {
  // collect all the variant tokens and then remove them from the title
  const variantTokens = title.match(variantTokenPatterns) || [];
  const afterVariants = title.replace(variantTokenPatterns, '');

  // collect all the ignored tokens and then remove them from the title
  const ignoredTokens = afterVariants.match(ignoredTokenPatterns) || [];
  const afterIgnore = afterVariants.replace(ignoredTokenPatterns, '');

  // remove anything considered punctuation or whitespace: then you got the
  // title tokens
  const titleTokens = afterIgnore.match(notWhitespaceOrPunctuation) || [];

  return { titleTokens, variantTokens, ignoredTokens };
}

function setsAreEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
  // Check if both sets have the same size
  if (setA.size !== setB.size) {
    return false;
  }

  // Check if every element in setA exists in setB
  for (const elem of setA) {
    if (!setB.has(elem)) {
      return false;
    }
  }

  // If all checks passed, the sets are equal
  return true;
}

/**
 * Rename the variant string. If there are no variant tokens, use "Variant
 * <group length>". Otherwise, join the variant tokens with a space
 *
 * This need may be more apparent with an example. Say you have two torrents:
 *
 * 1. Foobar
 * 2. Foobar (1080p)
 *
 * These two torrents should be in the same group, but what do we name the first
 * one? The best we can do is some kind of placeholder name, like "Variant 1". And that's
 * what this function does.
 *
 * @param variantTokens A possibly-empty array of variant tokens
 *
 * @param groupLength The length of the group to which this torrent would be
 * added. The returned string will contain this number plus 1.
 *
 * @returns An appropriate variant string
 */
function renameVariantString(variantTokens: string[], groupLength: number) {
  return variantTokens.length === 0 ? `Variant ${groupLength + 1}` : variantTokens.join(' ');
}

type GroupItem = {
  titleTokens: Set<string>;
  torrents: TorrentInGroup[];
};

export function groupTorrents(torrents: Torrent[]): TorrentInGroup[][] {
  const groups: GroupItem[] = [];

  for (const torrent of torrents) {
    const { titleTokens, variantTokens } = parseTitle(torrent.name);
    const titleSet = new Set(titleTokens);

    let foundGroup = false;
    for (const group of groups) {
      if (setsAreEqual(titleSet, group.titleTokens)) {
        group.torrents.push({
          torrent,
          variantString: renameVariantString(variantTokens, group.torrents.length)
        });
        foundGroup = true;
        break;
      }
    }
    if (!foundGroup) {
      groups.push({
        titleTokens: titleSet,
        torrents: [{ torrent, variantString: renameVariantString(variantTokens, 0) }]
      });
    }
  }

  return groups.map(({ torrents: group }) => group);
}
