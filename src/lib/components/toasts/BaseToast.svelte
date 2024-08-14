<script lang="ts" context="module">
  const toast = tv({
    slots: {
      base: 'rounded-lg border h-min relative drop-shadow-lg grid grid-flow-row overflow-hidden',
      progressBar: 'h-2'
    },
    variants: {
      variant: {
        default: {
          base: 'bg-popover text-popover-foreground',
          progressBar: 'bg-popover-foreground/50'
        },
        error: {
          base: 'bg-destructive text-destructive-foreground',
          progressBar: 'bg-destructive-foreground/50'
        }
      }
    },
    //use slot for bar color
    defaultVariants: {
      variant: 'default'
    }
  });
</script>

<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import X from 'lucide-svelte/icons/x';
  import { type VariantProps, tv } from 'tailwind-variants';
  import { tweened } from 'svelte/motion';
  import { onDestroy, onMount } from 'svelte';
  import { wipe } from '$src/lib/transition';

  export let dismissFn: () => void;
  export let dismissMilliseconds: number = 5_000;

  /**
   * How often to update the progress bar, in milliseconds. There's a balance
   * here:
   *
   * - Too often, and the CPU will spin making tiny updates, but will have
   *   better reactivity when the user interacts with the toast (to freeze the
   *   bar).
   * - Too infrequently, and the bar will lag before stopping when the user
   *   interacts with the toast, but will be less CPU-intensive.
   */
  export let updateIntervalMilliseconds: number = 300;

  const progress = tweened(0, { duration: updateIntervalMilliseconds });
  $: progressPercent = Math.min($progress * 100, 100);

  let className: (typeof $$props)['class'] = undefined;
  export { className as class };
  type Variant = VariantProps<typeof toast>['variant'];
  export let variant: Variant = 'default';
  let { base, progressBar } = toast({ variant, className });

  let dismissOnNextIteration = false;

  let intervalId: number | null = null;

  function stopInterval() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  function startInterval() {
    if (intervalId) {
      window.clearInterval(intervalId);
    }

    intervalId = window.setInterval(() => {
      progress.update((curValue) => {
        if (dismissOnNextIteration) {
          // double sure
          if (intervalId) {
            window.clearInterval(intervalId);
          }
          dismissFn();
          return 1;
        }
        const newValue = curValue + updateIntervalMilliseconds / dismissMilliseconds;
        if (newValue >= 1) {
          dismissOnNextIteration = true;
        }
        return newValue;
      });
    }, updateIntervalMilliseconds);
  }

  onDestroy(() => {
    if (intervalId) {
      window.clearInterval(intervalId);
    }
  });

  let pointerEntered = false;
  let focused = false;
  $: if (pointerEntered || focused) {
    stopInterval();
  } else {
    startInterval();
  }

  onMount(() => {
    startInterval();
    return () => {
      stopInterval();
    };
  });
</script>

<div
  class={base()}
  on:pointerenter={() => (pointerEntered = true)}
  on:pointerleave={() => (pointerEntered = false)}
  on:focusin={() => (focused = true)}
  on:focusout={() => (focused = false)}
  transition:wipe={{ axis: 'y' }}
>
  <!-- i'd like to use a progress bar for semantics, but styling it is too unstandardized. (see below) -->
  <!-- <progress class="toast-progress !absolute top-0 h-2 w-full" value={$progress} max="1"
    >{$progress}</progress
  > -->
  <div class={progressBar()} style:width={`${progressPercent}%`}>
    <span class="sr-only">{progressPercent}</span>
  </div>

  <div class="grid grid-cols-[1fr_auto] place-items-center gap-3 px-4 pb-4 pt-4">
    <slot />
    <Button variant="ghost" size="round-icon-sm" on:click={dismissFn}><X /></Button>
  </div>
</div>

<!-- <style lang="postcss">
  /* yikes, standardization is lacking here.*/

  /* unfilled portion */
  .toast-progress,
  .toast-progress::-webkit-progress-bar {
    @apply appearance-none bg-inherit;
  }

  /* filled portion */
  /* fuuuuu... i swear i had it working, but its regressed: chrome/edge show
  default (green) bar */
  .toast-progress::-moz-progress-bar,
  .toast-progress::-webkit-progress-value {
    @apply bg-primary;
  }
</style> -->
