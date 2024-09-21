<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { getContext } from 'svelte';
  import { type PageDataStore } from '$stores/page';
  import { settings } from '$stores/settings';
  import { cn } from '$components/shadcn-utils.js';

  export let pageNumber: number;
  export let disabled = false;
  export let isActive = false;

  function getUrlForPage(pageNumber: number): string {
    const newUrl = new URL($pageDataStore.url);
    newUrl.searchParams.set('page', pageNumber.toString());
    return newUrl.toString();
  }

  const pageDataStore = getContext<PageDataStore>('pageDataStore');
  const activeClass =
    'cursor-default border-2 border-primary hover:bg-background active:border-primary active:bg-background';

  $: urlForPage = getUrlForPage(pageNumber);
  $: href = $settings.spaMode || disabled ? undefined : urlForPage;
  $: onClickFn =
    $settings.spaMode && !disabled ? () => pageDataStore.navigate(urlForPage) : undefined;
</script>

<Button
  size="sm"
  variant="outline"
  {disabled}
  class={cn('font-bold', isActive ? activeClass : '')}
  {href}
  on:click={onClickFn}
>
  <slot>
    <!-- default if not overridden (e.g., chevrons) -->
    {pageNumber}
  </slot>
</Button>
