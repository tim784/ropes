<script lang="ts">
  import type { Page, SearchPageData } from '$stores/page';
  import Form from './search/Form.svelte';
  import List from './search/List.svelte';
  import Paginator from './search/Paginator.svelte';
  import ThemeTest from '$components/ThemeTest.svelte';
  import HeaderBox from './search/HeaderBox.svelte';
  import FilterSection from './search/FilterSection.svelte';
  import { formatNumber } from '../util';
  import { defaultPagination } from '$gather/pagination';
  import { writable } from 'svelte/store';
  import { setContext } from 'svelte';
  import InlineSeparator from '$components/ui/InlineSeparator.svelte';

  export let page: Page<SearchPageData>;
  const filteredCountStore = writable(0);
  setContext('filteredCountStore', filteredCountStore);

  let curPagination = defaultPagination();

  $: {
    page.dataPromise.then((p) => {
      curPagination = p.pagination;
    });
  }
  $: totalResultCount = formatNumber(curPagination.totalResultCount);
  $: start = formatNumber(curPagination.thisPageRange.start);
  $: end = formatNumber(curPagination.thisPageRange.end);
</script>

<div class="relative flex flex-col items-start overflow-visible bg-inherit md:flex-row">
  <aside
    class="w-full bg-background p-4 md:sticky md:left-0 md:top-[var(--header-height)] md:h-[calc(100vh_-_var(--header-height))] md:min-w-[var(--search-form-width)] md:max-w-[var(--search-form-width)] md:overflow-y-scroll md:border-r"
  >
    <Form />
  </aside>

  <div class="w-full space-y-4 px-16 py-4">
    {#if import.meta.env.DEV}
      <ThemeTest />
    {/if}

    <HeaderBox />

    <div>
      <h2 class="inline text-2xl font-bold">Results</h2>
      <span class="text-xl">{start}–{end} of {totalResultCount}</span>
      {#if $filteredCountStore > 0}
        <InlineSeparator />
        <span class="text-xl"> {formatNumber($filteredCountStore)} filtered</span>
      {/if}
    </div>

    <FilterSection />

    <Paginator {page} />

    <List
      mePromise={page.dataPromise.then((p) => p.me)}
      torrentsPromise={page.dataPromise.then((p) => p.torrents)}
    />

    <Paginator {page} />
  </div>
</div>

<style>
</style>
