<script lang="ts">
  import { localFormData } from '$src/lib/stores/localFormData';
  import { page, isSearchPage } from '$stores/page';
  import { type Option, SORT_ORDER_NAME } from '$src/lib/gather/search';
  import { type Selected } from 'bits-ui';
  import * as Select from '$components/ui/select';
  import { makeAppIdentifier } from '$lib/constants';

  const sortOrderId = makeAppIdentifier('sort-order');
  const defaultOrderValue = 'desc';

  let selected: Selected<string>;
  let sortOrders: Option[] = [];

  function makeSelectedFromFormData(formData: FormData, sortOrders: Option[]) {
    const value = formData.get(SORT_ORDER_NAME)?.toString() ?? defaultOrderValue;
    const label = sortOrders.find((so) => so.value === value)?.label ?? 'didnt find';

    return {
      value,
      label
    } as Selected<string>;
  }

  // set initial value and sort orders
  if (isSearchPage($page)) {
    $page.dataPromise.then((data) => {
      const pageSearchForm = data.search;
      sortOrders = pageSearchForm.sortOrders;
      selected = makeSelectedFromFormData(pageSearchForm.formData, sortOrders);
    });
  }

  $: selected = makeSelectedFromFormData($localFormData.d, sortOrders);

  // and when user selects, also set form data
  function onSelectedChange(selected: Selected<string> | undefined) {
    if (selected) localFormData.setSortOrder(selected.value);
  }
</script>

<label class="mb-2 block font-bold text-xl" for={sortOrderId}>Sort Order</label>

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
