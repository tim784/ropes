<script lang="ts">
  import Nav from './Nav.svelte';
  import { cleanSlate } from '$actions/cleanSlate';
  import { sfwTitleSwap } from '$actions/sfwTitleSwap';
  import { darkMode } from '$actions/darkMode';
  import { theme } from '$actions/theme';
  import { page, isSearchPage } from '$stores/page';
  import Search from './Search.svelte';
  import ToastContainer from './ToastContainer.svelte';
  import { makeAppIdentifier } from '../constants';
  import { setContext } from 'svelte';
  import ScrollToTop from './ScrollToTop.svelte';

  const portalId = makeAppIdentifier('portal');
  setContext<string>('portalId', `#${portalId}`);
</script>

<div
  use:cleanSlate
  use:sfwTitleSwap
  use:darkMode
  use:theme
  class="min-h-dvh bg-background text-foreground transition-colors antialiased duration-300"
>
  <header class="sticky top-0 z-30">
    <Nav />
  </header>

  <main>
    {#if isSearchPage($page)}
      <Search page={$page} />
    {/if}
  </main>

  <ToastContainer />
  <div id={portalId} />
  <ScrollToTop />
</div>
