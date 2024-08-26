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

const tokenPattern = /[a-z0-9\.]+/gim;
const variationTokenPatterns = [
  // resolution
  /^\d{3,4}p?$/i, // 1080, 1080p, 480, etc
  /^\d{1,2}k$/i, // 4k, 8K, (16k?), etc
  /^u?hd$/i, // hd, uhd
  /^sd$/i, // sd

  // VR tags
  /^(?:ps)?vr$/i, // vr, psvr
  /^oculus$/i,
  /^gearvr$/i,
  /^go$/i,
  /^vive$/i,
  /^rift$/i,

  // request
  /^req(?:uest)?$/i, // req, request

  // encoders
  /^[xh]\.?26[45]$/i, // x264, h265, h.265, etc
  /^hevc$/i,
  /^avc$/i,

  // containers (that might themselves be encoders too)
  /^mp4$/i,
  /^mkv$/i,
  /^avi$/i,
  /^mov$/i,
  /^wmv$/i,
  /^flv$/i,
  /^webm$/i,
  /^mpeg$/i,
  /^mpg$/i,
  /^vob$/i,
  /^divx$/i,
  /^xvid$/i
];

function areVariationTokens(tokens: Set<string>): boolean {
  return [...tokens].every((token) =>
    variationTokenPatterns.some((pattern) => pattern.test(token))
  );
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
  variationString: string;
};

/**
 * Equivalent to a.difference(b), but case-insensitive.
 * @param a The set whose difference to calculate
 * @param b The set to subtract from a
 * @returns The set of elements in a that are not in b, case-insensitive
 */
function caseInsensitiveDifference(a: Set<string>, b: Set<string>): Set<string> {
  const difference = new Set<string>();
  const bLower = new Set([...b].map((token) => token.toLowerCase()));
  for (const token of a) {
    const tokenLower = token.toLowerCase();
    if (!bLower.has(tokenLower)) {
      difference.add(token);
    }
  }

  return difference;
}

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

type PositionedToken = {
  token: string;
  position: number;
};

function toTorrentInGroup(group: TokenizedTorrent[]): TorrentInGroup[] {
  const g = [];
  for (let i = 0; i < group.length; i++) {
    const thisTorrentTokens = group[i].tokens;
    const thisTorrentTokenPositions = new Map(
      [...thisTorrentTokens].map((token, idx) => [token, idx] as [string, number])
    );
    let uniqueTokens: PositionedToken[] = [];
    for (let j = 0; j < group.length; j++) {
      if (i === j) {
        continue;
      }
      const otherTorrentTokens = group[j].tokens;

      // unique token stuff. respects position of the token in the original
      // name.
      //
      // here be dragons. wild, and probably ineffecient, but there are so many
      // angles in which we want to interpret tokens:
      // - the token string itself
      // - the position of the token in the original string
      // - the token with case-sensitivity or not
      // - whether the token matches other tokens in other names
      const difference = caseInsensitiveDifference(thisTorrentTokens, otherTorrentTokens);
      const positionedTokens = [...difference].map((token) => ({
        token,
        position: thisTorrentTokenPositions.get(token)!
      }));
      for (const token of positionedTokens) {
        if (!uniqueTokens.some((t) => t.token === token.token)) {
          uniqueTokens.push(token);
        }
      }
    }

    const uniqueTokenString = uniqueTokens
      .sort((a, b) => {
        return a.position - b.position;
      })
      .map((t) => t.token)
      .join(' ');
    g.push({ torrent: group[i].torrent, variationString: uniqueTokenString });
  }

  return g;
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
 *    - Any of the left or right difference tokens is not a "variation" token
 *      (resolution, encoder, container, VR tag, etc)
 *
 *    Otherwise, add the torrent to the group.
 * 4. If no group is found, create a new group with just that torrent.
 * 5. Return the groups.
 *
 * @param torrents Array of torrents to group
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
        // const intersection = torrent.tokens.intersection(groupTorrent.tokens);
        const intersection = caseInsensitiveIntersection(torrent.tokens, groupTorrent.tokens);
        if (intersection.size === 0) {
          isSimilarToGroup = false;
          break;
        }

        // don't need caseInsensitiveDifference here, our regexes are case-insensitive
        const difference = torrent.tokens.difference(groupTorrent.tokens);
        if (!areVariationTokens(difference)) {
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

  // convert the groups to TorrentInGroup objects. TorrentInGroup is a Torrent
  // with a uniqueTokenString, which is the difference between the tokens of the
  // current torrent and the tokens of all other torrents in the group. We need
  // to do this here, and not in the main loop, because the groups aren't
  // finalized until the end.
  return groups.map(toTorrentInGroup);
}
