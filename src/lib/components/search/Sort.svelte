<script lang="ts">
  import { SORT_KEY_NAME, SORT_ORDER_NAME, type Option } from '$gather/searchForm';
  import * as Select from '$components/ui/select';
  import { makeAppIdentifier } from '$lib/constants';
  import type { Selected } from 'bits-ui';
  import { getContext } from 'svelte';
  import { type SearchDataStore } from '$stores/page';

  const searchDataStore = getContext<SearchDataStore>('searchDataStore');

  export let keyValue: string;
  export let orderValue: string;
  const keyId = makeAppIdentifier('sort-key');
  const orderId = makeAppIdentifier('sort-order');

  const keyLabelsByValue: Map<string, string> = getLabelsByValue(
    $searchDataStore.searchForm.sortKeys
  );
  const orderLabelsByValue: Map<string, string> = getLabelsByValue(
    $searchDataStore.searchForm.sortOrders
  );

  function getLabelsByValue(options: Option[]): Map<string, string> {
    return new Map(options.map((item) => [item.value, item.label]));
  }

  function getSelectedValue(value: string, labelsByValue: Map<string, string>): Selected<string> {
    return {
      value,
      label: labelsByValue.get(value) ?? 'Unknown'
    };
  }

  $: selectedKey = getSelectedValue(keyValue, keyLabelsByValue);
  $: selectedOrder = getSelectedValue(orderValue, orderLabelsByValue);

  function onSelectedKeyChange(selected: Selected<string> | undefined) {
    keyValue = selected?.value ?? '';
  }

  function onSelectedOrderChange(selected: Selected<string> | undefined) {
    orderValue = selected?.value ?? '';
  }
</script>

<p class="mb-2 block text-xl font-bold">Sort</p>

<div class="grid grid-cols-2 grid-flow-row gap-2">
  <label for={keyId}>Key</label>
  <label for={orderId}>Order</label>

  <Select.Root
    bind:selected={selectedKey}
    onSelectedChange={onSelectedKeyChange}
    name={SORT_KEY_NAME}
  >
    <Select.Trigger id={keyId}>
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      {#each keyLabelsByValue.entries() as [value, label] (value)}
        <Select.Item {value} {label} />
      {/each}
    </Select.Content>
    <Select.Input />
  </Select.Root>

  <Select.Root
    bind:selected={selectedOrder}
    onSelectedChange={onSelectedOrderChange}
    name={SORT_ORDER_NAME}
  >
    <Select.Trigger id={orderId}>
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      {#each orderLabelsByValue as [value, label] (value)}
        <Select.Item {value} {label} />
      {/each}
    </Select.Content>
    <Select.Input />
  </Select.Root>
</div>
