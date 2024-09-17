<script lang="ts">
  import * as Select from '$components/ui/select';
  import { type Selected } from 'bits-ui';
  import { type SearchDataStore } from '$stores/page';
  import { SORT_CRITERIA_NAME, type Option } from '$gather/searchForm';
  import { makeAppIdentifier } from '$lib/constants';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  const localFormDataStore = getContext<Writable<FormData>>('localFormDataStore');
  const searchDataStore = getContext<SearchDataStore>('searchDataStore');

  const sortCriteriaId = makeAppIdentifier('sort-criterion');

  const defaultCriterionValue = 'time';

  let selected: Selected<string>;
  let sortCriteria: Option[] = $searchDataStore.searchForm.sortCriteria;

  function makeSelectedFromFormData(formData: FormData, sortCriteria: Option[]) {
    const value = formData.get(SORT_CRITERIA_NAME)?.toString() ?? defaultCriterionValue;
    const label = sortCriteria.find((sc) => sc.value === value)?.label ?? 'didnt find';

    return {
      value,
      label
    } as Selected<string>;
  }

  $: selected = makeSelectedFromFormData($localFormDataStore, sortCriteria);

  // and when user selects, also set form data
  function onSelectedChange(selected: Selected<string> | undefined) {
    if (selected) {
      localFormDataStore.update((formData) => {
        formData.set(SORT_CRITERIA_NAME, selected.value);
        return formData;
      });
    }
  }
</script>

<label class="mb-2 block text-xl font-bold" for={sortCriteriaId}>Sort Criteria</label>

<Select.Root {selected} {onSelectedChange} name={SORT_CRITERIA_NAME}>
  <Select.Trigger id={sortCriteriaId}>
    <Select.Value />
  </Select.Trigger>
  <Select.Content>
    {#each sortCriteria as { value, label: displayName } (value)}
      <Select.Item {value} label={displayName} />
    {/each}
  </Select.Content>
</Select.Root>
