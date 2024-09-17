<script lang="ts">
  import { settings } from '$stores/settings';
  import RichTagInput from './RichTagInput.svelte';
  import { TaglistTag, ParseError } from '$lib/tag';
  import Button from '$components/ui/Button.svelte';
  import ManualTaglist from './ManualTaglist.svelte';
  import * as Popover from '$src/lib/components/ui/popover/index.js';
  import Info from 'lucide-svelte/icons/info';
  import { Switch } from '$lib/components/ui/switch';
  import { TAGLIST_NAME } from '$src/lib/gather/searchForm';
  import { makeAppIdentifier } from '$lib/constants';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  const localFormDataStore = getContext<Writable<FormData>>('localFormDataStore');
  const tagsElementId = makeAppIdentifier('tags-entry');
  const richTagsSwitchId = makeAppIdentifier('rich-tag-toggle');
  const richTagsSwitchLabelId = makeAppIdentifier('rich-tag-toggle-label');

  let tagsInvalidReason: null | string = null;
  let useRichTagMode = $settings.preferRichTagMode;

  $: taglist = $localFormDataStore.get(TAGLIST_NAME)?.toString() || '';
  $: tagsInvalidReason = validateSyntax(taglist);
  $: canUseRichTagMode = !tagsInvalidReason;

  // only if we can't use rich tag mode, disable it
  $: if (!canUseRichTagMode) {
    useRichTagMode = false;
  }

  function validateSyntax(taglist: string): null | string {
    try {
      TaglistTag.validateSyntax(taglist);
    } catch (e) {
      if (e instanceof ParseError) {
        return e.message;
      } else {
        console.error('Unexpected error while validating tag syntax', e);
        throw e;
      }
    }
    return null;
  }
</script>

<label for={tagsElementId} class="text-xl font-bold">Tags</label>

{#if useRichTagMode}
  <div>
    <RichTagInput />
  </div>
{:else}
  <div>
    <ManualTaglist />
  </div>
{/if}

<input type="hidden" name={TAGLIST_NAME} value={taglist} />

<div class="grid grid-cols-[auto_auto_1fr] items-center gap-2">
  <label for={richTagsSwitchId} id={richTagsSwitchLabelId}>Use Rich Tag Mode</label>

  <div>
    {#if tagsInvalidReason}
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
              {tagsInvalidReason}
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
    disabled={!canUseRichTagMode}
    bind:checked={useRichTagMode}
  />
</div>
