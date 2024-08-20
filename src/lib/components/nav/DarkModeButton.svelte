<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { settings } from '$stores/settings';
  import Sun from 'lucide-svelte/icons/sun';
  import Moon from 'lucide-svelte/icons/moon';
</script>

<Button
  variant="ghost"
  size="icon"
  on:click={() => {
    $settings.darkMode = !$settings.darkMode;
  }}
>
  {#if $settings.darkMode}
    <Sun /><span class="sr-only">Turn on Light Color Scheme</span>
  {:else}
    <Moon /><span class="sr-only">Turn on Dark Color Scheme</span>
  {/if}
</Button>
