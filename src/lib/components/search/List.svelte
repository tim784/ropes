<script lang="ts">
  import { type Torrent, groupTorrents } from '$lib/torrent';
  import type { Me } from '$gather/me';
  import { seenTorrents } from '$stores/seen';
  import { onDestroy, setContext, getContext } from 'svelte';
  import TorrentSkeleton from './TorrentSkeleton.svelte';
  import TorrentComponent from './Torrent.svelte';
  import { curFilterGroup } from '$stores/filters';
  import { type Writable } from 'svelte/store';

  export let torrentsPromise: Promise<Torrent[]>;
  export let mePromise: Promise<Me>;
  let lastTorrentCount = 25;
  let torrents: Torrent[] = [];
  const filteredCountStore = getContext<Writable<number>>('filteredCountStore');

  $: filteredTorrents = torrents.filter((t) => $curFilterGroup.filter(t));
  $: groupedTorrents = groupTorrents(filteredTorrents);
  $: filteredCountStore.set(torrents.length - filteredTorrents.length);

  $: dataPromise = Promise.all([torrentsPromise, mePromise]).then(([dataPromiseTorrents, me]) => {
    lastTorrentCount = dataPromiseTorrents.length;
    torrents = dataPromiseTorrents;
    return me as Me;
  });

  // scroll when torrentsPromise changes. kinda an abuse of reactivity, but
  // whatever.
  $: ((dep: any) => {
    // we could use $page.scrollY here, which possibly contains
    // the last scroll position the user had if this is a back-navigation. but it
    // doesn't really work because the layout (which affects scroll position)
    // changes when torrents (and especially images) load. so, for now, just
    // scroll to the top.

    // also, don't do this in dev, its distracting when we're trying to work on
    // a particular part of the page.
    if (!import.meta.env.DEV) {
      window.scrollTo({ top: 0 });
    }
  })(torrentsPromise);

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
    {#await dataPromise}
      {#each Array.from({ length: lastTorrentCount }) as _}
        <li>
          <TorrentSkeleton />
        </li>
      {/each}
    {:then me}
      {#each groupedTorrents as group (group[0].torrent.id)}
        <li>
          <TorrentComponent {group} {me} />
        </li>
      {/each}
    {/await}
  </ol>
</div>
