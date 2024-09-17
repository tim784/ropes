<script lang="ts">
  import { type Option, SORT_ORDER_NAME } from '$gather/searchForm';
  import { type Selected } from 'bits-ui';
  import * as Select from '$components/ui/select';
  import { makeAppIdentifier } from '$lib/constants';
  import type { Writable } from 'svelte/store';
  import { getContext } from 'svelte';
  import { type SearchDataStore } from '$stores/page';

  const localFormDataStore = getContext<Writable<FormData>>('localFormDataStore');
  const searchDataStore = getContext<SearchDataStore>('searchDataStore');

  const sortOrderId = makeAppIdentifier('sort-order');

  const defaultOrderValue = 'desc';

  let selected: Selected<string>;
  let sortOrders: Option[] = $searchDataStore.searchForm.sortOrders;

  function makeSelectedFromFormData(formData: FormData, sortOrders: Option[]) {
    const value = formData.get(SORT_ORDER_NAME)?.toString() ?? defaultOrderValue;
    const label = sortOrders.find((so) => so.value === value)?.label ?? 'didnt find';

    return {
      value,
      label
    } as Selected<string>;
  }

  $: selected = makeSelectedFromFormData($localFormDataStore, sortOrders);

  // and when user selects, also set form data
  function onSelectedChange(selected: Selected<string> | undefined) {
    if (selected) {
      localFormDataStore.update((formData) => {
        formData.set(SORT_ORDER_NAME, selected.value);
        return formData;
      });
    }
  }
</script>

<label class="mb-2 block text-xl font-bold" for={sortOrderId}>Sort Order</label>

<Select.Root {selected} {onSelectedChange}>
  <Select.Trigger id={sortOrderId}>
    <Select.Value />
  </Select.Trigger>
  <Select.Content>
    {#each sortOrders as { value, label: displayName } (value)}
      <Select.Item {value} label={displayName} />
    {/each}
  </Select.Content>
</Select.Root>
