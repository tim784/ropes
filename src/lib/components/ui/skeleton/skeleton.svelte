<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$src/lib/components/shadcn-utils.js';

  type $$Props = HTMLAttributes<HTMLDivElement>;

  export let width: string | undefined = undefined;
  let className: $$Props['class'] = undefined;
  export { className as class };
</script>

<div class={cn('animate-pulse rounded-md bg-muted', className)} style:width {...$$restProps}>
  <slot />
</div>
