<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { filters } from '$stores/filters';
  import Filters from '$components/modals/Filters.svelte';
  import * as Dialog from '$components/ui/dialog';
  import * as ButtonRadioGroup from '$components/ui/button-radio-group';

  $: availableFilters = [...$filters.root.iter()];

  let filtersDialogOpen: boolean = false;
  let currentFilterId: string = $filters.current.id;
  $: filters.updateCurrentById(currentFilterId);

  const closeFiltersDialog = () => {
    filtersDialogOpen = false;
  };
</script>

<section>
  <ButtonRadioGroup.Root bind:value={currentFilterId} orientation="horizontal" class="inline">
    <ul class="inline-flex gap-4">
      {#each availableFilters as filter}
        <li>
          <ButtonRadioGroup.Item value={filter.id} class="font-bold">
            {filter.name}
          </ButtonRadioGroup.Item>
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
  </ButtonRadioGroup.Root>
</section>
