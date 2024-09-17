import {
  type Torrent,
  groupTorrents,
  type TorrentInGroup,
  makeDefaultVariantString
} from '$lib/torrent';
import { expect, test } from 'vitest';
import { makeTestTorrent } from './util';

/**
 * Make a test torrent with a given name.
 */
function makeTestTorrentWithName(name: string): Torrent {
  return {
    ...makeTestTorrent(),
    name
  };
}

function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length === 0) return [[]];

  const [first, ...rest] = arr;
  const withoutFirst = getPermutations(rest);
  const withFirst: T[][] = [];

  withoutFirst.forEach((subPerm) => {
    for (let i = 0; i <= subPerm.length; i++) {
      const permWithFirst = [...subPerm.slice(0, i), first, ...subPerm.slice(i)];
      withFirst.push(permWithFirst);
    }
  });

  return withFirst;
}

function expectGroupCountEqualOrderInsensitive(names: string[], expectedGroupCount: number) {
  for (const perm of getPermutations(names)) {
    const torrents = perm.map(makeTestTorrentWithName);
    const groups = groupTorrents(torrents);
    expect(groups.length).toBe(expectedGroupCount);
  }
}

function expectGroupsEqual(actual: TorrentInGroup[][], expected: Torrent[][]) {
  const actualNames = actual.map((g) => g.map((t) => t.torrent.name));
  const expectedNames = expected.map((g) => g.map((t) => t.name));
  expect(actualNames).toEqual(expectedNames);
}

function expectVariantStringEqual(actual: TorrentInGroup[][], expected: string[][]) {
  for (let groupIdx = 0; groupIdx < actual.length; groupIdx++) {
    for (let torrentIdx = 0; torrentIdx < actual[groupIdx].length; torrentIdx++) {
      expect(actual[groupIdx][torrentIdx].variantString).toBe(expected[groupIdx][torrentIdx]);
    }
  }
}

// these cases are real life examples of that _weren't_ grouped correctly during
// development, but were later fixed. any further counterexamples should be
// added here and fixed in the implementation.
test.for([
  [
    {
      name: 'RealJamVR - Ebony Temptress Maid - Kona Jade (Oculus 8K)',
      variantString: 'Oculus 8K'
    },
    {
      name: 'RealJamVR - Ebony Temptress Maid - Kona Jade (GearVR)',
      variantString: 'GearVR'
    },
    {
      name: 'RealJamVR - Ebony Temptress Maid - Kona Jade (Oculus, Go 4K)',
      variantString: 'Oculus Go 4K'
    }
  ],

  [
    {
      name: 'SLROriginals - GFE: Retreat - Angelina Moon (Oculus 8K)',
      variantString: 'Oculus 8K'
    },
    {
      name: 'SLROriginals - GFE: Retreat - Angelina Moon (Oculus, Go 4K)',
      variantString: 'Oculus Go 4K'
    },
    { name: 'SLROriginals - GFE: Retreat - Angelina Moon (GearVR)', variantString: 'GearVR' }
  ],

  [
    {
      name: '[WankzVR] Reflex Action - Coco Lovelock (Oculus/Vive) 4K H.265 2300P',
      variantString: 'Oculus Vive 4K H.265 2300P'
    },
    { name: 'WankzVR - Reflex Action - Coco Lovelock (Oculus 7K)', variantString: 'Oculus 7K' },
    {
      name: 'WankzVR - Reflex Action - Coco Lovelock (Oculus, Go 4K)',
      variantString: 'Oculus Go 4K'
    }
  ],

  [
    {
      name: 'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 8K)',
      variantString: 'Oculus 8K'
    },
    {
      name: 'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 6K)',
      variantString: 'Oculus 6K'
    },
    {
      name: 'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus, Go 4K)',
      variantString: 'Oculus Go 4K'
    }
  ],

  [
    {
      name: 'VRConk - Overwatch: Mei (A Porn Parody) - Leana Lovings (Oculus 8K)',
      variantString: 'Oculus 8K'
    },
    {
      name: 'VRConk - Overwatch: Mei (A Porn Parody) - Leana Lovings (Oculus 6K)',
      variantString: 'Oculus 6K'
    },
    {
      name: 'VRConk - Overwatch: Mei (A Porn Parody) - Leana Lovings (Oculus, Go 4K)',
      variantString: 'Oculus Go 4K'
    }
  ],

  [
    {
      name: 'FuckPassVR - Side Squeeze in Cali - Sofi Vega (Oculus 8K, UHD)',
      variantString: 'Oculus 8K UHD'
    },
    {
      name: 'FuckPassVR - Side Squeeze in Cali - Sofi Vega (Oculus 8K)',
      variantString: 'Oculus 8K'
    },
    {
      name: 'FuckPassVR - Side Squeeze in Cali - Sofi Vega (PSVR, GearVR)',
      variantString: 'PSVR GearVR'
    }
  ],

  [
    {
      name: '[XXXJobInterviews] Isabel Love - Double Penetration (2024-01-19) 1080p, x265 reencode',
      variantString: '1080p x265'
    },
    {
      name: '[XXXJobInterviews] Isabel Love - Double Penetration (2024-01-19) 1080p',
      variantString: '1080p'
    }
  ],

  [
    {
      name: 'Slammed brides Goes Wet, Nuria Millan 6on1, ATM, Balls Deep, DAP, Extreme Deepthroat, Rough Sex, Big Gapes, ButtRose, Pee Drink/Shower, Cum in Mouth, Swallow GIO2797 [720p]',
      variantString: '720p'
    },
    {
      name: 'Slammed brides Goes Wet, Nuria Millan 6on1, ATM, Balls Deep, DAP, Extreme Deepthroat, Rough Sex, Big Gapes, ButtRose, Pee Drink/Shower, Cum in Mouth, Swallow GIO2797 [1080p]',
      variantString: '1080p'
    }
  ],

  [
    { name: '[REQ] Flesh Hunter 1 (2002) 1080p (AI Upscale + QTGMC)', variantString: '1080p' },
    { name: '[REQ] Flesh Hunter 1 (2002) 720p (AI Upscale + QTGMC)', variantString: '720p' }
  ],

  [
    {
      name: 'NaughtyAmerica3D - Naughty 4-some with bikini clad babes Ella Reese, Kayley Gunner, and Kendra Sunderland (Apple Vision Pro 1080p)',
      variantString: 'Apple Vision Pro 1080p'
    },
    {
      name: 'NaughtyAmerica3D - Naughty 4-some with bikini clad babes Ella Reese, Kayley Gunner, and Kendra Sunderland (Oculus 1080p)',
      variantString: 'Oculus 1080p'
    }
  ]
] as { name: string; variantString: string }[][])(
  'should group similar torrents %s',
  (testCase) => {
    const torrents = testCase.map((tc) => tc.name).map(makeTestTorrentWithName);
    const groups = groupTorrents(torrents);
    expectGroupsEqual(groups, [torrents]);
    expectVariantStringEqual(groups, [testCase.map((tc) => tc.variantString)]);
    expectGroupCountEqualOrderInsensitive(
      testCase.map((tc) => tc.name),
      1
    );
  }
);

