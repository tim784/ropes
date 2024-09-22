<script lang="ts">
  import { settings } from '$stores/settings';
  import RichTagInput from './RichTagInput.svelte';
  import { Taglist, TaglistWarnings } from '$lib/tag';
  import Button from '$components/ui/Button.svelte';
  import ManualTaglist from './ManualTaglist.svelte';
  import * as Popover from '$components/ui/popover/index.js';
  import Info from 'lucide-svelte/icons/info';
  import { Switch } from '$lib/components/ui/switch';
  import { TAGLIST_NAME } from '$gather/searchForm';
  import { makeAppIdentifier } from '$lib/constants';
  import AddedTags from './AddedTags.svelte';
  import { type ComponentEvents } from 'svelte';

  export let value: string;

  const tagsElementId = makeAppIdentifier('tags-entry');
  const richTagsSwitchId = makeAppIdentifier('rich-tag-toggle');
  const richTagsSwitchLabelId = makeAppIdentifier('rich-tag-toggle-label');

  let inRichTagMode = $settings.preferRichTagMode;

  $: taglistResult = Taglist.fromString(value);
  $: taglistWarnings = taglistResult.success ? taglistResult.value.warnings : [];
  $: inRichTagMode = inRichTagMode && taglistResult.success;

  // TODO handle empty value case

  function handleTagAdd(event: ComponentEvents<RichTagInput>['tagadd']) {
    if (taglistResult.success) {
      taglistResult.value.add(event.detail);
      value = taglistResult.value.toString();
    }
  }

  function handleTagDelete(event: ComponentEvents<AddedTags>['tagdelete']) {
    if (taglistResult.success) {
      taglistResult.value.removeIndex(event.detail);
      value = taglistResult.value.toString();
    }
  }

  function handleTagNegate(event: ComponentEvents<AddedTags>['tagnegate']) {
    if (taglistResult.success) {
      taglistResult.value.tags[event.detail] = taglistResult.value.tags[event.detail].negate();
      value = taglistResult.value.toString();
    }
  }
</script>

<label for={tagsElementId} class="text-xl font-bold">Tags</label>

<div class="space-y-4">
  {#if taglistResult.success && inRichTagMode}
    <RichTagInput taglist={taglistResult.value} on:tagadd={handleTagAdd} />
    {#if taglistResult.value.tags.length > 0}
      <AddedTags
        taglist={taglistResult.value}
        on:tagdelete={handleTagDelete}
        on:tagnegate={handleTagNegate}
      />
    {/if}
  {:else}
    <ManualTaglist bind:value />
  {/if}
</div>

<input type="hidden" name={TAGLIST_NAME} {value} />

<div class="grid grid-cols-[auto_auto_1fr] items-center gap-2">
  <label for={richTagsSwitchId} id={richTagsSwitchLabelId}>Use Rich Tag Mode</label>

  <div>
    {#if !taglistResult.success}
      <Popover.Root>
        <Popover.Trigger asChild let:builder>
          <Button builders={[builder]} type="button" variant="ghost" size="icon">
            <Info class="size-5 text-warning" />
            <span class="sr-only">Show Rich Tag Mode Errors</span>
          </Button>
        </Popover.Trigger>
        <Popover.Content>
          <div class="w-64 text-sm *:mb-4 last:*:mb-0">
            <p>Rich Tag Mode does not support some syntax present in your taglist:</p>
            <p>
              <output class="font-mono text-error text-sm">
                {taglistResult.error.message}
              </output>
            </p>
            <p>You can fix the above reason, or simply use this manual mode.</p>
          </div>
        </Popover.Content>
      </Popover.Root>
    {/if}
  </div>

  <Switch
    id={richTagsSwitchId}
    aria-labelledby={richTagsSwitchLabelId}
    class="justify-self-end"
    disabled={!taglistResult.success}
    bind:checked={inRichTagMode}
  />
</div>

<ul>
  {#each taglistWarnings as warning}
    <li class="text-warning">
      {#if warning === TaglistWarnings.OnlyNegated}
        You have only negated tags. This search will return no results.
      {:else}
        Unknown warning: {warning}
      {/if}
    </li>
  {/each}
</ul>
