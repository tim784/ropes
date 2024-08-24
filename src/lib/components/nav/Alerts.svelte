<script lang="ts">
  import Rss from 'lucide-svelte/icons/rss';
  import { locals } from '$stores/locals';
  import Button from '$components/ui/Button.svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import { settings } from '$stores/settings';
  import * as Tooltip from '$components/ui/tooltip/index.js';

  $: hasAlerts = $locals.alerts.length > 0;
  $: t = $settings.openNonRopesInNewTab ? { target: '_blank' } : {};
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost" size="icon" class="relative">
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder={tooltipBuilder}>
          <div use:tooltipBuilder.action {...tooltipBuilder}>
            <Rss />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content>Show Notifications</Tooltip.Content></Tooltip.Root
      >
      <span class="sr-only">Notifications</span>
      {#if hasAlerts}
        <span
          class="absolute right-1 top-1 inline-flex h-2 w-2 animate-slow-ping rounded-full bg-primary opacity-75"
        ></span>
        <span class="absolute right-1 top-1 inline-flex h-2 w-2 rounded-full bg-primary"
        ></span><span class="sr-only">Notifications Present</span>
      {:else}
        <span class="sr-only">No Notifications</span>
      {/if}
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-fit">
    <DropdownMenu.Group>
      <DropdownMenu.Label>Notifications</DropdownMenu.Label>
      <DropdownMenu.Separator />
      {#if !hasAlerts}
        <DropdownMenu.Item disabled>All caught up!</DropdownMenu.Item>
      {:else}
        {#each $locals.alerts as alert}
          <DropdownMenu.Item href={alert.href} {...t}>{alert.label}</DropdownMenu.Item>
        {/each}
      {/if}
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