test.for([
  [
    '[ULTRAFILMS.COM] Image siterip , 626 sets [2021, 2022, 2023]',
    '[ULTRAFILMS.COM] Image siterip , 406 sets [2019, 2020]'
  ],
  ['Sirina news Amateur Pack', 'Sirina news Amateur Pack Part 2']
])('should not group dissimilar torrents %s', (names) => {
  const torrents = names.map(makeTestTorrentWithName);
  const groups = groupTorrents(torrents);
  expectGroupsEqual(
    groups,
    torrents.map((t) => [t])
  );
  expectGroupCountEqualOrderInsensitive(names, names.length);
});

test.for([
  [
    'Same name',
    'Same name', // not a typo, same name repeated.
    '[REQ] Same name',
    '[Request] Same name',
    '[reencode] Same name',
    '[re-encode] Same name',
    '[AI Upscale] Same name'
  ]
])('should use default variant string %s', (names) => {
  const torrents = names.map(makeTestTorrentWithName);
  const groups = groupTorrents(torrents);
  expectVariantStringEqual(groups, [names.map((_, i) => makeDefaultVariantString(i + 1))]);
  expectGroupCountEqualOrderInsensitive(names, 1);
});

test('should order properly', () => {
  const groupATorrent1 = makeTestTorrentWithName(
    'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 8K)'
  );
  const groupATorrent2 = makeTestTorrentWithName(
    'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus 6K)'
  );
  const groupATorrent3 = makeTestTorrentWithName(
    'VRBangers - Life Is Short. Have An Affair! - Erin Everheart (Oculus, Go 4K)'
  );

  const groupBTorrent1 = makeTestTorrentWithName(
    '[BradMontana] Alicia Ribeiro - Black girl from Rio de Janeiro enjoyed sitting on a dick 2024 [1080p]'
  );

  const groupCTorrent1 = makeTestTorrentWithName(
    'CzechVR 716 - Summer Anal - Daruma Rai (Oculus, Go 4K)'
  );
  const groupCTorrent2 = makeTestTorrentWithName('CzechVR 716 - Summer Anal - Daruma Rai (GearVR)');

  const groupDTorrent1 = makeTestTorrentWithName(
    '[TabooHeat] Lory Lace in Horny Step Aunt Vol 2 (Part 2-3) (2023) [720p]'
  );
  const groupDTorrent2 = makeTestTorrentWithName(
    '[TabooHeat] Lory Lace in Horny Step Aunt Vol 2 (Part 2-3) (2023) [1080p]'
  );
  const groupDTorrent3 = makeTestTorrentWithName(
    '[TabooHeat] Lory Lace in Horny Step Aunt Vol 2 (Part 2-3) (2023) [2160p]'
  );

  const groupETorrent1 = makeTestTorrentWithName('Visiting My Anal In-Laws 2160p WEB-DL MP4-XXXTC');

  const groupFTorrent1 = makeTestTorrentWithName(
    '[GotFilled] Megan Fiore - Pussy Gets Messy 2024 [2160p]'
  );
  const groupFTorrent2 = makeTestTorrentWithName(
    '[GotFilled] Megan Fiore - Pussy Gets Messy 2024 [1080p]'
  );

  const groupHTorrent1 = makeTestTorrentWithName(
    '[Brazzers] Ivy Maddox - Anal For Ivy - 2024-08-25 - 1080p'
  );

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
