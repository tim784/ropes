<script lang="ts">
  import { settings } from '$stores/settings';
  import { wipe } from '$lib/transition';
  import Button from '$components/ui/Button.svelte';
  import { Taglist, Tag } from '$lib/tag';
  import { tagCache } from '$stores/tagCache';
  import { notTags } from '$stores/notTags';
  import { fetchAutocompleteTags } from '$api/autocomplete';
  import X from 'lucide-svelte/icons/x';
  import LoadingSpinner from '$components/ui/LoadingSpinner.svelte';
  import { getSfwTag } from '$lib/sfwMode';
  import { createEventDispatcher } from 'svelte';
  import * as Tooltip from '$components/ui/tooltip/index.js';

  export let taglist: Taglist;
  $: validations = taglist.tags.map((tag) => validateExists(tag));

  const dispatch = createEventDispatcher();

  async function validateExists(tag: Tag) {
    if ($notTags.has(tag.name)) {
      return false;
    } else if ($tagCache.has(tag.name) || $settings.sfwMode) {
      return true;
    } else {
      const matches = await fetchAutocompleteTags(tag, 'validate');
      tagCache.merge(matches);
      const exists = $tagCache.has(tag.name);
      if (!matches.map((m) => m.name).includes(tag.name)) {
        $notTags.add(tag.name);
      }
      return exists;
    }
  }

  function negateTag(index: number) {
    dispatch('tagnegate', index);
  }

  function deleteTag(index: number) {
    dispatch('tagdelete', index);
  }
</script>

<ol class="flex flex-col gap-2">
  {#each taglist.tags as tag, index (tag.name)}
    {@const displayName = $settings.sfwMode ? getSfwTag() : tag.name}
    <li class="flex items-center gap-2" transition:wipe={{ axis: 'y', duration: 200 }}>
      <div class="text-xs font-bold uppercase">
        <Button
          variant="outline"
          class="h-6 w-[5ch] px-1 text-xs font-bold uppercase"
          type="button"
          on:click={() => {
            negateTag(index);
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
        {#await validations[index]}
          <span>{displayName}</span>
        {:then isValid}
          {#if !isValid}
            <Tooltip.Root>
              <Tooltip.Trigger asChild let:builder>
                <span
                  class="cursor-help underline decoration-warning decoration-wavy"
                  use:builder.action
                  {...builder}>{displayName}</span
                ><span class="sr-only">Tag {displayName} does not exist</span>
              </Tooltip.Trigger>
              <Tooltip.Content
                >Tag <span class="font-mono font-bold">{displayName}</span>
                does not exist</Tooltip.Content
              ></Tooltip.Root
            >
          {:else}
            <span>{displayName}</span>
          {/if}
        {/await}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="round-icon-sm"
        aria-label="Delete Tag"
        on:click={() => {
          deleteTag(index);
        }}
      >
        <X />
      </Button>
      {#await validations[index]}
        <LoadingSpinner class="size-4" />
      {/await}
    </li>
  {/each}
</ol>
