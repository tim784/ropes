<script lang="ts">
  import { Textarea } from '$components/ui/textarea';
  import { settings } from '$stores/settings';
  import { getSfwTag } from '$src/lib/sfwMode';
  import Link from '$components/ui/Link.svelte';
  import { makeAppIdentifier } from '$lib/constants';

  export let value: string;

  const textAreaId = makeAppIdentifier('tags-entry');
</script>

<div class="space-y-2">
  {#if !$settings.sfwMode}
    <Textarea rows={8} id={textAreaId} bind:value class="font-mono" />
  {:else}
    <Textarea
      rows={8}
      id={textAreaId}
      class="font-mono"
      value={Array.from({ length: 5 }).map(getSfwTag).join(' ')}
    />
  {/if}
  <p class="text-sm text-gray-500">
    Enter tags separated by spaces. See the syntax for searching <Link href="/articles/view/search"
      >here</Link
    >.
  </p>
</div>
