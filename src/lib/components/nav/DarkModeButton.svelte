<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { settings } from '$stores/settings';
  import Sun from 'lucide-svelte/icons/sun';
  import Moon from 'lucide-svelte/icons/moon';
  import * as Tooltip from '$components/ui/tooltip/index.js';
</script>

<Button
  variant="ghost"
  size="icon"
  on:click={() => {
    $settings.darkMode = !$settings.darkMode;
  }}
>
  <Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
      <div use:builder.action {...builder}>
        {#if $settings.darkMode}
          <Sun /><span class="sr-only">Turn on Light Color Scheme</span>
        {:else}
          <Moon /><span class="sr-only">Turn on Dark Color Scheme</span>
        {/if}
      </div>
    </Tooltip.Trigger>
    <Tooltip.Content
      >{#if $settings.darkMode}Turn on Light Color Scheme{:else}Turn on Dark Color Scheme{/if}</Tooltip.Content
    ></Tooltip.Root
  >
</Button>
