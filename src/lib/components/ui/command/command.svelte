<script lang="ts">
  import { Command as CommandPrimitive } from 'cmdk-sv';
  import { cn } from '$lib/components/shadcn-utils.js';

  type $$Props = CommandPrimitive.CommandProps;

  export let value: $$Props['value'] = undefined;

  let className: string | undefined | null = undefined;
  export { className as class };
	export let state: $$Props['state'] = undefined;
	export let loop: $$Props['loop'] = undefined;
	export let shouldFilter: $$Props['shouldFilter'] = undefined;
</script>

<CommandPrimitive.Root bind:value asChild let:root {state} {loop} {shouldFilter}>
  <div
    use:root.action
    {...root.attrs}
    class={cn('flex h-full w-full flex-col text-popover-foreground', className)}
    {...$$restProps}
  >
    <slot />
  </div>
</CommandPrimitive.Root>
