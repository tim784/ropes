<script lang="ts">
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
  import { portal } from '$stores/portal';
  import { onMount } from 'svelte';

  type $$Props = DropdownMenuPrimitive.Props;

  onMount(() => {
    console.log($portal);
  });
</script>

<DropdownMenuPrimitive.Root portal={null} {...$$restProps}>
<!-- <DropdownMenuPrimitive.Root portal={$portal} {...$$restProps} > -->
  <slot />
</DropdownMenuPrimitive.Root>
