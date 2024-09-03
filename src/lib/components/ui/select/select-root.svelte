<script lang="ts">
  import { Select as SelectPrimitive, type SelectProps } from 'bits-ui';
  import { portal } from '$stores/portal';

  type $$Props = SelectProps<string>;
</script>

<SelectPrimitive.Root portal={$portal} {...$$restProps}>
  <slot />
</SelectPrimitive.Root>
