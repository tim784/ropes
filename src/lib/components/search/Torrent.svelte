<script lang="ts">
  import { DoubleseedState, FreeleechState } from '$lib/torrent';
  import TorrentMeta from './TorrentMeta.svelte';
  import Button from '$components/ui/Button.svelte';
  import type { Me } from '$gather/me';
  import TorrentActions from './TorrentActions.svelte';
  import { getContext, onMount } from 'svelte';
  import { bookmark, type Action as BookmarkAction } from '$api/bookmark';
  import { toasts } from '$stores/toasts';
  import { locals } from '$stores/locals';
  import Maximize2 from 'lucide-svelte/icons/maximize-2';
  import TorrentImageExpand from '$components/modals/TorrentImageExpand.svelte';
  import { get } from 'svelte/store';
  import { seenTorrents } from '$stores/seen';
  import BookmarkToast from '$components/toasts/BookmarkToast.svelte';
  import SlotUsedToast from '$components/toasts/SlotUsedToast.svelte';
  import { fade } from 'svelte/transition';
  import * as Dialog from '$components/ui/dialog';
  import { portal } from '$stores/portal';
  import { type TorrentInGroup } from '$lib/torrent';
  import { settings } from '$stores/settings';
  import { getSfwTorrent } from '$lib/sfwMode';

  const observer = getContext<IntersectionObserver>('intersectionObserver');

  export let group: TorrentInGroup[];
  export let me: Me;
  let groupIndex: number = 0;
  let localStates = group.map((t) => ({
    isBookmarked: t.torrent.isBookmarked,
    isPersonalFreeleech: t.torrent.freeleechState === FreeleechState.Personal,
    isPersonalDoubleseed: t.torrent.doubleseedState === DoubleseedState.Personal
  }));
  $: localState = localStates[groupIndex];

  $: if (group.length === 0) {
    throw new Error('TorrentGroup should be created with at least one torrent');
  }
  $: torrent = $settings.sfwMode
    ? getSfwTorrent(group[groupIndex].torrent)
    : group[groupIndex].torrent;

  // we don't want this to be reactive on seenTorrents. otherwise, everything
  // would be immediately called seen.
  const seenTorrentsOnLoad = get(seenTorrents);
  $: hasSeenAtLoad = seenTorrentsOnLoad.has(torrent.id);

  let el: HTMLElement;

  // these are _local_ state. the user can do these things without reloading the page
  // $: isBookmarked = torrent.isBookmarked;
  // $: isPersonalFreeleech = torrent.freeleechState === FreeleechState.Personal;
  // $: isPersonalDoubleseed = torrent.doubleseedState === DoubleseedState.Personal;

  async function toggleBookmark() {
    const action: BookmarkAction = localState.isBookmarked ? 'remove' : 'add';
    await bookmark(action, torrent.id, me.authKey);
    localState.isBookmarked = !localState.isBookmarked;
    toasts.add(BookmarkToast, { action, torrent });
  }

  async function purchaseFreeleech() {
    locals.useSlot();
    toasts.add(SlotUsedToast, { slotType: 'freeleech', torrent });
    localState.isPersonalFreeleech = true;
  }

  async function purchaseDoubleseed() {
    locals.useSlot();
    toasts.add(SlotUsedToast, { slotType: 'doubleseed', torrent });
    localState.isPersonalDoubleseed = true;
  }

  function changeIndex(index: number) {
    if (index === groupIndex) return;
    if (index < 0 || index >= group.length) {
      console.error('Invalid index', index);
      return;
    }
    groupIndex = index;
  }

  onMount(() => {
    observer.observe(el);
    return () => {
      observer.unobserve(el);
    };
  });
</script>

<div
  class="group flex max-w-full flex-col items-center overflow-hidden rounded-lg border bg-card"
  data-torrent-id={torrent.id}
  bind:this={el}
  transition:fade
>
  {#if torrent.imageHref !== null}
    <div class="relative w-full">
      <img
        class="opactiy-0 max-h-64 w-full animate-fade-in object-contain object-top"
        src={torrent.imageHref}
        alt={torrent.name}
      />
      <Dialog.Root portal={$portal}>
        <Dialog.Trigger asChild let:builder>
          <Button
            builders={[builder]}
            size="icon"
            variant="ghost"
            class="absolute right-4 top-4 z-10 bg-accent/50 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <Maximize2 class="size-6" /><span class="sr-only">Expand Image</span>
          </Button>
        </Dialog.Trigger>
        <TorrentImageExpand imageHref={torrent.imageHref} alt={torrent.name} />
      </Dialog.Root>
    </div>
  {/if}

  <div class="flex w-full flex-col items-start gap-4 p-4">
    <TorrentMeta
      {torrent}
      hasSeen={hasSeenAtLoad}
      isBookmarked={localState.isBookmarked}
      isPersonalFreeleech={localState.isPersonalFreeleech}
      isPersonalDoubleseed={localState.isPersonalDoubleseed}
    />

    {#if group.length > 1}
      <h4 class="sr-only text-sm text-muted-foreground">Variants</h4>
      <div class="flex flex-wrap gap-2">
        {#each group as groupItem, index (index)}
          <Button
            variant="outline"
            size="sm"
            class={`border-2 ${index === groupIndex ? 'cursor-default border-primary hover:bg-background active:border-primary active:bg-background' : ''}`}
            on:click={() => changeIndex(index)}>{groupItem.variantString}</Button
          >
        {/each}
      </div>
    {/if}

    <TorrentActions
      {torrent}
      {me}
      isBookmarked={localState.isBookmarked}
      isPersonalFreeleech={localState.isPersonalFreeleech}
      isPersonalDoubleseed={localState.isPersonalDoubleseed}
      on:bookmarkToggle={toggleBookmark}
      on:purchaseFreeleech={purchaseFreeleech}
      on:purchaseDoubleseed={purchaseDoubleseed}
    />
  </div>
</div>
