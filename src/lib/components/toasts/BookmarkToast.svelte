<script lang="ts">
  import { type Torrent } from '$lib/torrent';
  import type { Action as BookmarkAction } from '$api/bookmark';
  import TorrentToast from './TorrentToast.svelte';

  export let action: BookmarkAction;
  export let torrent: Torrent;
  export let dismissFn: () => void;
</script>

<TorrentToast {torrent} {dismissFn}>
  <p>
    {#if action === 'add'}
      Bookmarked
    {:else}
      Unbookmarked
    {/if}
    <span class="italic">
      {torrent.name}
    </span>
  </p>
</TorrentToast>
