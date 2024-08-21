<script lang="ts">
  import { Command as CommandPrimitive } from 'cmdk-sv';
  import Search from 'lucide-svelte/icons/search';
  import { cn } from '$lib/components/shadcn-utils.js';
  import Kbd from '../Kbd.svelte';
  import { type ComponentProps } from 'svelte';

  type $$Props = CommandPrimitive.InputProps & {
    clientHeight: number;
    clientWidth: number;
    suggestionsOpen: boolean;
    el: HTMLInputElement;
    keys: ComponentProps<Kbd>['keys'];
  };

  let className: string | undefined | null = undefined;
  export { className as class };
  export let value: string = '';
  export let clientHeight: number;
  export let clientWidth: number;
  export let suggestionsOpen: boolean = false;
  export let el: HTMLInputElement;
  export let keys: ComponentProps<Kbd>['keys'] = [];
</script>

<div
  class={cn(
    'flex items-center border border-input bg-background px-2 group-focus-within:border group-focus-within:border-ring',
    suggestionsOpen ? 'rounded-t-lg' : 'rounded-lg border'
  )}
  data-cmdk-input-wrapper=""
  bind:clientHeight
  bind:clientWidth
>
  <Search class="mr-2 size-4 shrink-0 opacity-50" />
  <CommandPrimitive.Input
    class={cn(
      'flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...$$restProps}
    bind:value
    on:focus
    on:blur
    on:keydown
    bind:el
  />
  {#if keys.length > 0 && !suggestionsOpen}
    <Kbd class="text-sm" {keys} />
  {/if}
</div>
