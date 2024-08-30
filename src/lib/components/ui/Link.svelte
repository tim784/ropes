<script lang="ts" context="module">
  import { tv } from 'tailwind-variants';

  export const variants = tv({
    base: 'underline-offset-4 hover:underline ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-text',
    variants: {
      variant: {
        default: 'text-primary active:text-primary/60',
        foreground: 'text-foreground active:text-foreground/60 underline hover:text-foreground/80',
        secondary: 'text-secondary-foreground active:text-secondary/60',
        muted: 'text-muted active:text-muted/60',
        none: ''
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  });
</script>

<script lang="ts">
  import { type VariantProps } from 'tailwind-variants';
  import { Button as BaseButton } from '$components/ui/base-button';
  import type { ComponentProps, ComponentEvents } from 'svelte';
  import { cn } from '$lib/components/shadcn-utils.js';

  type $$Props = ComponentProps<BaseButton> & {
    variant?: VariantProps<typeof variants>['variant'];
    class?: string | undefined;
  };
  type $$Events = ComponentEvents<BaseButton>;

  export let className: $$Props['class'] = undefined;
  export let variant: $$Props['variant'] = 'default';
  export { className as class };
</script>

<BaseButton
  class={cn(variants({ variant, className }))}
  on:click
  on:change
  on:keydown
  on:keyup
  on:mouseenter
  on:mouseleave
  on:mousedown
  on:pointerdown
  on:mouseup
  on:pointerup
  {...$$restProps}
>
  <slot />
</BaseButton>
