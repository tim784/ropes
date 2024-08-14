<script lang="ts">
	import { type Variant, type Size, type Hover, badgeVariants } from "./index.js";
	import { cn } from "$src/lib/components/shadcn-utils.js";

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = "default";
	export let size: Size = "default";
	export let hover: Hover = false;
	export { className as class };
</script>

<svelte:element
	this={href ? "a" : "span"}
	{href}
	class={cn(badgeVariants({ variant, size, hover, className }))}
	{...$$restProps}
>
	<slot />
</svelte:element>
