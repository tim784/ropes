import { type VariantProps, tv } from 'tailwind-variants';
export { default as Badge } from './badge.svelte';

export const badgeVariants = tv({
  base: 'focus:ring-ring text-background inline-flex select-none items-center rounded text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      red: 'bg-red-400',
      gray: 'bg-gray-400',
      sky: 'bg-sky-500',
      amber: 'bg-amber-500',
      indigo: 'bg-indigo-500',
      emerald: 'bg-emerald-500',
      outline: 'text-foreground border border-primary'
    },
    size: {
      default: 'px-2.5 py-0.5',
      tight: 'px-1 py-0.5'
    },
    hover: {
      true: '',
      false: ''
    }
  },
  compoundVariants: [
    {
      variant: 'default',
      hover: true,
      class: 'hover:bg-primary/80'
    },
    {
      variant: 'secondary',
      hover: true,
      class: 'hover:bg-secondary/80'
    },
    {
      variant: 'destructive',
      hover: true,
      class: 'hover:bg-destructive/80'
    },
    {
      variant: 'red',
      hover: true,
      class: 'hover:bg-red-400/80'
    },
    {
      variant: 'gray',
      hover: true,
      class: 'hover:bg-gray-400/80'
    },
    {
      variant: 'sky',
      hover: true,
      class: 'hover:bg-sky-500/80'
    },
    {
      variant: 'amber',
      hover: true,
      class: 'hover:bg-amber-500/80'
    },
    {
      variant: 'indigo',
      hover: true,
      class: 'hover:bg-indigo-500/80'
    },
    {
      variant: 'emerald',
      hover: true,
      class: 'hover:bg-emerald-500/80'
    },
    {
      variant: 'outline',
      hover: true,
      class: 'hover:bg-primary/20'
    }
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
    hover: false
  }
});

export type Variant = VariantProps<typeof badgeVariants>['variant'];
export type Size = VariantProps<typeof badgeVariants>['size'];
export type Hover = VariantProps<typeof badgeVariants>['hover'];
