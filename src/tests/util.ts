import { type Torrent, DoubleseedState, InteractionState, FreeleechState } from '$lib/torrent';

/**
 * Make a test torrent bogus/falsy/nullish data. You should override the fields
 * for specific tests.
 */
export function makeTestTorrent(): Torrent {
  return {
    id: '1',
    name: '',
    pageHref: '/foo',
    imageHref: '/image',
    downloadHref: null,
    freeleechHref: null,
    doubleseedHref: null,
    uploadDateTime: new Date(),
    size: '1b',
    snatches: 1,
    seeders: 1,
    leechers: 1,
    uploader: null,
    isWarned: false,
    freeleechState: FreeleechState.None,
    doubleseedState: DoubleseedState.None,
    interactionState: InteractionState.None,
    tags: null,
    isBookmarked: false
  };
}
