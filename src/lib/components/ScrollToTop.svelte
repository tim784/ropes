<script lang="ts">
  import Button from './ui/Button.svelte';
  import ArrowUpToLine from 'lucide-svelte/icons/arrow-up-to-line';
  import { fly } from 'svelte/transition';
  import * as Tooltip from '$components/ui/tooltip/index.js';

  export let thresholdYPixels: number = 100;
  let visible = false;
  let ticking = false;

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Updates throttled via `requestAnimationFrame`. See explanation of this
  // technique at:
  // https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
  function scrollHandler() {
    if (!ticking) {
      requestAnimationFrame(() => {
        visible = window.scrollY > thresholdYPixels;
        ticking = false;
      });
      ticking = true;
    }
  }
</script>

<svelte:window on:scroll={scrollHandler} />

{#if visible}
  <div
    class="scroll-to-top fixed bottom-4 right-[calc(max((100%_-_2560px)_/_2,_0px)_+_16px)]"
    transition:fly={{ y: 100 }}
  >
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button on:click={scrollToTop} size="round-icon" class="border-2" builders={[builder]}>
          <ArrowUpToLine class="size-6" />
          <span class="sr-only">Scroll to top</span>
        </Button></Tooltip.Trigger
      >
      <Tooltip.Content>Scroll to top</Tooltip.Content>
    </Tooltip.Root>
  </div>
{/if}
