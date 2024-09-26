<script lang="ts">
  import { filterStore } from '$stores/filters';
  import * as ButtonRadioGroup from '$components/ui/button-radio-group';
  import AddNewButton from './AddNewButton.svelte';
  import type { ComponentEvents } from 'svelte';

  export let selectedFilterId: string | undefined =
    $filterStore.length > 0 ? $filterStore[0].id : undefined;

  function updateSelectedFilterId(event: ComponentEvents<AddNewButton>['add']) {
    selectedFilterId = event.detail;
  }
</script>

<nav class="m-4 flex flex-col gap-4">
  <ButtonRadioGroup.Root bind:value={selectedFilterId} orientation="horizontal">
    <ul class="space-y-2 list-disc ms-4">
      {#each $filterStore as filter (filter.id)}
        <li>
          <ButtonRadioGroup.Item value={filter.id} variant="ghost" size="sm" class="max-w-full">
            <span class="max-w-full grow truncate">{filter.name}</span>
          </ButtonRadioGroup.Item>
        </li>
      {/each}
    </ul>
  </ButtonRadioGroup.Root>

  {#if $filterStore.length > 0}
    <hr class="h-px w-full bg-border" />
  {/if}

  <AddNewButton on:add={updateSelectedFilterId} />
</nav>
