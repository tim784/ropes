<script lang="ts">
  import type { LatestForumPost } from '$gather/latestForumPosts';
  import { settings } from '$stores/settings';
  import { getSfwPostTitle } from '$src/lib/sfwMode';
  import Button from '$components/ui/Button.svelte';
  import Link from '$components/ui/Link.svelte';
  import { onMount } from 'svelte';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import ArrowLeft from 'lucide-svelte/icons/arrow-left';
  import { fade } from 'svelte/transition';

  export let autoNextDuration = 10_000;

  export let posts: LatestForumPost[] = [];
  let shownPostIndex = 0;
  let intervalId: number | null = null;
  let pointerEntered = false;
  let focused = false;
  $: if (pointerEntered || focused) {
    stopInterval();
  } else {
    startInterval();
  }

  function incrementIndex() {
    shownPostIndex = (shownPostIndex + 1) % posts.length;
  }

  function decrementIndex() {
    shownPostIndex = (shownPostIndex - 1 + posts.length) % posts.length;
  }

  function startInterval() {
    if (intervalId) {
      clearInterval(intervalId);
    }

    intervalId = window.setInterval(() => {
      incrementIndex();
    }, autoNextDuration);
  }

  function stopInterval() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
  
  onMount(() => {
    startInterval();
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  });
</script>

{#if posts.length > 0}
  <!-- first time with focusin/out. these are needed because we want to react to
  these events that actually target children, but focus/blur do not bubble.
  while focusin/out do. -->
  <div
    class="grid grid-cols-[auto_minmax(10ch,_50ch)_auto] gap-2"
    on:pointerenter={() => pointerEntered = true}
    on:focusin={() => focused = true}
    on:pointerleave={() => pointerEntered = false}
    on:focusout={() => focused = false}
  >
    <Button
      variant="ghost"
      size="round-icon-sm"
      on:click={decrementIndex}
      aria-label="previous thread"
    >
      <ArrowLeft />
    </Button>

    <!-- little hack here: this is relative because we will have two elements
      in here while the links transition, and don't want them to contribute to
      layout. a relative container with absolute items makes them appear in the
      same spot. -->
    <div class="relative">
      {#key posts[shownPostIndex].href}
        <div transition:fade class="absolute w-full text-center truncate">
            <Link href={posts[shownPostIndex].href}>
              {$settings.sfwMode ? getSfwPostTitle() : posts[shownPostIndex].title}
            </Link>
        </div>
      {/key}
    </div>

    <Button variant="ghost" size="round-icon-sm" on:click={incrementIndex} aria-label="next thread">
      <ArrowRight />
    </Button>
  </div>
{:else}
  <p class="text-sm text-muted-foreground">No forum threads to show.</p>
{/if}
