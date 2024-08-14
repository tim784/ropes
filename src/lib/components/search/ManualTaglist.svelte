<script lang="ts">
  import { Textarea } from '$components/ui/textarea';
  import { settings } from '$stores/settings';
  import { localFormData } from '$src/lib/stores/localFormData';
  import { getSfwTag } from '$src/lib/sfwMode';
  import Link from '$components/ui/Link.svelte';
  import { TAGLIST_NAME } from '$src/lib/gather/search';
  import { onMount } from 'svelte';
  import { makeAppIdentifier } from '$lib/constants';

  const textAreaId = makeAppIdentifier('tags-entry');

  let value = $localFormData.d.get(TAGLIST_NAME)?.toString() || '';

  $: localFormData.setTaglist(value);

  onMount(() => {
    return localFormData.subscribe((v) => {
      value = v.d.get(TAGLIST_NAME)?.toString() || '';
    });
  });
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
