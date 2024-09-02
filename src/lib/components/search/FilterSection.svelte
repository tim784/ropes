<script lang="ts">
  import Button from '$components/ui/Button.svelte';
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

<section>
  <ButtonGroup.Root
    type="multiple"
    bind:value={enabledFilterIds}
    orientation="horizontal"
    class="inline"
  >
    <ul class="inline-flex gap-4">
      {#each $filters as filter}
        <li>
          <ButtonGroup.Item value={filter.id} class="font-bold">
            {filter.name}
          </ButtonGroup.Item>
        </li>
      {/each}
      <li>
        <Dialog.Root bind:open={filtersDialogOpen}>
          <Dialog.Trigger asChild let:builder>
            <Button builders={[builder]} class="underline" variant="ghost">Configure Filters</Button
            >
          </Dialog.Trigger>
          <Filters closeFn={closeFiltersDialog} />
        </Dialog.Root>
      </li>
    </ul>
  </ButtonGroup.Root>
</section>
