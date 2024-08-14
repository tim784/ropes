<script lang="ts">
  import { locals } from '$src/lib/stores/locals';
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

  let className: (typeof $$props)['class'] = undefined;
  export { className as class };
</script>

<ul
  class={cn(
    'inline-flex flex-wrap gap-4 justify-center *:flex *:gap-1 *:underline *:decoration-dotted',
    className
  )}
>
  <!-- i feel like its not useful to be tracking this if you don't have any. i'm
  not even sure how you get them, and people shouldn't be reminded to ask about
  them (e.g. via forum, etc) -->
  {#if $locals.inviteCount > 0}
    <li title="Invites Available"><UserPlus /> {$locals.inviteCount}</li>
  {/if}

  <li title="Torrents Seeding"><FileUp />{formatNumber($locals.torrentsSeedingCount)}</li>
  <li title="Torrents Leeching"><FileDown /> {formatNumber($locals.torrentsLeechingCount)}</li>
  <li title="Upload Amount"><CloudUpload /> {$locals.uploadedBytes}</li>
  <li title="Download Amount"><CloudDownload /> {$locals.downloadedBytes}</li>
  <li title="Ratio"><Ratio /> {$locals.ratio}</li>
  <li title="Credit Balance"><Coins /> {formatNumber($locals.creditCount)}</li>
  <li title="Slots Available"><Box /> {formatNumber($locals.slotCount)}</li>
</ul>
