<script lang="ts">
  import { type Torrent } from '$gather/torrents';
  import { formatNumber, getRelativeDifference } from '$lib/util';
  import { page, getSearchUrlOfFormData } from '$stores/page';
  import * as Popover from '$components/ui/popover/index.js';
  import Link from '$components/ui/Link.svelte';
  import ArrowDown from 'lucide-svelte/icons/arrow-down';
  import ArrowUp from 'lucide-svelte/icons/arrow-up';
  import FileCheck from 'lucide-svelte/icons/file-check';
  import TorrentBadges from '$components/search/TorrentBadges.svelte';
  import { TAGLIST_NAME } from '$src/lib/gather/search';
  import { settings } from '$stores/settings';

  export let torrent: Torrent;
  export let hasSeen: boolean;
  export let isBookmarked: boolean;
  export let isPersonalDoubleseed: boolean;
  export let isPersonalFreeleech: boolean;

  $: seeders = formatNumber(torrent.seeders);
  $: leechers = formatNumber(torrent.leechers);
  $: snatches = formatNumber(torrent.snatches);

  const relativeDateTime = getRelativeDifference(torrent.uploadDateTime);

  function searchTag(tag: string) {
    const formData = new FormData();
    formData.append(TAGLIST_NAME, tag);
    page.navigateToSearch(formData);
  }

  function searchTagUrl(tag: string) {
    const formData = new FormData();
    formData.append(TAGLIST_NAME, tag);
    return getSearchUrlOfFormData(formData);
  }
</script>

<div class="flex flex-col">
  <TorrentBadges {torrent} {hasSeen} {isBookmarked} {isPersonalDoubleseed} {isPersonalFreeleech} />

  <Link href={torrent.pageHref} class="my-2">
    <h3 class="inline text-xl font-bold tracking-tight">
      {torrent.name}
    </h3>
  </Link>

  <div class="space-y-0.5">
    <div class="meta-list">
      <span>{torrent.size}</span>
      <date
        class="underline decoration-dotted"
        title={torrent.uploadDateTime.toLocaleString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })}
      >
        {relativeDateTime}
      </date>
    </div>

    <div class="meta-list">
      <span title="{seeders} Seeders">
        <ArrowUp class="me-0.5 inline size-5" />
        <span class="underline decoration-dotted">{seeders}</span>
        <span class="sr-only">Seeders</span>
      </span>
      <span title="{leechers} Leechers">
        <ArrowDown class="me-0.5 inline size-5" />
        <span class="underline decoration-dotted">{leechers}</span>
        <span class="sr-only">Leechers</span>
      </span>
      <span title="{snatches} Snatches">
        <FileCheck class="me-0.5 inline size-5" />
        <span class="underline decoration-dotted">{snatches}</span>
        <span class="sr-only">Snatches</span>
      </span>
    </div>

    <div class="meta-list">
      <span>
        {#if torrent.uploader}
          <Link href={torrent.uploader.href}>@{torrent.uploader.name}</Link>
        {:else}
          Anonymous
        {/if}
      </span>
      {#if torrent.tags !== null}
        <span>
          <Popover.Root>
            <Popover.Trigger asChild let:builder
              ><Link builders={[builder]} class="text-md">See tags</Link></Popover.Trigger
            >
            <Popover.Content class="z-20 max-h-96 min-w-96 overflow-y-scroll">
              <div class="flex flex-wrap gap-x-[2ch] font-mono underline decoration-primary">
                {#each torrent.tags.sort() as tag (tag)}
                  <div>
                    {#if $settings.spaMode}<Link on:click={() => searchTag(tag)} class="inline"
                        >{tag}</Link
                      >{:else}<Link href={searchTagUrl(tag)} class="inline">{tag}</Link>{/if}
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

<style lang="postcss">
  .meta-list > *:not(:last-child)::after {
    content: '•';
    margin-inline-start: 0.5rem;
  }
</style>
