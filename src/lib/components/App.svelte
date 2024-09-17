<script lang="ts">
  import Nav from './Nav.svelte';
  import { addAppStylesheet } from '$actions/addAppStylesheet';
  import { sfwTitleSwap } from '$actions/sfwTitleSwap';
  import { darkMode } from '$actions/darkMode';
  import { addPortal } from '$actions/addPortal';
  import { theme } from '$actions/theme';
  import { cleanseEmpornium } from '$actions/cleanseEmpornium';
  import Search from './Search.svelte';
  import ToastContainer from './ToastContainer.svelte';
  import ScrollToTop from './ScrollToTop.svelte';
  import { enabled } from '$stores/enabled';
  import { setContext } from 'svelte';
  import { createPageDataStore, type PageData, createBaseDataStore } from '$stores/page';
  import { determinePageType, PageType } from '$lib/pageType';
  import { createLocalsStore } from '$stores/locals';

  const pageDataStore = createPageDataStore();
  setContext('pageDataStore', pageDataStore);

  const baseDataStore = createBaseDataStore(pageDataStore);
  setContext('baseDataStore', baseDataStore);

  const localsStore = createLocalsStore(baseDataStore);
  setContext('localsStore', localsStore);

  function getContentComponent(page: PageData) {
    switch (determinePageType(page.url)) {
      case PageType.Search:
        return Search;
      default:
        throw new Error(`Unknown page type: ${page}`);
    }
  }

  $: contentComponent = getContentComponent($pageDataStore);

  // scroll to the top of the page when the page changes
  pageDataStore.subscribe(() => window.scrollTo({ top: 0 }));
</script>

{#if $enabled}
  <div
    use:addAppStylesheet
    use:cleanseEmpornium={{ pageDataStore: pageDataStore }}
    use:sfwTitleSwap
    use:darkMode
    use:theme
    use:addPortal
    class="min-h-dvh bg-background text-foreground antialiased transition-colors duration-300"
  >
    <header class="sticky top-0 z-30">
      <Nav />
    </header>

    <main class="relative mx-auto max-w-screen-3xl">
      <svelte:component this={contentComponent} />
    </main>

    <ToastContainer />
    <ScrollToTop />
  </div>
{/if}
