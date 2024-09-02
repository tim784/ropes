<script lang="ts">
  import { filters } from '$stores/filters';
  import * as ButtonRadioGroup from '$components/ui/button-radio-group';
  import AddNewButton from './AddNewButton.svelte';
  import type { ComponentEvents } from 'svelte';

  export let selectedFilterId: string | undefined =
    $filters.length > 0 ? $filters[0].id : undefined;

  function updateSelectedFilterId(event: ComponentEvents<AddNewButton>['add']) {
    selectedFilterId = event.detail;
  }
</script>

<nav class="mx-4 my-2 flex flex-col gap-4">
  <ButtonRadioGroup.Root bind:value={selectedFilterId} orientation="horizontal">
    <ul class="space-y-2">
      {#each $filters as filter}
        <li>
          <ButtonRadioGroup.Item value={filter.id} variant="ghost" size="sm" class="max-w-full">
            <span class="max-w-full grow truncate">{filter.name}</span>
          </ButtonRadioGroup.Item>
        </li>
      {/each}
      <li>
        <AddNewButton on:add={updateSelectedFilterId} />
      </li>
    </ul>
  </ButtonRadioGroup.Root>
</nav>
