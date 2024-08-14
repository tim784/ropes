<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { currentModal } from '$stores/modal';
  import Settings from '../modals/Settings.svelte';
</script>

<Button variant="ghost" on:click={() => currentModal.set(Settings)}>Settings</Button>
