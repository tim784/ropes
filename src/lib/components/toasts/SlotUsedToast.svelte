<script lang="ts">
  import { type Torrent } from '$lib/torrent';
  import TorrentToast from './TorrentToast.svelte';

  export let slotType: 'freeleech' | 'doubleseed';
  export let torrent: Torrent;
  export let dismissFn: () => void;
</script>

<TorrentToast {torrent} {dismissFn}>
  <p>
    Used slot to <span class="font-bold"
      >{#if slotType === 'freeleech'}
        freeleech for 24 hours
      {:else if slotType === 'doubleseed'}
        doubleseed for two weeks
      {/if}
    </span> <span class="italic">{torrent.name}</span>
  </p>
</TorrentToast>
