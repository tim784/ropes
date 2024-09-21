<script lang="ts">
  import { settings } from '$stores/settings';
  import RichTagInput from './RichTagInput.svelte';
  import { Taglist } from '$lib/tag';
  import Button from '$components/ui/Button.svelte';
  import ManualTaglist from './ManualTaglist.svelte';
  import * as Popover from '$components/ui/popover/index.js';
  import Info from 'lucide-svelte/icons/info';
  import { Switch } from '$lib/components/ui/switch';
  import { TAGLIST_NAME } from '$gather/searchForm';
  import { makeAppIdentifier } from '$lib/constants';
  import AddedTags from './AddedTags.svelte';

  export let value: string;
  $: taglistResult = Taglist.fromString(value);

  const tagsElementId = makeAppIdentifier('tags-entry');
  const richTagsSwitchId = makeAppIdentifier('rich-tag-toggle');
  const richTagsSwitchLabelId = makeAppIdentifier('rich-tag-toggle-label');

  $: inRichTagMode = $settings.preferRichTagMode && taglistResult.success;
</script>

<label for={tagsElementId} class="text-xl font-bold">Tags</label>

<div class="space-y-4">
  {#if taglistResult.success}
    <RichTagInput taglist={taglistResult.value} bind:taglistString={value} />
    {#if taglistResult.value.tags.length > 0}
      <AddedTags taglist={taglistResult.value} />
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
            <p>Rich Tag Mode does not support some syntax present in your tags:</p>
            <p class="font-mono text-warning">
              {taglistResult.error}
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
