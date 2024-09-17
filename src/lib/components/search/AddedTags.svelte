<script lang="ts">
  import { settings } from '$stores/settings';
  import { wipe } from '$lib/transition';
  import Button from '$components/ui/Button.svelte';
  import { TaglistTag } from '$lib/tag';
  import { notTags } from '$stores/notTags';
  import { tagCache } from '$stores/tagCache';
  import { fetchAutocompleteTags } from '$api/autocomplete';
  import TriangleAlert from 'lucide-svelte/icons/triangle-alert';
  import X from 'lucide-svelte/icons/x';
  import LoadingSpinner from '$components/ui/LoadingSpinner.svelte';
  import { getSfwTag } from '$lib/sfwMode';
  import { TAGLIST_NAME } from '$gather/searchForm';
  import { getContext } from 'svelte';
  import type { LocalFormDataStore } from '$stores/localFormData';

  const localFormDataStore = getContext<LocalFormDataStore>('localFormDataStore');

  $: tags = TaglistTag.validateSyntax($localFormDataStore.get(TAGLIST_NAME)?.toString() || '');

  async function validateExists(tag: TaglistTag) {
    if ($notTags.has(tag.name)) {
      return false;
    } else if ($tagCache.has(tag.name) || $settings.sfwMode) {
      return true;
    } else {
      const suggestions = await fetchAutocompleteTags(tag, 'validate');
      tagCache.merge(suggestions);
      if (!suggestions.map((s) => s.name).includes(tag.name)) {
        notTags.update((value) => {
          value.add(tag.name);
          return value;
        });
        return false;
      } else {
        return true;
      }
    }
  }

  function negateTag(tag: TaglistTag) {
    localFormDataStore.update((formData) => {
      const tags = TaglistTag.validateSyntax((formData.get(TAGLIST_NAME) as string) ?? '');

      const index = tags.findIndex((t) => t.name === tag.name);

      if (index !== -1) {
        tags[index] = tags[index].negate();
      }

      formData.set(TAGLIST_NAME, TaglistTag.toTaglist(tags));
      return formData;
    });
  }

  function deleteTag(tag: TaglistTag) {
    localFormDataStore.update((formData) => {
      const tags = TaglistTag.validateSyntax((formData.get(TAGLIST_NAME) as string) ?? '');
      const withoutTag = tags.filter((t) => t.name !== tag.name);
      formData.set(TAGLIST_NAME, TaglistTag.toTaglist(withoutTag));
      return formData;
    });
  }
</script>

<ol class="flex flex-col gap-2">
  {#each tags as tag (tag.name)}
    {@const displayName = $settings.sfwMode ? getSfwTag() : tag.name}
    {@const validation = validateExists(tag)}
    <li class="flex items-center gap-2" transition:wipe={{ axis: 'y', duration: 200 }}>
      <div class="text-xs font-bold uppercase">
        <Button
          variant="outline"
          class="h-6 w-[5ch] px-1 text-xs font-bold uppercase"
          on:click={(e) => {
            negateTag(tag);
            e.preventDefault();
          }}
          aria-label="Negate Tag"
        >
          {#if tag.isNegated}
            <span class="text-error">not</span>
          {:else}
            <span class="text-success">is</span>
          {/if}
        </Button>
      </div>
      <span class="break-all font-bold">
        {#await validation}
          {displayName}
        {:then isValid}
          {#if isValid}
            {displayName}
          {:else}
            <span class="underline decoration-warning decoration-wavy">{displayName}</span>
          {/if}
        {/await}
      </span>
      <Button
        variant="ghost"
        size="round-icon-sm"
        aria-label="Delete Tag"
        on:click={(e) => {
          deleteTag(tag);
          e.preventDefault();
        }}
      >
        <X />
      </Button>
      {#await validation}
        <LoadingSpinner class="size-4" />
      {:then isValid}
        {#if !isValid}
          <span class="flex items-center gap-1 text-warning">
            <TriangleAlert class="size-4 shrink-0" />
            <span class="text-center font-mono text-xs">not found</span>
          </span>
        {/if}
      {/await}
    </li>
  {/each}
</ol>
