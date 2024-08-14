import type { Button as ButtonPrimitive } from 'bits-ui';
import Root from './button.svelte';


type Props = ButtonPrimitive.Props 

type Events = ButtonPrimitive.Events;

export {
  Root,
  type Props,
  type Events,
  //
  Root as Button,
  type Props as ButtonProps,
  type Events as ButtonEvents,
  // buttonVariants
};
