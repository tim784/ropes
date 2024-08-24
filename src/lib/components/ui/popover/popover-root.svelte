<script lang="ts">
	import { Popover as PopoverPrimitive } from "bits-ui";
  import { portal } from '$stores/portal';

  type $$Props = PopoverPrimitive.Props;
</script>

<PopoverPrimitive.Root portal={$portal} {...$$restProps}>
  <slot />
</PopoverPrimitive.Root>
