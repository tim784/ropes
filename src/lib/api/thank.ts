import { queueFetch, priorities } from './queue';

export async function thank(torrentId: string, authKey: string) {
  const formData = new FormData();
  formData.append('action', 'thank');
  formData.append('groupid', torrentId);
  formData.append('auth', authKey);

  await queueFetch(
    `/torrents.php?action=thank`,
    {
      method: 'POST',
      body: formData,
      credentials: 'same-origin'
    },
    'thanking uploader',
    priorities.thank
  );

  // if the thank is successful, returns a 200 with html of this user's name. if
  // unsuccessful, also returns a 200 with html of "err_user". this is fine. we
  // don't care: this is an idempotent action.
}
