<script lang="ts">
  import { type PageDataStore } from '$stores/page';
  import { type Torrent, type TorrentInGroup, groupTorrents } from '$lib/torrent';
  import { seenTorrents } from '$stores/seen';
  import { onDestroy, setContext, getContext } from 'svelte';
  import TorrentSkeleton from './TorrentSkeleton.svelte';
  import TorrentComponent from './Torrent.svelte';
  import { type Readable } from 'svelte/store';
  import type { Action } from 'svelte/action';

  const pageDataStore = getContext<PageDataStore>('pageDataStore');
  const filteredTorrentsStore = getContext<Readable<Torrent[]>>('filteredTorrentsStore');
  const groupIdstKey = 'groupIds';

  function getGroupIdsString(group: TorrentInGroup[]) {
    return JSON.stringify(group.map((t) => t.torrent.id));
  }

  function parseGroupIdsString(idsString: string): string[] {
    try {
      return JSON.parse(idsString) as string[];
    } catch (e) {
      console.error('Failed to parse group ids string', e);
      return [];
    }
  }

  $: groupedTorrents = groupTorrents($filteredTorrentsStore);

  // set up intersection observer for when torrent components are in the
  // viewport. to be used in tandem with the observeAction below
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const idsString = (entry.target as HTMLElement)?.dataset[groupIdstKey] ?? null;
        if (!idsString) return;

        const groupIds = parseGroupIdsString(idsString);

        groupIds.forEach((id) => seenTorrents.add(id));
      });
    },
    {
      root: null,
      threshold: 0.5 // 50% of the element must be visible, arbitrary
    }
  );
  setContext('intersectionObserver', intersectionObserver);

  const observeAction: Action<HTMLElement, TorrentInGroup[]> = (node, group: TorrentInGroup[]) => {
    const idsString = getGroupIdsString(group);
    node.dataset[groupIdstKey] = idsString;
    intersectionObserver.observe(node);
    return {
      destroy() {
        intersectionObserver.unobserve(node);
      }
    };
  };

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
        <li use:observeAction={group}>
          <TorrentComponent {group} />
        </li>
      {/each}
    {/if}
  </ol>
</div>
