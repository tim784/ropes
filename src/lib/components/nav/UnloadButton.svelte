<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { enabled } from '$stores/enabled';
  import { appTitle } from '$lib/constants';
</script>

<Button variant="ghost" on:click={() => ($enabled = false)}>Unload {appTitle}</Button>
