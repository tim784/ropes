<script lang="ts">
  import { makeAppIdentifier } from '$lib/constants';
  import { Switch } from '$components/ui/switch';
  import { SET_DEFAULT_NAME } from '$gather/searchForm';
  import { getContext } from 'svelte';
  import {type SearchDataStore } from '$stores/page';

  const searchDataStore = getContext<SearchDataStore>('searchDataStore');

  const makeDefaultId = makeAppIdentifier('make-default');
  const makeDefaultLabelId = makeAppIdentifier('make-default-label');

  export let value: string

  function onCheckedChange(checked: boolean) {
    value = checked ? $searchDataStore.searchForm.setDefaultValue : '';
  }
</script>

<div class="grid grid-flow-col items-baseline justify-between gap-2">
  <label class="mb-2 block text-xl font-bold" for={makeDefaultId} id={makeDefaultLabelId}
    >Set as Default Search</label
  >

  <Switch
    id={makeDefaultId}
    class="justify-self-end"
    checked={value !== ''}
    {onCheckedChange}
    aria-labelledby={makeDefaultLabelId}
    name={SET_DEFAULT_NAME}
    {value}
    includeInput={true}
  />
</div>
