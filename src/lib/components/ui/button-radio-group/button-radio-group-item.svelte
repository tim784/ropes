<script lang="ts" context="module">
  import { tv } from 'tailwind-variants';
  import Button from '$components/ui/Button.svelte';
  import type { ComponentProps } from 'svelte';

  type Variant = ComponentProps<Button>['variant'];
  type VariantRecord = Record<NonNullable<Variant>, string>;

  export const variants = tv({
    base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:cursor-default',
    variants: {
      variant: {
        outline:
          'border-2 data-[state=checked]:border-primary data-[state=checked]:hover:bg-inherit data-[state=checked]:active:border-primary data-[state=checked]:active:border-primary',
        ghost:
          'data-[state=checked]:bg-primary data-[state=checked]:active:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:hover:bg-primary'
      } as VariantRecord
    },
    defaultVariants: {
      variant: 'outline' as Variant
    }
  });
</script>

<script lang="ts">
  import { RadioGroup } from 'bits-ui';
  import { cn } from '$lib/components/shadcn-utils.js';

  type $$Props = Omit<RadioGroup.ItemProps, 'asChild' | 'builder'> & {
    size?: ComponentProps<Button>['size'];
    variant?: ComponentProps<Button>['variant'];
  };

  let className: $$Props['class'] = undefined;
  export { className as class };
  export let value: $$Props['value'];
  export let size: $$Props['size'] = 'default';
  export let variant: $$Props['variant'] = 'outline';
</script>

<RadioGroup.Item {value} asChild let:builder>
  <Button builders={[builder]} {variant} {size} class={cn(variants({ variant }), className)}>
    <slot />
  </Button>
</RadioGroup.Item>
