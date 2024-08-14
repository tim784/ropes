import { queueFetch, priorities } from './queue';

export type Action = 'add' | 'remove';

export async function bookmark(action: Action, torrentId: string, authKey: string) {
  const response = await queueFetch(
    `/bookmarks.php?action=${action}&type=torrent&id=${torrentId}&auth=${authKey}`,
    {
      credentials: 'same-origin'
    },
    `${action === 'add' ? 'bookmarking' : 'unbookmarking'} for torrent id ${torrentId}`,
    priorities.bookmark
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
}
