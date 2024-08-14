<script lang="ts">
  import { DoubleseedState, FreeleechState, type Torrent } from '$gather/torrents';
  import TorrentMeta from './TorrentMeta.svelte';
  import Button from '$components/ui/Button.svelte';
  import type { Me } from '$gather/me';
  import TorrentActions from './TorrentActions.svelte';
  import { currentModal } from '$stores/modal';
  import { getContext, onMount } from 'svelte';
  import { bookmark, type Action as BookmarkAction } from '$api/bookmark';
  import { toasts } from '$stores/toasts';
  import { locals } from '$src/lib/stores/locals';
  import Maximize2 from 'lucide-svelte/icons/maximize-2';
  import TorrentImageExpand from '$components/modals/TorrentImageExpand.svelte';
  import { get } from 'svelte/store';
  import { seenTorrents } from '$stores/seen';
  import BookmarkToast from '$components/toasts/BookmarkToast.svelte';
  import SlotUsedToast from '$components/toasts/SlotUsedToast.svelte';
  import { fade } from 'svelte/transition';

  export let torrent: Torrent;
  export let me: Me;
  // we don't want this to be reactive on seenTorrents. otherwise, everything
  // would be immediately called seen.
  let hasSeenAtLoad = get(seenTorrents).has(torrent.id);

  let el: HTMLElement;

  // these are _local_ state. the user can do these things without reloading the page
  let isBookmarked = torrent.isBookmarked;
  let isPersonalFreeleech = torrent.freeleechState === FreeleechState.Personal;
  let isPersonalDoubleseed = torrent.doubleseedState === DoubleseedState.Personal;

  async function toggleBookmark() {
    const action: BookmarkAction = isBookmarked ? 'remove' : 'add';
    await bookmark(action, torrent.id, me.authKey);
    isBookmarked = !isBookmarked;
    toasts.add(BookmarkToast, { action, torrent });
  }

  async function purchaseFreeleech() {
    locals.useSlot();
    toasts.add(SlotUsedToast, { slotType: 'freeleech', torrent });
    isPersonalFreeleech = true;
  }

  async function purchaseDoubleseed() {
    locals.useSlot();
    toasts.add(SlotUsedToast, { slotType: 'doubleseed', torrent });
    isPersonalDoubleseed = true;
  }

  function handleImageExpandClick() {
    currentModal.set(TorrentImageExpand, { torrent });
  }

  const observer = getContext<IntersectionObserver>('intersectionObserver');

  onMount(() => {
    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  });
</script>

<div
  class="group flex max-w-full flex-col items-center overflow-hidden rounded-lg bg-card shadow-lg"
  data-torrent-id={torrent.id}
  bind:this={el}
  transition:fade
>
  <div class="relative w-full">
    <img
      class="opactiy-0 animate-fade-in max-h-64 w-full object-contain object-top"
      src={torrent.imageHref}
      alt={torrent.name}
    />
    <Button
      size="icon"
      variant="ghost"
      class="absolute right-4 top-4 z-10 bg-accent/50 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
      on:click={handleImageExpandClick}
    >
      <Maximize2 class="size-6" />
    </Button>
  </div>

  <div class="flex w-full flex-col items-start gap-4 p-4">
    <TorrentMeta
      {torrent}
      hasSeen={hasSeenAtLoad}
      {isBookmarked}
      {isPersonalDoubleseed}
      {isPersonalFreeleech}
    />

    <TorrentActions
      {torrent}
      {me}
      {isPersonalFreeleech}
      {isPersonalDoubleseed}
      {isBookmarked}
      on:bookmarkToggle={toggleBookmark}
      on:purchaseFreeleech={purchaseFreeleech}
      on:purchaseDoubleseed={purchaseDoubleseed}
    />
  </div>
</div>
