<script lang="ts">
  import { type PageDataStore, type SearchDataStore, createSearchPageStore } from '$stores/page';
  import { type Torrent, groupTorrents } from '$lib/torrent';
  import type { Me } from '$gather/me';
  import { seenTorrents } from '$stores/seen';
  import { onDestroy, setContext, getContext } from 'svelte';
  import TorrentSkeleton from './TorrentSkeleton.svelte';
  import TorrentComponent from './Torrent.svelte';
  import { type Readable} from 'svelte/store';

  const pageDataStore = getContext<PageDataStore>('pageDataStore');
  const filteredTorrentsStore = getContext<Readable<Torrent[]>>('filteredTorrentsStore');

  $: groupedTorrents = groupTorrents($filteredTorrentsStore);

  // set up intersection observer for when torrents are in the viewport
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = (entry.target as HTMLElement)?.dataset['torrentId'] ?? null;
        if (!id) return;

        if (entry.isIntersecting) {
          // Add the ID to the store if the element is visible
          seenTorrents.add(id);
        }
      });
    },
    {
      root: null,
      threshold: 0.5 // 50% of the element must be visible
    }
  );
  setContext('intersectionObserver', intersectionObserver);

  onDestroy(() => {
    return () => {
      intersectionObserver.disconnect();
    };
  });
</script>

<div>
  <ol
    class="relative grid gap-4 md:grid-cols-[repeat(auto-fill,_minmax(var(--torrent-card-width),_1fr))]"
  >
    {#if $pageDataStore.isLoading}
      {#each Array.from({ length: $filteredTorrentsStore.length }) as _}
        <li>
          <TorrentSkeleton />
        </li>
      {/each}
    {:else}
      {#each groupedTorrents as group (group[0].torrent.id)}
        <li>
          <TorrentComponent {group} />
        </li>
      {/each}
    {/if}
  </ol>
</div>
