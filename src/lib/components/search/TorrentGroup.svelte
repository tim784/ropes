<script lang="ts">
  import { type TorrentInGroup } from '$lib/torrent';
  import type { Me } from '$gather/me';
  import TorrentComponent from './Torrent.svelte';
  import type { ComponentEvents } from 'svelte';

  export let group: TorrentInGroup[];
  export let me: Me;
  let index: number = 0;

  $: if (group.length === 0) {
    throw new Error('TorrentGroup should be created with at least one torrent');
  }
  $: torrent = group[index].torrent;
  $: thisVariation = group[index].variationString;
  $: allVariations = group.map((t) => t.variationString);

  function handleChangeVariation(event: ComponentEvents<TorrentComponent>['changeVariation']) {
    const newIndex = allVariations.indexOf(event.detail);
    if (newIndex !== -1) {
      index = newIndex;
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
  />
</div>
