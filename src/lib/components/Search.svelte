<script lang="ts">
  import { type PageDataStore, type SearchDataStore, createSearchPageStore } from '$stores/page';
  import Form from './search/Form.svelte';
  import List from './search/List.svelte';
  import Paginator from './search/Paginator.svelte';
  import ThemeTest from '$components/ThemeTest.svelte';
  import HeaderBox from './search/HeaderBox.svelte';
  import FilterSection from './search/FilterSection.svelte';
  import { setContext, getContext } from 'svelte';
  import ResultsHeading from './search/ResultsHeading.svelte';
  import { derived } from 'svelte/store';
  import { combinedFilter } from '$stores/filters';

  const pageDataStore = getContext<PageDataStore>('pageDataStore');

  const searchDataStore = createSearchPageStore(pageDataStore);
  setContext<SearchDataStore>('searchDataStore', searchDataStore);

  const filteredTorrentsStore = derived(
    [searchDataStore, combinedFilter],
    ([$searchData, $filter]) => {
      return $searchData.torrents.filter((t) => $filter.filter(t));
    }
  );
  setContext('filteredTorrentsStore', filteredTorrentsStore);
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

    <ResultsHeading />

    <FilterSection />

    <Paginator />

    <List />

    <Paginator />
  </div>
</div>

<style>
</style>
