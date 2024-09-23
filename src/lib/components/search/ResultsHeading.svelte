<script lang="ts">
  import { type SearchDataStore } from '$stores/page';
  import { getContext } from 'svelte';
  import { formatNumber } from '$lib/util';
  import Torrent from './Torrent.svelte';
  import { type Readable } from 'svelte/store';
  import InlineSeparator from '$components/ui/InlineSeparator.svelte';

  const searchDataStore = getContext<SearchDataStore>('searchDataStore');
  const filteredTorrentsStore = getContext<Readable<Torrent[]>>('filteredTorrentsStore');

  $: totalResultCount = formatNumber($searchDataStore.pagination.totalResultCount);
  $: start = formatNumber($searchDataStore.pagination.thisPageRange.start);
  $: end = formatNumber($searchDataStore.pagination.thisPageRange.end);
  $: hiddenByFiltersCount = $searchDataStore.torrents.length - $filteredTorrentsStore.length;
</script>

<div>
  <h2 class="inline text-2xl font-bold">Results</h2>
  <span class="text-xl"
    >{start}–{end}
    {#if hiddenByFiltersCount > 0}
      ({formatNumber(hiddenByFiltersCount)} hidden by filters)
    {/if}</span
  >
  <InlineSeparator />
  <span class="text-xl">{totalResultCount} total</span>
</div>
