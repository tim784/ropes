<script lang="ts">
  import { type TorrentInGroup } from '$lib/torrent';
  import type { Me } from '$gather/me';
  import TorrentComponent from './Torrent.svelte';
  import type { ComponentEvents } from 'svelte';
  import { settings } from '$stores/settings';
  import { getSfwTorrent } from '$lib/sfwMode';

  export let group: TorrentInGroup[];
  export let me: Me;
  let index: number = 0;

  $: if (group.length === 0) {
    throw new Error('TorrentGroup should be created with at least one torrent');
  }
  $: torrent = $settings.sfwMode ? getSfwTorrent(group[index].torrent) : group[index].torrent;
  $: thisVariation = group[index].variationString;
  $: allVariations = group.map((t, index) => ({str: t.variationString, index}));

  function handleChangeVariation(event: ComponentEvents<TorrentComponent>['changeVariation']) {
    const newIndex = event.detail;
    if (newIndex >= 0 && newIndex < group.length) {
      index = newIndex;
    } else {
      console.error('Invalid index', newIndex);
    }
  }
</script>

<div>
  <TorrentComponent
    bind:torrent
    bind:me
    on:changeVariation={handleChangeVariation}
    bind:allVariations
    bind:thisVariation
    bind:thisIndex={index}
  />
</div>
