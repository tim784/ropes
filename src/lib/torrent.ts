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

const tokenPattern = /[a-z0-9\.\-]+/gim;
const variantTokenPatterns = [
  // resolution
  // standard heights, optional p or i suffix
  /^(?:120|144|240|360|480|720|1080|2160|4320|8640)(?:p|i)?$/i,
  // arbirartry heights, but must have p or i suffix to avoid matching years or
  // other numbers
  /^\d{3,4}(?:p|i)$/i,
  // 2k, 4k, 8K, 16k(?), etc
  /^\d{1,2}k$/i,
  // sd, hd, uhd
  /^(?:s|h|uh)d$/i,

  // VR tags
  // psvr, gearvr, oculus, go, vive, rift
  /^(?:(?:(?:ps|gear)vr)|oculus|go|vive|rift)$/i,

  // encoders
  // x264, h265, h.265, etc
  /^[xh]\.?26[45]$/i,
  // hevc, avc
  /^(?:hevc|avc)$/i,

  // containers (that might themselves be encoders too)
  /^(?:mp4|mkv|avi|mov|wmv|flv|webm|mpeg|mpg|vob|divx|xvid)$/i
];

const ignoredTokenPatterns = [/^req(?:uest)?$/i, /^re(?:-)?encode$/i, /^ai$/i, /^upscale$/i];

function matchesPatterns(s: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(s));
}

function isVariantToken(token: string): boolean {
  return matchesPatterns(token, variantTokenPatterns);
}

function isIgnoredToken(token: string): boolean {
  return matchesPatterns(token, ignoredTokenPatterns);
}

function tokenize(s: string): Set<string> {
  const matches = s.match(tokenPattern);
  if (matches === null) {
    return new Set();
  }

  return new Set(matches);
}

type TokenizedTorrent = {
  torrent: Torrent;
  tokens: Set<string>;
};

export type TorrentInGroup = {
  torrent: Torrent;
  variantString: string;
};

function caseInsensitiveIntersection(a: Set<string>, b: Set<string>): Set<string> {
  const intersection = new Set<string>();
  const bLower = new Set([...b].map((token) => token.toLowerCase()));
  for (const token of a) {
    const tokenLower = token.toLowerCase();
    if (bLower.has(tokenLower)) {
      intersection.add(token);
    }
  }

  return intersection;
}

/**
 * Break down an array of torrents into groups of similar torrents, based on
 * their names.
 *
 * The basic algorithm is:
 *
 * 1. Create a group array, a 2-dimensional array of torrents.
 * 2. Tokenize the name of each torrent into a set of words: sequences of
 *    /a-z0-9\.+/, case-insensitive.
 * 3. For each torrent, check if it's similar to any existing group: This is
 *    done by comparing the given torrent's tokens to those of each torrent
 *    already in a group and calculating the 1) intersection, 2) left
 *    difference, and 3) right difference. Reject the torrent if any of the
 *    following are true:
 *    - The intersection is an empty set
 *    - The difference has tokens that are not a "variant" tokens (resolution,
 *      encoder, container, VR tag, etc)
 *
 *    Otherwise, add the torrent to the group.
 * 4. If no group is found, create a new group with just that torrent.
 * 5. Return the groups.
 *
 * @param torrents Array of torrents to group
 *
 * @returns A 2-dimensional array of grouped torrents
 */
export function groupTorrents(torrents: Torrent[]): TorrentInGroup[][] {
  const groups: TokenizedTorrent[][] = [];

  const tokenizedTorrents: TokenizedTorrent[] = torrents.map((torrent) => {
    const tokens = tokenize(torrent.name);
    return { torrent, tokens } as TokenizedTorrent;
  });

  // a deeply nested loop, but n is at most 100, so it's fine
  for (const torrent of tokenizedTorrents) {
    let foundGroup = false;
    for (const group of groups) {
      let isSimilarToGroup = true;
      for (const groupTorrent of group) {
        const commonTokens = caseInsensitiveIntersection(torrent.tokens, groupTorrent.tokens);
        if (commonTokens.size === 0) {
          isSimilarToGroup = false;
          break;
        }

        // check both the "left" and "right" difference between the two
        // torrents. "left" and "right" refer to the either left or right subregions
        // in a venn diagram of the two torrents' tokens.
        //
        // don't need case-insensitivity here, our regexes have case-insensitive
        // flag
        const leftDifferenceTokens = torrent.tokens.difference(groupTorrent.tokens);
        const rightDifferenceTokens = groupTorrent.tokens.difference(torrent.tokens);
        if (
          [...leftDifferenceTokens, ...rightDifferenceTokens].some(
            (token) => !isVariantToken(token) && !isIgnoredToken(token)
          )
        ) {
          isSimilarToGroup = false;
          break;
        }
      }

      if (isSimilarToGroup) {
        group.push(torrent);
        foundGroup = true;
        break;
      }
    }

    if (!foundGroup) {
      groups.push([torrent]);
    }
  }

  // Name the TokenizedTorrent by its variant tokens, if it has any. If there
  // are no variant tokens, such as when the torrents all have the same name or
  // only ignored tokens are varied, name the TokenizedTorrent "Variant <n>",
  // where n is a counter.
  let variantCounter = 1;
  function nameVariant(t: TokenizedTorrent): string {
    const defaultVariantString = [...tokenize(t.torrent.name)].filter(isVariantToken).join(' ');
    if (defaultVariantString !== '') {
      return defaultVariantString;
    }
    return `Variant ${variantCounter++}`;
  }

  // convert the groups to TorrentInGroup objects. TorrentInGroup is a Torrent
  // with a variantString.
  return groups.map((group) =>
    group.map((t) => {
      return {
        torrent: t.torrent,
        variantString: nameVariant(t)
      };
    })
  );
}
