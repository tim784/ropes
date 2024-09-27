<script lang="ts">
  import { type PageDataStore, type SearchDataStore, createSearchPageStore } from '$stores/page';
  import Form from './search/Form.svelte';
  import List from './search/List.svelte';
  import Paginator from './search/Paginator.svelte';
  import ThemeTest from '$components/ThemeTest.svelte';
  import HeaderBox from './search/HeaderBox.svelte';
  import FilterSection from './search/FilterSection.svelte';
  import { setContext, getContext, onMount } from 'svelte';
  import ResultsHeading from './search/ResultsHeading.svelte';
  import { derived, get, writable } from 'svelte/store';
  import { combinedFilter } from '$stores/filters';
  import { seenTorrents } from '$stores/seen';

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

  // create a store that will only contain the seen torrents for this page load:
  // that's the lifetime that I want "seen" to work on. this is to prevent the
  // torrent components from being marked as seen when they come in and out of
  // existence, such as turning on/off filters. if we used the global
  // seenTorrents store, the torrent components would be marked as seen
  // immediately. Note: we gotta make a copy here. don't want to mistakenly
  // reference the global store.
  const seenTorrentsThisPageLoadStore = writable<Set<string>>(structuredClone($seenTorrents));
  setContext('seenTorrentsThisPageLoadStore', seenTorrentsThisPageLoadStore);
  onMount(() => {
    return pageDataStore.subscribe((data) => {
      if (data.isLoading) return;
      seenTorrentsThisPageLoadStore.set(structuredClone($seenTorrents));
    });
  });
</script>

<div class="relative flex flex-col items-start overflow-visible bg-inherit md:flex-row">
  <aside
    tabindex="-1"
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
