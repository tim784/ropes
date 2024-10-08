import { querySelector, querySelectorAll, removeNonNumericChars } from './util';
import { parseEmpDate } from '../util';
import { User } from './user';
import { DoubleseedState, FreeleechState, InteractionState, type Torrent } from '../torrent';

type TorrentElement = Element;
type TorrentNameColumnElement = Element;

function getNthColumnText(torrentElement: TorrentElement, n: number): string {
  return querySelector(`td:nth-of-type(${n})`, torrentElement)!.textContent!.trim();
}

function getTorrentRows(doc: Document): TorrentElement[] {
  return querySelectorAll('#torrent_table tr.torrent', doc);
}

function getTorrentNameColumn(torrentElement: TorrentElement) {
  return querySelector('td:nth-of-type(2)', torrentElement) as TorrentNameColumnElement;
}

function getTorrentName(nameColumn: TorrentNameColumnElement): string {
  return querySelector(':scope > a', nameColumn)?.textContent?.trim() || '';
}

function getTorrentImageHref(nameColumn: TorrentNameColumnElement): string | null {
  const script = querySelector('script', nameColumn);
  if (script === null) {
    return null;
  }
  const textContent = script.textContent!;
  const match = textContent.match(/(?<=src=\\").+?(?=\\"><\\\/td>)/gm)!;
  const escapedHref = match?.[0];
  const unescapedHref = escapedHref!.replace(/\\/g, '');

  return unescapedHref;
}

function getTorrentUploadDateTime(torrentElement: TorrentElement): Date {
  const dateColumn = querySelector('td:nth-of-type(5) span', torrentElement)!;
  // e.g. Jul 08 2024, 00:28
  // times are local (from setting in settings page i think?)
  let datetime = parseEmpDate(dateColumn.getAttribute('title')!);

  if (Number.isNaN(datetime.valueOf())) {
    // this means the user has set their "Time Style" setting to "Display times
    // as date and time". we can parse this, we just instead have to look at the
    // textContent of the span. this setting is probably uncommon.
    datetime = parseEmpDate(dateColumn.textContent!);
  }

  return datetime;
}

function getTorrentSize(torrentElement: TorrentElement): string {
  const size = getNthColumnText(torrentElement, 6);
  return size;
}

function getTorrentSnatches(torrentElement: TorrentElement): number {
  const snatches = getNthColumnText(torrentElement, 7);

  return parseInt(removeNonNumericChars(snatches));
}

function getTorrentSeeders(torrentElement: TorrentElement): number {
  const seeders = getNthColumnText(torrentElement, 8);
  return parseInt(removeNonNumericChars(seeders));
}

function getTorrentLeechers(torrentElement: TorrentElement): number {
  const leechers = getNthColumnText(torrentElement, 9);
  return parseInt(removeNonNumericChars(leechers));
}

function getTorrentUploader(torrentElement: TorrentElement): User | null {
  const uploaderColumn = querySelector('td:nth-of-type(10)', torrentElement)!;
  const uploaderAnchor = querySelector('a', uploaderColumn);
  if (uploaderAnchor === null) {
    return null;
  }
  return User.fromNameAndHref(
    uploaderAnchor.textContent!.trim(),
    uploaderAnchor.getAttribute('href')!
  );
}

function getPageHref(nameColumn: TorrentNameColumnElement): string {
  return querySelector(':scope > a', nameColumn)?.getAttribute('href') as string;
}

function getDownloadHref(nameColumn: TorrentNameColumnElement): string | null {
  return (
    querySelector('a[href*="/torrents.php?action=download"]', nameColumn)?.getAttribute('href') ||
    null
  );
}

function getIsWarned(nameColumn: TorrentNameColumnElement): boolean {
  return querySelector('i.warned', nameColumn) !== null;
}

