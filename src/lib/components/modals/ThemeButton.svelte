<script lang="ts">
  import { type Theme, settings } from '$stores/settings';
  import Button from '$components/ui/Button.svelte';

  export let theme: Theme;

  $: isCurrent = $settings.theme === theme;
</script>

<!-- we hack in the classes a theme button by applying these styles directly -->
<Button
  class={`w-full capitalize theme-${theme} ${$settings.darkMode ? 'dark' : ''} ${isCurrent ? 'border-2 border-primary' : ''}`}
  variant="outline"
  on:click={() => ($settings.theme = theme)}
>
  <div class={`me-2 size-4 rounded-full bg-primary text-primary-foreground`} />
  {theme}
</Button>
