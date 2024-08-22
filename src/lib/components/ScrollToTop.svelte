<script lang="ts">
  import { onMount } from 'svelte';
  import Button from './ui/Button.svelte';
  import ArrowUpToLine from 'lucide-svelte/icons/arrow-up-to-line';
  import { fly } from 'svelte/transition';

  export let thresholdYPixels: number = 100;
  let visible = false;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    const scrollHandler = () => {
      visible = window.scrollY > thresholdYPixels;
    };

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  });
</script>

{#if visible}
  <div class="container fixed bottom-0 scroll-to-top" transition:fly={{ y: 100 }}>
    <div class="ml-auto w-max">
      <Button on:click={scrollToTop} title="Scroll to Top" size="round-icon" class="border-2 me-4 mb-4">
        <ArrowUpToLine class="size-6" />
        <span class="sr-only">Scroll to top</span>
      </Button>
    </div>
  </div>
{/if}
