<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import { portal } from '$stores/portal';

  type $$Props = TooltipPrimitive.Props;
</script>

<TooltipPrimitive.Root portal={$portal}>
  <slot />
</TooltipPrimitive.Root>
