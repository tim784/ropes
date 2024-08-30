<script lang="ts">
  import { filters } from '$stores/filters';
  import * as ButtonRadioGroup from '$components/ui/button-radio-group';
  import AddNewButton from './AddNewButton.svelte';
  import CornerDownRight from 'lucide-svelte/icons/corner-down-right';
  import { onMount } from 'svelte';
  import type { ComponentEvents } from 'svelte';

  export let selectedFilterId: string | undefined = undefined;

  function updateSelectedFilterId(event: ComponentEvents<AddNewButton>['add']) {
    if (selectedFilterId === undefined) {
      selectedFilterId = $filters.root.id;
    }
    selectedFilterId = event.detail;
  }

  onMount(() => {
    if ($filters.current.id !== $filters.root.id) {
      selectedFilterId = $filters.current.id;
    }
  });
</script>

<nav class="mx-4 my-2 flex flex-col gap-4">
  <ButtonRadioGroup.Root bind:value={selectedFilterId} orientation="horizontal">
    <ul class="">
      {#each $filters.root.children as parentFilter}
        <li>
          <ButtonRadioGroup.Item
            value={parentFilter.id}
            variant="ghost"
            size="sm"
            class="max-w-full"
          >
            <span class="max-w-full grow truncate">{parentFilter.name}</span>
          </ButtonRadioGroup.Item>
        </li>
        <ul class="mb-4 ms-4 *:my-2 *:max-w-full">
          {#each parentFilter.children as childFilter}
            <li>
              <ButtonRadioGroup.Item
                value={childFilter.id}
                variant="ghost"
                size="sm"
                class="max-w-full"
              >
                <CornerDownRight class="me-2 inline-block size-4 shrink-0" />
                <span class="max-w-full grow truncate">{childFilter.name}</span>
              </ButtonRadioGroup.Item>
            </li>
          {/each}
          <li>
            <AddNewButton on:add={updateSelectedFilterId} parent={parentFilter} />
          </li>
        </ul>
      {/each}
      <li>
        <AddNewButton on:add={updateSelectedFilterId} />
      </li>
    </ul>
  </ButtonRadioGroup.Root>
</nav>
