<script lang="ts">
  import type { Page, SearchPageData } from '$stores/page';
  import Form from './search/Form.svelte';
  import List from './search/List.svelte';
  import Paginator from './search/Paginator.svelte';
  import ThemeTest from '$components/ThemeTest.svelte';
  import HeaderBox from './search/HeaderBox.svelte';
  import { formatNumber } from '../util';
  import { defaultPagination } from '$gather/pagination';

  export let page: Page<SearchPageData>;

  let curPagination = defaultPagination();

  $: {
    page.dataPromise.then((p) => {
      curPagination = p.pagination;
    });
  }
  $: totalResultCount = formatNumber(curPagination.totalResultCount);
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

    <div class="text-2xl">
      <h2 class="inline font-bold">Results</h2>
      <span>({totalResultCount})</span>
    </div>

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
