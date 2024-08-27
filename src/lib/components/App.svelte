<script lang="ts">
  import Nav from './Nav.svelte';
  import { addAppStylesheet } from '$actions/addAppStylesheet';
  import { sfwTitleSwap } from '$actions/sfwTitleSwap';
  import { darkMode } from '$actions/darkMode';
  import { addPortal } from '$actions/addPortal';
  import { theme } from '$actions/theme';
  import { cleanseEmpornium } from '$actions/cleanseEmpornium';
  import { page, isSearchPage } from '$stores/page';
  import Search from './Search.svelte';
  import ToastContainer from './ToastContainer.svelte';
  import ScrollToTop from './ScrollToTop.svelte';
  import { enabled } from '$stores/enabled';
</script>

{#if $enabled}
  <div
    use:addAppStylesheet
    use:cleanseEmpornium
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
      {#if isSearchPage($page)}
        <Search page={$page} />
      {/if}
    </main>

    <ToastContainer />
    <ScrollToTop />
  </div>
{/if}
