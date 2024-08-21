<script lang="ts">
  import Logo from '$icons/Logo.svelte';
  import SfwButton from './nav/SfwButton.svelte';
  import { appTitle } from '$lib/constants';
  import { settings } from '$stores/settings';
  import { sfwAppSubtitle } from '$lib/sfwMode';
  import DarkModeButton from './nav/DarkModeButton.svelte';
  import UnloadButton from './nav/UnloadButton.svelte';
  import SettingsButton from './nav/SettingsButton.svelte';
  import NavMenu from './nav/NavMenu.svelte';
  import Alerts from './nav/Alerts.svelte';
  import * as Sheet from '$components/ui/sheet';
  import Hamburger from 'lucide-svelte/icons/menu';
  import Button from '$components/ui/Button.svelte';
  import { getContext } from 'svelte';

  const portalId = getContext<string>('portalId');
</script>

<div
  class="grid h-[var(--header-height)] grid-rows-[auto_1fr] border-b bg-background-darker/90 backdrop-blur"
>
  <div class="h-2 bg-gradient-to-r from-brand-2 to-brand-1" />

  <div class="grid grid-flow-col items-center justify-between px-4">
    <ul class="flex items-center">
      <li>
        <Logo class="me-2 size-8" />
      </li>

      <li>
        <h1 class="whitespace-nowrap">
          <span class="me-1 text-3xl font-black uppercase">{appTitle}</span>
          <span class="text-xl font-semibold text-muted-foreground">
            {#if $settings.sfwMode}
              {sfwAppSubtitle}
            {:else}
              for Empornium
            {/if}
          </span>
        </h1>
      </li>
    </ul>

    <ul class="hidden grid-flow-row gap-2 lg:grid lg:grid-flow-col">
      <li><NavMenu /></li>
      <li><SettingsButton /></li>
      <li><UnloadButton /></li>
      <li><SfwButton /></li>
      <li><Alerts /></li>
      <li><DarkModeButton /></li>
    </ul>

    <div class="lg:hidden">
      <Sheet.Root portal={portalId}>
        <Sheet.Trigger asChild let:builder>
          <Button builders={[builder]} variant="ghost" size="icon">
            <Hamburger />
            <span class="sr-only">Expand Navigation Menu</span>
          </Button>
        </Sheet.Trigger>
        <Sheet.Content>
          <Sheet.Header>
            <Sheet.Title class="mb-4">Ropes Navigation</Sheet.Title>
          </Sheet.Header>
          <ul class="grid grid-flow-row gap-2 justify-items-center">
            <li><NavMenu /></li>
            <li><SettingsButton /></li>
            <li><UnloadButton /></li>
            <li><SfwButton /></li>
            <li><Alerts /></li>
            <li><DarkModeButton /></li>
          </ul>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  </div>
</div>
