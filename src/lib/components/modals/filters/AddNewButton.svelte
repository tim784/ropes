<script lang="ts">
  import Link from '$components/ui/Link.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { filters } from '$stores/filters';
  import { type Filter } from '$lib/filter';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  const newFilterPrefix = 'New Filter';

  function getNextNewFilterName() {
    const existingNames = new Set($filters.map((filter: Filter) => filter.name));

    if (!existingNames.has(newFilterPrefix)) return newFilterPrefix;

    for (let i = 1; ; i++) {
      const name = `${newFilterPrefix} ${i}`;
      if (!existingNames.has(name)) return name;
    }
  }

  function addNewFilter() {
    const newFilter = {
      id: globalThis.crypto.randomUUID(),
      name: getNextNewFilterName(),
      allowTags: [],
      blockTags: [],
      enabled: false
    } as Filter;

    filters.update((filters) => [...filters, newFilter]);
    dispatch('add', newFilter.id);
  }
</script>

<Link class="inline-flex items-center text-sm" on:click={addNewFilter}
  ><Plus class="me-2 size-4" />Add new</Link
>
