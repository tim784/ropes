import { User } from './user';
import { querySelector, querySelectorAll, removeNonNumericChars } from './util';

export type Alert = {
  label: string;
  href: string;
};

export class Me extends User {
  constructor(
    name: string,
    id: string,
    public authKey: string,
    public inviteCount: number,
    public creditCount: number,
    public uploadedBytes: string,
    public downloadedBytes: string,
    public ratio: number,
    public slotCount: number,
    public torrentsSeedingCount: number,
    public torrentsLeechingCount: number,
    public alerts: Alert[] = []
  ) {
    super(name, id);
  }
}

// pre-compile the regex
const AUTH_KEY_AND_ID_REGEX = /var authkey = "(?<authKey>[^"]+)";\n\s+var userid =\s(?<id>[^;]+);/m;

export function getAuthKeyAndId(doc: Document): { authKey: string; id: string } {
  for (const script of querySelectorAll('script', doc)) {
    const match = script.textContent?.match(AUTH_KEY_AND_ID_REGEX);
    if (match?.groups) {
      const { authKey, id } = match.groups;
      return {
        authKey,
        id
      };
    }
  }
  throw new Error('Document should have a script defining auth key and id');
}

function getName(doc: Document): string {
  const nameElement = querySelector('.username', doc);
  return nameElement!.textContent!.trim();
}

function getInviteCount(doc: Document): number {
  const inviteCountElement = querySelector('span#nav_invites_r', doc);
  if (!inviteCountElement) {
    return 0;
  }
  return Number(inviteCountElement.textContent?.trim() ?? 0);
}

type StatsBlockElement = HTMLElement;

function getStatsBlock(doc: Document): StatsBlockElement {
  return querySelector('.userinfo_stats', doc)! as StatsBlockElement;
}

function getCreditCount(doc: Document): number {
  const creditCountElement = querySelector('#stats_credits', doc);
  const numeric = removeNonNumericChars(creditCountElement?.textContent?.trim() ?? '0');
  return Number(numeric);
}

function getUploadedBytes(statsBlock: StatsBlockElement): string {
  const uploadElement = querySelector(
    'tr:nth-child(1) > td:nth-child(4) > span:nth-child(1)',
    statsBlock
  );
  return uploadElement?.textContent?.trim() ?? '0 bytes';
}

function getDownloadedBytes(statsBlock: StatsBlockElement): string {
  const downloadElement = querySelector(
    'tr:nth-child(2) > td:nth-child(4) > span:nth-child(1)',
    statsBlock
  );
  return downloadElement?.textContent?.trim() ?? '0 bytes';
}

function getRatio(statsBlock: StatsBlockElement): number {
  const ratioElement = querySelector('tr:last-of-type td:last-of-type', statsBlock);
  return Number(ratioElement?.textContent?.trim() ?? 0);
}

function getSlotCount(statsBlock: StatsBlockElement): number {
  const slotCountElement = querySelector(
    'tr:nth-child(2) > td:nth-child(2) > span:nth-child(1)',
    statsBlock
  );
  return Number(slotCountElement?.textContent?.trim() ?? 0);
}

function getTorrentsSeedingCount(doc: Document): number {
  const torrentsSeedingElement = querySelector('#nav_seeding_r', doc);
  return Number(torrentsSeedingElement?.textContent?.trim() ?? 0);
}

function getTorrentsLeechingCount(doc: Document): number {
  const torrentsLeechingElement = querySelector('#nav_leeching_r', doc);
  return Number(torrentsLeechingElement?.textContent?.trim() ?? 0);
}

function getAlerts(doc: Document): Alert[] {
  return querySelectorAll('#alerts .alertbar', doc)?.map((alertElement) => {
    const a = querySelector('a', alertElement);
    const label = a?.textContent?.trim() ?? '';
    const href = a?.getAttribute('href') ?? '';
    return { label, href };
  });
}

export function getMe(doc: Document): Me {
  const statsBlock = getStatsBlock(doc);
  const { authKey, id } = getAuthKeyAndId(doc);
  return new Me(
    getName(doc),
    id,
    authKey,
    getInviteCount(doc),
    getCreditCount(doc),
    getUploadedBytes(statsBlock),
    getDownloadedBytes(statsBlock),
    getRatio(statsBlock),
    getSlotCount(statsBlock),
    getTorrentsSeedingCount(doc),
    getTorrentsLeechingCount(doc),
    getAlerts(doc)
  );
}
