<script lang="ts">
  import { type Torrent } from '$lib/torrent';
  import BaseToast from './BaseToast.svelte';

  export let torrent: Torrent;
  export let dismissFn: () => void;
</script>

<BaseToast {dismissFn}>
  <div class="grid grid-cols-[max-content_auto] place-items-center">
    <img
      class="h-24 max-h-full w-48 rounded-lg object-contain"
      src={torrent.imageHref}
      alt={torrent.name}
    />
    <div class="text-sm">
      <slot />
    </div>
  </div>
</BaseToast>
