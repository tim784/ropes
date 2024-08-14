<script lang="ts">
  import { localFormData } from '$src/lib/stores/localFormData';
  import * as Select from '$components/ui/select';
  import { type Selected } from 'bits-ui';
  import { page, isSearchPage } from '$stores/page';
  import { SORT_CRITERIA_NAME, type Option } from '$src/lib/gather/search';
  import { makeAppIdentifier } from '$lib/constants';

  const sortCriteriaId = makeAppIdentifier('sort-criterion');

  const defaultCriterionValue = 'time';

  let selected: Selected<string>;
  let sortCriteria: Option[] = [];

  function makeSelectedFromFormData(formData: FormData, sortCriteria: Option[]) {
    const value = formData.get(SORT_CRITERIA_NAME)?.toString() ?? defaultCriterionValue;
    const label = sortCriteria.find((sc) => sc.value === value)?.label ?? 'didnt find';

    return {
      value,
      label
    } as Selected<string>;
  }

  // set initial value and sort criteria
  if (isSearchPage($page)) {
    $page.dataPromise.then((data) => {
      const pageSearchForm = data.search;
      sortCriteria = pageSearchForm.sortCriteria;
      selected = makeSelectedFromFormData(pageSearchForm.formData, sortCriteria);
    });
  }
  $: selected = makeSelectedFromFormData($localFormData.d, sortCriteria);

  // and when user selects, also set form data
  function onSelectedChange(selected: Selected<string> | undefined) {
    if (selected) localFormData.setSortCriteria(selected.value);
  }
</script>

<label class="mb-2 block font-bold text-xl" for={sortCriteriaId}>Sort Criteria</label>

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
