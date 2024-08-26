<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import { portal } from '$stores/portal';

  type $$Props = DialogPrimitive.Props;

  export let open = false;
</script>

<DialogPrimitive.Root portal={$portal} {...$$restProps} bind:open>
  <slot />
</DialogPrimitive.Root>
