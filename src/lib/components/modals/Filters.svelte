<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import X from 'lucide-svelte/icons/x';
  import * as Dialog from '$components/ui/dialog';
  import { fade } from 'svelte/transition';
  import Editor from './filters/Editor.svelte';
  import FilterList from './filters/FilterList.svelte';
  import { filterStore } from '$stores/filters';

  export let closeFn: () => void;

  let selectedFilterId: string | undefined = undefined;
  $: selectedFilter = $filterStore.find((filter) => filter.id === selectedFilterId);

  let editorContainer: HTMLElement | null = null;
</script>

<Dialog.Content
  class="w-full max-w-none gap-0 overflow-hidden p-0 sm:w-3/4 sm:max-w-[80ch] md:w-3/4"
  transition={fade}
>
  <header
    class="sticky top-0 z-10 flex items-baseline justify-between border-b bg-background px-8 py-4"
  >
    <h2 class="m-0 text-2xl font-bold">Filters</h2>

    <Button
      variant="ghost"
      size="icon"
      type="button"
      class="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      on:click={closeFn}><X /><span class="sr-only">Close</span></Button
    >
  </header>

  <div class="grid grid-cols-[8fr_13fr] hyphens-auto">
    <aside class="h-[50dvh] overflow-x-hidden border-r">
      <FilterList bind:selectedFilterId />
    </aside>

    <div class="h-[50dvh] overflow-y-scroll" bind:this={editorContainer}>
      {#if selectedFilter}
        {#key selectedFilterId}
          <Editor filter={selectedFilter} scrollingContainer={editorContainer} />
        {/key}
      {/if}
    </div>
  </div>

  <div slot="close" />
</Dialog.Content>
