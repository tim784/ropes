<script lang="ts">
  import { makeAppIdentifier } from '$lib/constants';
  import { Switch } from '$lib/components/ui/switch';
  import { SET_DEFAULT_NAME } from '$src/lib/gather/searchForm';
  import { getContext } from 'svelte';
  import { type LocalFormDataStore } from '$stores/localFormData';

  const localFormDataStore = getContext<LocalFormDataStore>('localFormDataStore');
  const makeDefaultId = makeAppIdentifier('make-default');
  const makeDefaultLabelId = makeAppIdentifier('make-default-label');

  let checked: boolean = false;

  $: checked = $localFormDataStore.get(SET_DEFAULT_NAME) !== null;

  // when user selects, also set form data
  function onCheckedChange(selected: boolean | undefined) {
    if (selected !== undefined) {
      localFormDataStore.update((formData) => {
        if (selected) {
          formData.set(SET_DEFAULT_NAME, '');
        } else {
          formData.delete(SET_DEFAULT_NAME);
        }
        return formData;
      });
    }
  }
</script>

<div class="grid grid-flow-col items-baseline justify-between gap-2">
  <label class="mb-2 block text-xl font-bold" for={makeDefaultId} id={makeDefaultLabelId}
    >Make Default</label
  >

  <Switch
    id={makeDefaultId}
    class="justify-self-end"
    bind:checked
    {onCheckedChange}
    aria-labelledby={makeDefaultLabelId}
  />
</div>
