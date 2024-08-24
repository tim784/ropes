<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import { portal } from '$stores/portal';

  type $$Props = DialogPrimitive.Props;
</script>

<DialogPrimitive.Root portal={$portal} {...$$restProps}>
  <slot />
</DialogPrimitive.Root>
