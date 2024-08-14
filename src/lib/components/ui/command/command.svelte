<script lang="ts">
	import { Command as CommandPrimitive } from "cmdk-sv";
	import { cn } from "$lib/components/shadcn-utils.js";

	type $$Props = CommandPrimitive.CommandProps;

	export let value: $$Props["value"] = undefined;

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<CommandPrimitive.Root
	class={cn(
		"text-popover-foreground flex h-full w-full flex-col",
		className
	)}
	bind:value
	{...$$restProps}
>
	<slot />
</CommandPrimitive.Root>
