<script lang="ts">
  import { type Torrent } from '$lib/torrent';
  import type { Me } from '$gather/me';
  import { toasts } from '$stores/toasts';
  import DoubleUp from '$icons/DoubleUp.svelte';
  import Free from '$icons/Free.svelte';
  import { createEventDispatcher } from 'svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import Button from '$components/ui/Button.svelte';
  import { thank } from '$api/thank';
  import Bookmark from 'lucide-svelte/icons/bookmark';
  import Download from 'lucide-svelte/icons/download';
  import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
  import Heart from 'lucide-svelte/icons/heart';
  import ThankToast from '$components/toasts/ThankToast.svelte';
  import { getContext } from 'svelte';
  import { type LocalsStore } from '$stores/locals';

  export let torrent: Torrent;
  export let me: Me;
  export let isBookmarked: boolean;
  export let isPersonalFreeleech;
  export let isPersonalDoubleseed;

  const localsStore = getContext<LocalsStore>('localsStore');

  let hasThanked = false;

  const dispatch = createEventDispatcher();

  async function handleThank() {
    await thank(torrent.id, me.authKey);
    toasts.add(ThankToast, { torrent });
    hasThanked = true;
  }
</script>

<div class="grid w-full grid-cols-[1fr_min-content]">
  {#if torrent.downloadHref !== null}
    <Button
      href={torrent.downloadHref}
      target="_self"
      class="flex-1 rounded-e-none rounded-s-lg border-e-2 border-card text-base font-bold"
    >
      <Download class="me-2 size-6" />Download
    </Button>
  {:else}
    <Button disabled class="flex-1 rounded-e-none rounded-s-lg border-e-2 px-2 text-base"
      >Warned</Button
    >
  {/if}

  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button
        builders={[builder]}
        class="rounded-none rounded-e-lg px-2"
        aria-label="Torrent Actions"
      >
        <EllipsisVertical class="size-6" /></Button
      >
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Separator />

        <DropdownMenu.Item class="flex items-center" on:click={() => dispatch('bookmarkToggle')}>
          <Bookmark class="me-2 size-5" />
          {#if isBookmarked}Unbookmark{:else}Bookmark{/if}
        </DropdownMenu.Item>

        <!-- this isn't permanent state, but just enough to not thank again during same page load -->
        {#if !hasThanked}
          <DropdownMenu.Item on:click={handleThank} class="flex items-center">
            <Heart class="me-2 size-5" />Thank
          </DropdownMenu.Item>
        {/if}

        {#if $localsStore.slotCount > 0}
          {#if torrent.freeleechHref && !isPersonalFreeleech}
            <DropdownMenu.Item
              href={torrent.freeleechHref}
              on:click={() => dispatch('purchaseFreeleech')}
              class="flex items-center"
            >
              <Free class="me-2 size-5" />Freeleech for 24 hours
            </DropdownMenu.Item>
          {/if}

          {#if torrent.doubleseedHref && !isPersonalDoubleseed}
            <DropdownMenu.Item
              class="flex items-center"
              href={torrent.doubleseedHref}
              on:click={() => dispatch('purchaseDoubleseed')}
            >
              <DoubleUp class="me-2 size-5" />Doubleseed for 2 weeks
            </DropdownMenu.Item>
          {/if}
        {/if}
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
