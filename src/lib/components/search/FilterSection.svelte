<script lang="ts">
  import Link from '$components/ui/Link.svelte';
  import { filters } from '$stores/filters';
  import Filters from '$components/modals/Filters.svelte';
  import * as Dialog from '$components/ui/dialog';
  import * as ButtonGroup from '$components/ui/button-group';

  let enabledFilterIds = $filters.filter((filter) => filter.enabled).map((filter) => filter.id);

  function changeEnabled(filterIds: string[]) {
    filters.update((filters) => {
      filters.forEach((filter) => {
        filter.enabled = filterIds.includes(filter.id);
      });
      return filters;
    });
  }
  $: changeEnabled(enabledFilterIds);

  let filtersDialogOpen: boolean = false;

  const closeFiltersDialog = () => {
    filtersDialogOpen = false;
  };
</script>

<section class="flex flex-wrap items-center gap-4">
  {#if $filters.length > 0}
    <ButtonGroup.Root type="multiple" bind:value={enabledFilterIds} orientation="horizontal">
      <ul class="flex flex-wrap gap-4">
        {#each $filters as filter}
          <li>
            <ButtonGroup.Item value={filter.id} class="font-bold">
              {filter.name}
            </ButtonGroup.Item>
          </li>
        {/each}
      </ul>
    </ButtonGroup.Root>
  {/if}
  <Dialog.Root bind:open={filtersDialogOpen}>
    <Dialog.Trigger asChild let:builder>
      <Link builders={[builder]} class="underline">Configure Filters</Link>
    </Dialog.Trigger>
    <Filters closeFn={closeFiltersDialog} />
  </Dialog.Root>
</section>
