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
  import { portal } from '$stores/portal';
</script>

<div
  class="h-[var(--header-height)] border-b bg-background/90 backdrop-blur"
>
  <div class="h-[0.25rem] bg-primary" />

  <div class="grid grid-flow-col items-center justify-between px-4 h-[calc(100%_-_0.25rem)] max-w-screen-3xl mx-auto">
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

    <!-- uncollapsed -->
    <ul class="hidden grid-flow-row gap-2 lg:grid lg:grid-flow-col">
      <li><NavMenu /></li>
      <li><SettingsButton /></li>
      <li><UnloadButton /></li>
      <li><SfwButton /></li>
      <li><Alerts /></li>
      <li><DarkModeButton /></li>
    </ul>

    <!-- collapsed. unfortunate copy-paste of content here, but i don't think
    there's any way we can structure this to be reused in both cases -->
    <div class="lg:hidden">
      <Sheet.Root portal={$portal}>
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
          <ul class="grid grid-flow-row justify-items-center gap-2">
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
