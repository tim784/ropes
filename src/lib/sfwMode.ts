import stockPhotos from '$src/stockPhotos.json';
import { type Torrent } from './torrent';
import { User } from './gather/user';

const names = [
  'Morning Glow Over the Hills',
  'Reflections in the Urban Jungle',
  "Nature's Palette of Colors",
  'Serene Waters at Dusk',
  'Rustic Charm of the Countryside',
  'City Lights in the Night Sky',
  'Autumn Leaves in Full Bloom',
  'Timeless Moments Captured',
  'Tranquil Horizon at Sunrise',
  'Dynamic Shadows in Motion',
  'Burst of Color in Nature',
  'Elegant Silhouette at Sunset',
  'Playful Breeze Through the Trees',
  'Romantic Sunset on the Beach',
  'Textured Landscapes of the Desert',
  'Dreamy Pathways in the Woods',
  'Bold Contrasts in Black and White',
  'Abstract Lines and Patterns',
  'Enchanted Forest in Twilight',
  'Coastal Serenity by the Sea',
  'Golden Light on a Misty Morning',
  'Reflections of Skyscrapers in Water',
  "Blossoms in Nature's Finest Colors",
  'Calm Waters Under a Cloudy Sky',
  'Rustic Barn in Rolling Meadows',
  'Neon Lights in a Bustling City',
  'Fallen Autumn Leaves on a Path',
  'Vintage Moments of Yesteryear',
  'Sun Rising Over a Tranquil Lake',
  'Play of Shadows on an Old Wall',
  'Explosion of Colors in a Garden',
  'Graceful Silhouette Against a Sunset',
  'Gentle Breeze Through Wheat Fields',
  'Lovers Embracing at Golden Hour',
  'Rugged Landscapes and Desert Textures',
  'Enchanted Forest Path at Twilight',
  'Stark Contrasts in Light and Shadow',
  'Geometric Abstracts and Urban Lines',
  'Twilight Enchantment in a Mystic Forest',
  'Serene Seascape with Waves Gently Lapping'
];
let curNameIndex = 0;

export function getSfwName(): string {
  const name = names[curNameIndex];
  curNameIndex = (curNameIndex + 1) % names.length;
  return name;
}

const tags = [
  'vibrant',
  'serene',
  'candid',
  'dramatic',
  'rustic',
  'abstract',
  'urban',
  'minimalist',
  'natural',
  'vintage',
  'bright',
  'moody',
  'colorful',
  'elegant',
  'playful',
  'romantic',
  'dynamic',
  'textured',
  'atmospheric',
  'artistic',
  'high-contrast',
  'macro',
  'timeless',
  'high-speed',
  'panoramic',
  'monochrome',
  'bokeh',
  'underexposed',
  'overexposed',
  'long-exposure'
];
let curTagIndex = 0;

export function getSfwTag(): string {
  const adjective = tags[curTagIndex];
  curTagIndex = (curTagIndex + 1) % tags.length;
  return adjective;
}

let curImageIndex = 0;
export function getSfwImageUrl(): string {
  const url = stockPhotos[curImageIndex];
  curImageIndex = (curImageIndex + 1) % stockPhotos.length;
  return url;
}

export const sfwAppSubtitle = 'Free stock photos, fast.';

type WeightedUsername = {
  username: string;
  weight: number;
};

type UsernameListItem = WeightedUsername | string;
const usernames: UsernameListItem[] = [
  { username: 'TheeeHman', weight: 1 },
  'dontlookatme20',
  'dogerlove',
  'theblacktaco',
  'idkwhattodoy',
  'hahahahhahelpme',
  'The_real_Schnitzel',
  'vicsloan',
  'katajin31309',
  'Xsxcx',
  'porchcoors50',
  'idiociest',
  'BizzarGhostGaming',
  'AmazingDieudo',
  'RayShmurda6',
  'Lost-n-Confused2',
  'GrimmMarshal',
  'inception73',
  'Rahulkumar18',
  'MBSUPERSPAZZ'
];

const getWeight = (u: UsernameListItem): number => (typeof u === 'string' ? 1 : u.weight);
const getUsername = (u: UsernameListItem): string => (typeof u === 'string' ? u : u.username);

export function getSfwUsername(): string {
  const totalWeight = usernames.reduce((acc, u) => acc + getWeight(u), 0);
  const randomWeight = Math.random() * totalWeight;

  let iterWeight = 0;
  for (const u of usernames) {
    const weight = getWeight(u);
    iterWeight += weight;
    if (iterWeight >= randomWeight) {
      return getUsername(u);
    }
  }
  throw new Error('unreachable');
}

export function getSfwTorrent(ref: Torrent): Torrent {
  return {
    ...ref,

    // we need this to "cache bust the component", so svelte doesn't reuse the
    // old component with a non-sfw image Torrent.svelte components are keyed
    // off of this id
    id: `sfw-${ref.id}`,

    name: getSfwName(),

    tags: ref.tags.map(getSfwTag),

    uploader: ref.uploader ? User.fromNameAndHref(getSfwUsername(), ref.uploader.href) : null,

    imageHref: getSfwImageUrl()
  };
}

const postTitles = [
  'Best Tips for Capturing Stunning Landscape Photos',
  'How to Make Money Selling Stock Photos Online',
  'The Ethics of Photo Editing: How Much is Too Much?',
  'Top 5 Photography Techniques for Beginners',
  'Understanding Licensing: A Guide to Using Stock Photos Legally',
  'How to Build a Portfolio to Attract Stock Photo Buyers',
  'Favorite Photography Gear for Travel Enthusiasts',
  'How to Capture the Perfect Golden Hour Shot',
  'The Pros and Cons of Using Free vs. Paid Stock Photos',
  'Tips for Shooting High-Quality Photos with Your Smartphone'
];
let curPostTitleIndex = 0;
export function getSfwPostTitle(): string {
  const title = postTitles[curPostTitleIndex];
  curPostTitleIndex = (curPostTitleIndex + 1) % postTitles.length;
  return title;
}