function getFreeleechState(nameColumn: TorrentNameColumnElement): FreeleechState {
  if (querySelector('i.unlimited_leech', nameColumn) !== null) {
    return FreeleechState.Unlimited;
  } else if (querySelector('i.sitewide_leech', nameColumn) !== null) {
    return FreeleechState.Sitewide;
  } else if (querySelector('i.personal_leech', nameColumn) !== null) {
    return FreeleechState.Personal;
  }
  return FreeleechState.None;
}

function getDoubleseedState(nameColumn: TorrentNameColumnElement): DoubleseedState {
  if (querySelector('i.personal_seed', nameColumn) !== null) {
    return DoubleseedState.Personal;
  } else if (
    querySelector(
      // this is a guess on class name... i've never seen this in practice.
      'i.sitewide_seed',
      nameColumn
    ) !== null
  ) {
    return DoubleseedState.Sitewide;
  }
  return DoubleseedState.None;
}

function getInteractionState(nameColumn: TorrentNameColumnElement): InteractionState {
  if (querySelector('i.grabbed', nameColumn) !== null) {
    return InteractionState.Grabbed;
  } else if (querySelector('i.seeding', nameColumn) !== null) {
    return InteractionState.Seeding;
  } else if (querySelector('i.snatched', nameColumn) !== null) {
    return InteractionState.Snatched;
  } else if (querySelector('i.leeching', nameColumn) !== null) {
    return InteractionState.Leeching;
  }
  return InteractionState.None;
}

function getTags(nameColumn: TorrentNameColumnElement): string[] | null {
  const tagsContainer = querySelector('.tags', nameColumn);
  if (tagsContainer === null) {
    return null;
  }
  const tagsText = tagsContainer.textContent!.trim();
  const split = tagsText!.split(/[\s,]+/);
  return split;
}

function getId(pageHref: string): string {
  const url = new URL(pageHref, 'http://example.com');
  return url.searchParams.get('id')!;
}

function getIsBookmarked(nameColumn: TorrentNameColumnElement): boolean {
  return querySelector('.bookmarked', nameColumn) !== null;
}

const USE_TOKEN_PARAM = 'usetoken';
enum Token {
  Freeleech = '1',
  Doubleseed = '2'
}

function getTokenedHref(downloadHref: string | null, token: Token) {
  if (downloadHref === null) {
    return null;
  }
  const url = new URL(downloadHref, 'http://example.com');
  url.searchParams.set(USE_TOKEN_PARAM, token);
  return url.pathname + url.search;
}

function getFreeleechHref(downloadHref: string | null) {
  return getTokenedHref(downloadHref, Token.Freeleech);
}

function getDoubleseedHref(downloadHref: string | null) {
  return getTokenedHref(downloadHref, Token.Doubleseed);
}

export function getTorrents(doc: Document): Torrent[] {
  return getTorrentRows(doc).map((torrentElement) => {
    const nameColumn = getTorrentNameColumn(torrentElement);
    const pageHref = getPageHref(nameColumn);
    const downloadHref = getDownloadHref(nameColumn);

    return {
      name: getTorrentName(nameColumn),
      id: getId(pageHref),
      imageHref: getTorrentImageHref(nameColumn),
      pageHref,
      downloadHref: downloadHref,
      freeleechHref: getFreeleechHref(downloadHref),
      doubleseedHref: getDoubleseedHref(downloadHref),
      uploadDateTime: getTorrentUploadDateTime(torrentElement),
      size: getTorrentSize(torrentElement),
      snatches: getTorrentSnatches(torrentElement),
      seeders: getTorrentSeeders(torrentElement),
      leechers: getTorrentLeechers(torrentElement),
      uploader: getTorrentUploader(torrentElement),
      isWarned: getIsWarned(nameColumn),
      freeleechState: getFreeleechState(nameColumn),
      doubleseedState: getDoubleseedState(nameColumn),
      interactionState: getInteractionState(nameColumn),
      tags: getTags(nameColumn),
      isBookmarked: getIsBookmarked(nameColumn)
    };
  });
}
