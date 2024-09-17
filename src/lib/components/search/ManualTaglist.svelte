<script lang="ts">
  import { Textarea } from '$components/ui/textarea';
  import { settings } from '$stores/settings';
  import { getSfwTag } from '$src/lib/sfwMode';
  import Link from '$components/ui/Link.svelte';
  import { TAGLIST_NAME } from '$src/lib/gather/searchForm';
  import { makeAppIdentifier } from '$lib/constants';
  import { getContext } from 'svelte';
  import type { LocalFormDataStore } from '$stores/localFormData';

  const localFormDataStore = getContext<LocalFormDataStore>('localFormDataStore');

  const textAreaId = makeAppIdentifier('tags-entry');

  let value = $localFormDataStore.get(TAGLIST_NAME)?.toString() || '';

  $: localFormDataStore.update((formData) => {
    formData.set(TAGLIST_NAME, value);
    return formData;
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
