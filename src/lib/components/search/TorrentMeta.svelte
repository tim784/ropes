<script lang="ts">
  import { type Torrent } from '$lib/torrent';
  import { formatNumber, getRelativeDifference } from '$lib/util';
  import * as Popover from '$components/ui/popover/index.js';
  import Link from '$components/ui/Link.svelte';
  import ArrowDown from 'lucide-svelte/icons/arrow-down';
  import ArrowUp from 'lucide-svelte/icons/arrow-up';
  import FileCheck from 'lucide-svelte/icons/file-check';
  import TorrentBadges from '$components/search/TorrentBadges.svelte';
  import { TAGLIST_NAME } from '$src/lib/gather/searchForm';
  import { settings } from '$stores/settings';
  import * as Tooltip from '$components/ui/tooltip/index.js';
  import InlineSeparator from '$components/ui/InlineSeparator.svelte';
  import { getContext } from 'svelte';
  import { type PageDataStore } from '$src/lib/stores/page';

  const pageDataStore = getContext<PageDataStore>('pageDataStore');

  export let torrent: Torrent;
  export let hasSeen: boolean;
  export let isBookmarked: boolean;
  export let isPersonalDoubleseed: boolean;
  export let isPersonalFreeleech: boolean;

  $: seeders = formatNumber(torrent.seeders);
  $: leechers = formatNumber(torrent.leechers);
  $: snatches = formatNumber(torrent.snatches);
  $: absoluteDateTime = torrent.uploadDateTime.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  $: relativeDateTime = getRelativeDifference(torrent.uploadDateTime);
  $: isoDateTime = torrent.uploadDateTime.toISOString();

  function searchTagUrl(tag: string) {
    const tagUrl = new URL(`/torrents.php`, window.location.href);
    tagUrl.searchParams.append(TAGLIST_NAME, tag);
    return tagUrl.toString();
  }

  function searchTag(tag: string) {
    pageDataStore.navigate(searchTagUrl(tag));
  }
</script>

<div class="flex flex-col">
  <TorrentBadges {torrent} {hasSeen} {isBookmarked} {isPersonalDoubleseed} {isPersonalFreeleech} />

  <div class="my-2">
    <Link href={torrent.pageHref} variant="foreground">
      <h3 class="inline text-xl font-bold tracking-tight">
        {torrent.name}
      </h3>
    </Link>
  </div>

  <div class="space-y-0.5">
    <div>
      <span>{torrent.size}</span>

      <InlineSeparator />

      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <date
            class="underline decoration-dotted"
            datetime={isoDateTime}
            use:builder.action
            {...builder}
          >
            {relativeDateTime}
            <span class="sr-only">Uploaded at {absoluteDateTime}</span>
          </date>
        </Tooltip.Trigger>
        <Tooltip.Content>{absoluteDateTime}</Tooltip.Content></Tooltip.Root
      >
    </div>

    <div>
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <span use:builder.action {...builder}>
            <ArrowUp class="inline size-5" />
            <span class="underline decoration-dotted">{seeders}</span>
            <span class="sr-only">Seeders</span>
          </span></Tooltip.Trigger
        >
        <Tooltip.Content>Seeders</Tooltip.Content></Tooltip.Root
      >

      <InlineSeparator />

      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <span use:builder.action {...builder}>
            <ArrowDown class=" inline size-5" />
            <span class="underline decoration-dotted">{leechers}</span>
            <span class="sr-only">Leechers</span>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content>Leechers</Tooltip.Content>
      </Tooltip.Root>

      <InlineSeparator />

      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <span use:builder.action {...builder}>
            <FileCheck class=" inline size-5" />
            <span class="underline decoration-dotted">{snatches}</span>
            <span class="sr-only">Snatches</span>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content>Snatches</Tooltip.Content>
      </Tooltip.Root>
    </div>

    <div>
      <span>
        {#if torrent.uploader}
          <Link href={torrent.uploader.href}>@{torrent.uploader.name}</Link>
        {:else}
          Anonymous
        {/if}
      </span>

      {#if torrent.tags !== null}
        <InlineSeparator />

        <span>
          <Popover.Root>
            <Popover.Trigger asChild let:builder
              ><Link builders={[builder]} class="text-md">See tags</Link></Popover.Trigger
            >
            <Popover.Content class="z-20 max-h-96 min-w-96 overflow-y-scroll p-1">
              <p class="px-2 py-1.5 text-sm font-semibold">Tags</p>
              <div class="-mx-1 my-1 h-px bg-muted" />
              <div class="flex flex-wrap gap-x-[2ch] px-2 pb-2">
                {#each torrent.tags.sort() as tag}
                  <div class="font-mono">
                    {#if $settings.spaMode}<Link
                        on:click={() => searchTag(tag)}
                        class="inline text-foreground underline hover:text-foreground/80"
                        >{tag}</Link
                      >{:else}<Link
                        href={searchTagUrl(tag)}
                        class="inline text-foreground underline hover:text-foreground/80"
                        >{tag}</Link
                      >{/if}
                  </div>
                {/each}
              </div>
            </Popover.Content>
          </Popover.Root>
        </span>
      {/if}
    </div>
  </div>
</div>
