<script lang="ts">
  import { type Torrent, groupTorrents } from '$lib/torrent';
  import type { Me } from '$gather/me';
  import TorrentGroup from './TorrentGroup.svelte';
  import { seenTorrents } from '$stores/seen';
  import { onDestroy, setContext } from 'svelte';
  import TorrentSkeleton from './TorrentSkeleton.svelte';

  export let torrentsPromise: Promise<Torrent[]>;
  export let mePromise: Promise<Me>;
  let lastTorrentCount = 25;

  $: dataPromise = Promise.all([torrentsPromise, mePromise]).then(([torrents, me]) => {
    lastTorrentCount = torrents.length;

    return [torrents, me] as [Torrent[], Me];
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
    class="relative grid grid-cols-[repeat(auto-fill,_minmax(var(--torrent-card-width),_1fr))] gap-4"
  >
    {#await dataPromise}
      {#each Array.from({ length: lastTorrentCount }) as _}
        <li>
          <TorrentSkeleton />
        </li>
      {/each}
    {:then [torrents, me]}
      {@const groups = groupTorrents(torrents)}
      {#each groups as group (group[0].torrent.id)}
        <li>
          <TorrentGroup {group} {me} />
        </li>
      {/each}
    {/await}
  </ol>
</div>
