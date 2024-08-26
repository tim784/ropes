<script lang="ts">
    import { type Torrent } from '$lib/torrent';
  import TorrentToast from './TorrentToast.svelte';

  export let torrent: Torrent;
  export let dismissFn: () => void;
  $: uploader = torrent.uploader;
  $: uploaderName = uploader ? `@${uploader.name}` : 'the uploader';
</script>

<TorrentToast {torrent} {dismissFn}>
  <p>
    Thanked <span class="font-bold">{uploaderName}</span> for <span class="italic">{torrent.name}</span>
  </p>
</TorrentToast>
