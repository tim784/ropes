<script lang="ts" context="module">
  import { tv } from 'tailwind-variants';

  export const variants = tv({
    base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/70',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/70',
        outline:
          'border-input bg-background hover:bg-accent hover:text-accent-foreground border active:bg-accent/70 active:border-accent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/60',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent/70 active:text-accent-foreground',
        muted: 'bg-muted text-muted-foreground hover:bg-muted/80 active:bg-muted/60'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        xs: 'rounded-md px-2',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10',
        'round-icon': 'size-10 rounded-full',
        'round-icon-sm': 'size-6 p-1 rounded-full',
        none: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
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
    size?: VariantProps<typeof variants>['size'];
    class?: string | undefined;
  };
  type $$Events = ComponentEvents<BaseButton>;

  export let className: $$Props['class'] = undefined;
  export let variant: $$Props['variant'] = 'default';
  export let size: $$Props['size'] = 'default';
  export { className as class };
</script>

<BaseButton
  class={cn(variants({ variant, size, className }))}
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
