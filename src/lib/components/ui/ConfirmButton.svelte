<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte';
  import Button from '$components/ui/Button.svelte';
  import { cn } from '$components/shadcn-utils.js';

  export let className: string | undefined = undefined;
  export let size: ComponentProps<Button>['size'] = 'default';
  export let quiescentVariant: ComponentProps<Button>['variant'] = 'outline';
  export let confirmVariant: ComponentProps<Button>['variant'] = 'destructive';
  export let preventDefault: boolean = true;

  let isQuiescent = true;
  const revertTimeout = 5000;
  let timeoutId: number | null = null;

  const dispatch = createEventDispatcher();

  function handleClick(e: MouseEvent) {
    if (isQuiescent) {
      // definitely preventDefault on the first click
      e.preventDefault();
      isQuiescent = false;
      timeoutId = window.setTimeout(() => {
        isQuiescent = true;
      }, revertTimeout);
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      dispatch('confirm');
      isQuiescent = true;

      // only preventDefault on the second click if the user wants it
      if (preventDefault) {
        e.preventDefault();
      }
    }
  }
</script>

<Button
  variant={isQuiescent ? quiescentVariant : confirmVariant}
  {size}
  on:click={handleClick}
  class={cn(className)}
  {...$$restProps}
>
  {#if isQuiescent}
    <slot name="quiescent" />
  {:else}
    <slot name="confirm">Are you sure?</slot>
  {/if}
</Button>
