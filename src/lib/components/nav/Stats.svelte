<script lang="ts">
  import { cn } from '$lib/components/shadcn-utils.js';
  import Box from 'lucide-svelte/icons/box';
  import CloudDownload from 'lucide-svelte/icons/cloud-download';
  import CloudUpload from 'lucide-svelte/icons/cloud-upload';
  import Coins from 'lucide-svelte/icons/coins';
  import Ratio from '$icons/Ratio.svelte';
  import FileDown from 'lucide-svelte/icons/file-down';
  import FileUp from 'lucide-svelte/icons/file-up';
  import UserPlus from 'lucide-svelte/icons/user-plus';
  import { formatNumber } from '$src/lib/util';
  import * as Tooltip from '$components/ui/tooltip/index.js';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import {type Locals, type LocalsStore} from '$stores/locals';

  const localsStore = getContext<LocalsStore>('localsStore');

  let className: (typeof $$props)['class'] = undefined;
  export { className as class };
</script>

<ul
  class={cn(
    'inline-flex flex-wrap justify-center gap-4 *:flex *:gap-1 *:underline *:decoration-dotted',
    className
  )}
>
  <!-- i feel like its not useful to be tracking this if you don't have any. i'm
  not even sure how you get them, and people shouldn't be reminded to ask about
  them (e.g. via forum, etc) -->
  {#if $localsStore.inviteCount > 0}
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <li use:builder.action {...builder}>
          <UserPlus />{$localsStore.inviteCount}<span class="sr-only">Invites Available</span>
        </li></Tooltip.Trigger
      >
      <Tooltip.Content>Invites Available</Tooltip.Content>
    </Tooltip.Root>
  {/if}

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <li use:builder.action {...builder}>
        <FileUp />{formatNumber($localsStore.torrentsSeedingCount)}<span class="sr-only"
          >Torrents Seeding</span
        >
      </li></Tooltip.Trigger
    >
    <Tooltip.Content>Torrents Seeding</Tooltip.Content>
  </Tooltip.Root>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <li use:builder.action {...builder}>
        <FileDown />
        {formatNumber($localsStore.torrentsLeechingCount)}<span class="sr-only">Torrents Leeching</span>
      </li></Tooltip.Trigger
    >
    <Tooltip.Content>Torrents Leeching</Tooltip.Content>
  </Tooltip.Root>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <li use:builder.action {...builder}>
        <CloudUpload />
        {$localsStore.uploadedBytes}<span class="sr-only">Upload Amount</span>
      </li></Tooltip.Trigger
    >
    <Tooltip.Content>Upload Amount</Tooltip.Content>
  </Tooltip.Root>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <li use:builder.action {...builder}>
        <CloudDownload />
        {$localsStore.downloadedBytes}<span class="sr-only">Download Amount</span>
      </li></Tooltip.Trigger
    >
    <Tooltip.Content>Download Amount</Tooltip.Content>
  </Tooltip.Root>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <li use:builder.action {...builder}>
        <Ratio />
        {$localsStore.ratio}<span class="sr-only">Ratio</span>
      </li></Tooltip.Trigger
    >
    <Tooltip.Content>Ratio</Tooltip.Content>
  </Tooltip.Root>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <li use:builder.action {...builder}>
        <Coins />
        {formatNumber($localsStore.creditCount)}<span class="sr-only">Credit Balance</span>
      </li></Tooltip.Trigger
    >
    <Tooltip.Content>Credit Balance</Tooltip.Content>
  </Tooltip.Root>

  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <li use:builder.action {...builder}>
        <Box />
        {formatNumber($localsStore.slotCount)}<span class="sr-only">Slots Available</span>
      </li></Tooltip.Trigger
    >
    <Tooltip.Content>Slots Available</Tooltip.Content>
  </Tooltip.Root>
</ul>
