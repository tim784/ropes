import {
  type Torrent,
  groupTorrents,
  type TorrentInGroup,
  DoubleseedState,
  InteractionState,
  FreeleechState
} from '$lib/torrent';
import { expect, test } from 'vitest';

/**
 * Make a test torrent with a given name.
 */
function tt(name: string): Torrent {
  return {
    id: '1',
    name,
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

function expectGroupsEqual(actual: TorrentInGroup[][], expected: Torrent[][]) {
  const actualNames = actual.map((g) => g.map((t) => t.torrent.name));
  const expectedNames = expected.map((g) => g.map((t) => t.name));
  expect(actualNames).toEqual(expectedNames);
}

function expectUniqueTokenStringEqual(actual: TorrentInGroup[][], expected: string[][]) {
  for (let groupIdx = 0; groupIdx < actual.length; groupIdx++) {
    for (let torrentIdx = 0; torrentIdx < actual[groupIdx].length; torrentIdx++) {
      expect(actual[groupIdx][torrentIdx].variationString).toBe(expected[groupIdx][torrentIdx]);
    }
  }
}

// these cases are real life examples of that _weren't_ grouped correctly during
// development, but were later fixed. any further counterexamples should be
// added here and fixed in the implementation.
test.each([
  [
    [
      {
        name: 'RealJamVR - Ebony Temptress Maid - Kona Jade (Oculus 8K)',
        uniqueTokenString: 'Oculus 8K'
      },
      {
        name: 'RealJamVR - Ebony Temptress Maid - Kona Jade (GearVR)',
        uniqueTokenString: 'GearVR'
      },
      {
        name: 'RealJamVR - Ebony Temptress Maid - Kona Jade (Oculus, Go 4K)',
        uniqueTokenString: 'Oculus Go 4K'
      }
    ]
  ],

  [
    [
      {
        name: 'SLROriginals - GFE: Retreat - Angelina Moon (Oculus 8K)',
        uniqueTokenString: 'Oculus 8K'
      },
      {
        name: 'SLROriginals - GFE: Retreat - Angelina Moon (Oculus, Go 4K)',
        uniqueTokenString: 'Oculus Go 4K'
      },
      { name: 'SLROriginals - GFE: Retreat - Angelina Moon (GearVR)', uniqueTokenString: 'GearVR' }
    ]
  ],

  // note that Oculus does _not_ show up in the uniqueTokenStrings here because
  // it is shared by all torrents.
  [
    [
      {
        name: '[WankzVR] Reflex Action - Coco Lovelock (Oculus/Vive) 4K H.265 2300P',
        uniqueTokenString: 'Vive 4K H.265 2300P'
      },
      { name: 'WankzVR - Reflex Action - Coco Lovelock (Oculus 7K)', uniqueTokenString: '7K' },
      {
        name: 'WankzVR - Reflex Action - Coco Lovelock (Oculus, Go 4K)',
        uniqueTokenString: 'Go 4K'
      }
    ]
  ],

  // ditto for this one
  [
    [
      {
        name: 'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 8K)',
        uniqueTokenString: '8K'
      },
      {
        name: 'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 6K)',
        uniqueTokenString: '6K'
      },
      {
        name: 'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus, Go 4K)',
        uniqueTokenString: 'Go 4K'
      }
    ]
  ],

  // and ditto
  [
    [
      {
        name: 'VRConk - Overwatch: Mei (A Porn Parody) - Leana Lovings (Oculus 8K)',
        uniqueTokenString: '8K'
      },
      {
        name: 'VRConk - Overwatch: Mei (A Porn Parody) - Leana Lovings (Oculus 6K)',
        uniqueTokenString: '6K'
      },
      {
        name: 'VRConk - Overwatch: Mei (A Porn Parody) - Leana Lovings (Oculus, Go 4K)',
        uniqueTokenString: 'Go 4K'
      }
    ]
  ],

  [
    [
      {
        name: 'FuckPassVR - Side Squeeze in Cali - Sofi Vega (Oculus 8K, UHD)',
        uniqueTokenString: 'Oculus 8K UHD'
      },
      {
        name: 'FuckPassVR - Side Squeeze in Cali - Sofi Vega (Oculus 8K)',
        uniqueTokenString: 'Oculus 8K'
      },
      {
        name: 'FuckPassVR - Side Squeeze in Cali - Sofi Vega (PSVR, GearVR)',
        uniqueTokenString: 'PSVR GearVR'
      }
    ]
  ]
] as { name: string; uniqueTokenString: string }[][][])(
  'should group similar torrents %s',
  (testCase) => {
    const torrents = testCase.map((tc) => tc.name).map(tt);
    const groups = groupTorrents(torrents);
    expectGroupsEqual(groups, [torrents]);
    expectUniqueTokenStringEqual(groups, [testCase.map((tc) => tc.uniqueTokenString)]);
  }
);

test('should order properly', (t) => {
  const groupATorrent1 = tt(
    'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 8K)'
  );
  const groupATorrent2 = tt(
    'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 6K)'
  );
  const groupATorrent3 = tt(
    'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus, Go 4K)'
  );

  const groupBTorrent1 = tt(
    '[BradMontana] Alicia Ribeiro - Black girl from Rio de Janeiro enjoyed sitting on a dick 2024 [1080p]'
  );

  const groupCTorrent1 = tt('CzechVR 716 - Summer Anal - Daruma Rai (Oculus, Go 4K)');
  const groupCTorrent2 = tt('CzechVR 716 - Summer Anal - Daruma Rai (GearVR)');

  const groupDTorrent1 = tt(
    '[TabooHeat] Lory Lace in Horny Step Aunt Vol 2 (Part 2-3) (2023) [720p]'
  );
  const groupDTorrent2 = tt(
    '[TabooHeat] Lory Lace in Horny Step Aunt Vol 2 (Part 2-3) (2023) [1080p]'
  );
  const groupDTorrent3 = tt(
    '[TabooHeat] Lory Lace in Horny Step Aunt Vol 2 (Part 2-3) (2023) [2160p]'
  );

  const groupETorrent1 = tt('Visiting My Anal In-Laws 2160p WEB-DL MP4-XXXTC');

  const groupFTorrent1 = tt('[GotFilled] Megan Fiore - Pussy Gets Messy 2024 [2160p]');
  const groupFTorrent2 = tt('[GotFilled] Megan Fiore - Pussy Gets Messy 2024 [1080p]');

  const groupHTorrent1 = tt('[Brazzers] Ivy Maddox - Anal For Ivy - 2024-08-25 - 1080p');

  // same as above, but subsequent group members may be out of order
  const torrents = [
    groupATorrent1,
    groupBTorrent1,
    groupATorrent2,
    groupATorrent3,
    groupCTorrent1,
    groupCTorrent2,
    groupDTorrent1,
    groupETorrent1,
    groupFTorrent1,
    groupDTorrent2,
    groupDTorrent3,
    groupFTorrent2,
    groupHTorrent1
  ];

  const expectedGroups = [
    [groupATorrent1, groupATorrent2, groupATorrent3],
    [groupBTorrent1],
    [groupCTorrent1, groupCTorrent2],
    [groupDTorrent1, groupDTorrent2, groupDTorrent3],
    [groupETorrent1],
    [groupFTorrent1, groupFTorrent2],
    [groupHTorrent1]
  ];

  const groups = groupTorrents(torrents);
  expectGroupsEqual(groups, expectedGroups);
});
