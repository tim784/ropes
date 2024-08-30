<script lang="ts">
  import Link from '$components/ui/Link.svelte';
  import Plus from 'lucide-svelte/icons/plus';
  import { filters } from '$stores/filters';
  import { Filter } from '$lib/filter';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let parent: Filter | null = null;

  const newFilterPrefix = 'New Filter';

  function getNextNewFilterName() {
    const existingNames = new Set([...$filters.root.iter()].map((filter: Filter) => filter.name));

    if (!existingNames.has(newFilterPrefix)) return newFilterPrefix;

    for (let i = 1; ; i++) {
      const name = `${newFilterPrefix} ${i}`;
      if (!existingNames.has(name)) return name;
    }
  }

  function addNewFilter(parent: Filter | null = null) {
    const p = parent || $filters.root;
    const newFilter = new Filter(getNextNewFilterName());

    p.children.push(newFilter);
    filters.set({ root: $filters.root, current: newFilter });
    dispatch('add', newFilter.id);
    console.log('dispatched', newFilter.id);
  }
</script>

<Link class="inline-flex items-center text-sm ps-3" on:click={() => addNewFilter(parent)}
  ><Plus class="me-2 size-4" />Add new</Link
>
