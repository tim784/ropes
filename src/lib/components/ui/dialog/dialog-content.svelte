<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import X from 'lucide-svelte/icons/x';
  import * as Dialog from './index.js';
  import { cn, flyAndScale } from '$lib/components/shadcn-utils.js';

  type $$Props = DialogPrimitive.ContentProps & {
    // my modification. i want to be able to style this.
    closeClass?: string;
  };

  let className: $$Props['class'] = undefined;
  export let transition: $$Props['transition'] = flyAndScale;
  export let transitionConfig: $$Props['transitionConfig'] = {
    duration: 200
  };

  // my modification. i want to be able to style this.
  let closeClassName: $$Props['closeClass'] = undefined;
  export {
    className as class,

    // my modification. i want to be able to style this.
    closeClassName as closeClass
  };
</script>

<!--
@component

## Props

- `transition` - A transition function to apply to the dialog content. Defaults to `flyAndScale`.
- `transitionConfig` - Configuration for the transition function. Defaults to `{ duration: 200 }`.
- `class` -  A string to merge with this component's default classes.
- `closeClass` - A string to merge with the close button's default classes. Has no effect if the `close` slot is used.

## Slots

- `close` - A close button to dismiss the dialog.

-->

<Dialog.Portal>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    {transition}
    {transitionConfig}
    class={cn(
      'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full',
      className
    )}
    {...$$restProps}
  >
    <slot />

    <!-- slotted to customize -->
    <slot name="close">
      <DialogPrimitive.Close
        class={cn(
          'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
          closeClassName
        )}
      >
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </DialogPrimitive.Close>
    </slot>
  </DialogPrimitive.Content>
</Dialog.Portal>
