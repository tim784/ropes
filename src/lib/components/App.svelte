<script lang="ts">
  import Nav from './Nav.svelte';
  import { cleanSlate } from '$actions/cleanSlate';
  import { addOurStylesheet } from '$actions/addOurStylesheet';
  import { sfwTitleSwap } from '$actions/sfwTitleSwap';
  import { darkMode } from '$actions/darkMode';
  import { theme } from '$actions/theme';
  import { page, isSearchPage } from '$stores/page';
  import Search from './Search.svelte';
  import ToastContainer from './ToastContainer.svelte';
  import { makeAppIdentifier, appId } from '$lib/constants';
  import { setContext } from 'svelte';
  import ScrollToTop from './ScrollToTop.svelte';
  import { enabled } from '$stores/enabled';

  const portalId = makeAppIdentifier('portal');
  setContext<string>('portalId', `#${portalId}`);

</script>

{#if $enabled}
  <div
    id={appId}
    use:addOurStylesheet
    use:cleanSlate
    use:sfwTitleSwap
    use:darkMode
    use:theme
    class="min-h-dvh bg-background text-foreground antialiased transition-colors duration-300"
  >
    <header class="sticky top-0 z-30">
      <Nav />
    </header>

    <main class="relative mx-auto max-w-screen-3xl">
      {#if isSearchPage($page)}
        <Search page={$page} />
      {/if}
    </main>

    <ToastContainer />
    <div id={portalId} />
    <ScrollToTop />
  </div>
{/if}
