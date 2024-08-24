<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive, type DropdownMenuProps} from 'bits-ui';
  import { portal } from '$stores/portal';

  type $$Props = DropdownMenuProps;
</script>

<DropdownMenuPrimitive.Root portal={$portal} {...$$restProps}>
  <slot />
</DropdownMenuPrimitive.Root>
