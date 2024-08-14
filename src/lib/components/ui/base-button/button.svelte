<script lang="ts">
  import { Button as ButtonPrimitive } from 'bits-ui';
  import { type Events, type Props } from './index.js';
  import { settings } from '$stores/settings';
  import { determinePageType, PageType } from '$src/lib/stores/page.js';

  type $$Props = Props;
  type $$Events = Events;
  export let href: $$Props['href'] = undefined;
  export let type: $$Props['type'] = undefined;

  let className: $$Props['class'] = undefined;
  export let builders: $$Props['builders'] = [];

  export { className as class };

  function getTarget(href: string): { target?: string } {
    if ($settings.openNonRopesInNewTab && determinePageType(href) !== PageType.Search) {
      return { target: '_blank' };
    }
    return {};
  }
</script>

<!-- tried to do this without the if block, but typescript got in the way.
should've been doable, see how bits does it here:
https://github.com/huntabyte/bits-ui/blob/main/packages/bits-ui/src/lib/bits/button/components/button.svelte
-->
{#if href}
  <ButtonPrimitive.Root
    {builders}
    {href}
    {...getTarget(href)}
    class={className}
    {...$$restProps}
    on:click
    on:change
    on:keydown
    on:keyup
    on:mouseenter
    on:mouseleave
    on:mousedown
    on:pointerdown
    on:mouseup
    on:pointerup
  >
    <slot />
  </ButtonPrimitive.Root>
{:else}
  <ButtonPrimitive.Root
    {builders}
    class={className}
    {type}
    {...$$restProps}
    on:click
    on:change
    on:keydown
    on:keyup
    on:mouseenter
    on:mouseleave
    on:mousedown
    on:pointerdown
    on:mouseup
    on:pointerup
  >
    <slot />
  </ButtonPrimitive.Root>
{/if}
