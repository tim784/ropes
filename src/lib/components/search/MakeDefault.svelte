<script lang="ts">
  import { localFormData } from '$src/lib/stores/localFormData';
  import { makeAppIdentifier } from '$lib/constants';
  import { Switch } from '$lib/components/ui/switch';
  import { SET_DEFAULT_NAME } from '$gather/search';

  const makeDefaultId = makeAppIdentifier('make-default');

  let checked: boolean = false;

  // reset whenever page changes. this is a destructive action. users should
  // always opt-in, regardless of formData
  $: checked = $localFormData.d.get(SET_DEFAULT_NAME) !== null;

  // when user selects, also set form data
  function onCheckedChange(selected: boolean | undefined) {
    if (selected !== undefined) localFormData.setMakeDefaultSearch(selected);
  }
</script>

<div class="grid grid-flow-col items-baseline justify-between gap-2">
  <label class="mb-2 block text-xl font-bold" for={makeDefaultId}>Make Default</label>

  <Switch id={makeDefaultId} class="justify-self-end" bind:checked {onCheckedChange} />
</div>
