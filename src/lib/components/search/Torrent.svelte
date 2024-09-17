<script lang="ts">
  import { DoubleseedState, FreeleechState } from '$lib/torrent';
  import TorrentMeta from './TorrentMeta.svelte';
  import Button from '$components/ui/Button.svelte';
  import TorrentActions from './TorrentActions.svelte';
  import { getContext, onMount } from 'svelte';
  import { bookmark, type Action as BookmarkAction } from '$api/bookmark';
  import { toasts } from '$stores/toasts';
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
  import * as ButtonRadioGroup from '$components/ui/button-radio-group';
  import { type BaseDataStore } from '$stores/page';
  import { type LocalsStore } from '$stores/locals';
  import Link from '$components/ui/Link.svelte';

  const localsStore = getContext<LocalsStore>('localsStore');
  const baseDataStore = getContext<BaseDataStore>('baseDataStore');

  const observer = getContext<IntersectionObserver>('intersectionObserver');

  export let group: TorrentInGroup[];
  $: me = $baseDataStore.me;

  let groupIndexStr: string = '0';
  $: groupIndex = parseInt(groupIndexStr);

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

  async function toggleBookmark() {
    const action: BookmarkAction = localState.isBookmarked ? 'remove' : 'add';
    await bookmark(action, torrent.id, me.authKey);
    localState.isBookmarked = !localState.isBookmarked;
    toasts.add(BookmarkToast, { action, torrent });
  }

  async function purchaseFreeleech() {
    localsStore.useSlot();
    toasts.add(SlotUsedToast, { slotType: 'freeleech', torrent });
    localState.isPersonalFreeleech = true;
  }

  async function purchaseDoubleseed() {
    localsStore.useSlot();
    toasts.add(SlotUsedToast, { slotType: 'doubleseed', torrent });
    localState.isPersonalDoubleseed = true;
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
      <Link href={torrent.pageHref} variant="none" class="block">
        <img
          class="opactiy-0 max-h-64 w-full animate-fade-in object-contain object-top"
          src={torrent.imageHref}
          alt={torrent.name}
        />
      </Link>
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
      <ButtonRadioGroup.Root bind:value={groupIndexStr} orientation="horizontal">
        <ul class="flex flex-wrap gap-2">
          {#each group as groupItem, index (index)}
            <li>
              <ButtonRadioGroup.Item value={index.toString()} size="sm" class="bg-card">
                {groupItem.variantString}
              </ButtonRadioGroup.Item>
            </li>
          {/each}
        </ul>
      </ButtonRadioGroup.Root>
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
