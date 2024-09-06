<script lang="ts" generics="T, Multiple extends boolean = false">
  import { Select as SelectPrimitive, type SelectProps } from 'bits-ui';
  import { portal } from '$stores/portal';

  type $$Props = SelectProps<T, Multiple>;

  export let required: $$Props['required'] = undefined;
  export let disabled: $$Props['disabled'] = undefined;
  export let preventScroll: $$Props['preventScroll'] = undefined;
  export let loop: $$Props['loop'] = undefined;
  export let closeOnEscape: $$Props['closeOnEscape'] = undefined;
  export let closeOnOutsideClick: $$Props['closeOnOutsideClick'] = undefined;
  // export let portal: $$Props["portal"] = undefined; // we want to predefine this for our app
  export let name: $$Props['name'] = undefined;
  export let multiple: $$Props['multiple'] = false as Multiple;
  export let selected: $$Props['selected'] = undefined;
  export let onSelectedChange: $$Props['onSelectedChange'] = undefined;
  export let open: $$Props['open'] = undefined;
  export let onOpenChange: $$Props['onOpenChange'] = undefined;
  export let items: $$Props['items'] = [];
  export let onOutsideClick: $$Props['onOutsideClick'] = undefined;
</script>

<SelectPrimitive.Root
  bind:required
  bind:disabled
  bind:preventScroll
  bind:loop
  bind:closeOnEscape
  bind:closeOnOutsideClick
  portal={$portal}
  bind:name
  bind:multiple
  bind:selected
  bind:onSelectedChange
  bind:open
  bind:onOpenChange
  bind:items
  bind:onOutsideClick
  {...$$restProps}
>
  <slot />
</SelectPrimitive.Root>
