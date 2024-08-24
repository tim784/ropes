<script lang="ts">
  import { Select as SelectPrimitive, type SelectPropsWithoutHTML } from 'bits-ui';
  import { portal } from '$stores/portal';

  type $$Props = SelectPropsWithoutHTML;
</script>

<SelectPrimitive.Root portal={$portal} {...$$restProps}>
  <slot />
</SelectPrimitive.Root>
