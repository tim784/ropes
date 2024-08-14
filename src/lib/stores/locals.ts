/**
 * A store for local stuff, like credits, upload bytes, etc. This data comes
 * from the page, but has two differences:
 *
 * 1. Is shared by multiple tabs. With a localStorage backing, we can push the
 *    latest data to all tabs.
 * 2. Can be mutated (if appropriate). For example, we can decrement the slot
 *    count when one is used.
 */
import { makeAppIdentifier } from '$src/lib/constants';
import { isSupportedPage, page } from './page';
import { localStorageBacked } from './localStorageBacked';
import { type Alert } from '$gather/me';

type Locals = {
  inviteCount: number;
  creditCount: number;
  uploadedBytes: string;
  downloadedBytes: string;
  ratio: number;
  slotCount: number;
  torrentsSeedingCount: number;
  torrentsLeechingCount: number;
  alerts: Alert[];
};

function defaultLocals(): Locals {
  return {
    inviteCount: 0,
    creditCount: 0,
    uploadedBytes: '0 B',
    downloadedBytes: '0 B',
    ratio: 0,
    slotCount: 0,
    torrentsLeechingCount: 0,
    torrentsSeedingCount: 0,
    alerts: []
  };
}

const key = makeAppIdentifier('locals');

function createLocalsStore() {
  const store = localStorageBacked<Locals>(key, defaultLocals, JSON.stringify, (str) => ({
    ...defaultLocals(),
    ...JSON.parse(str)
  }));
  const { subscribe, update } = store;

  page.subscribe(async (page) => {
    if (isSupportedPage(page)) {
      const data = await page.dataPromise;
      const me = data.me;
      update((stats) => ({
        ...stats,
        inviteCount: me.inviteCount,
        creditCount: me.creditCount,
        uploadedBytes: me.uploadedBytes,
        downloadedBytes: me.downloadedBytes,
        ratio: me.ratio,
        slotCount: me.slotCount,
        torrentsLeechingCount: me.torrentsLeechingCount,
        torrentsSeedingCount: me.torrentsSeedingCount,
        alerts: me.alerts
      }));
    }
  });

  return {
    subscribe,

    /** Use a slot. This stat is unique in that it's mutable by page actions
     * (e.g., spending a lot on a download) */
    useSlot: () => {
      update((stats) => {
        if (stats.slotCount === 0) {
          throw new Error('No slots left');
        }
        return {
          ...stats,
          slotCount: stats.slotCount - 1
        };
      });
    }
  };
}

/**
 * A store for updating stats, like credits/upload bytes/etc, that should be shared among different
 * browser tabs.
 */
export const locals = createLocalsStore();
