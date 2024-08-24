<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import Settings from '../modals/Settings.svelte';
  import * as Dialog from '$lib/components/ui/dialog';

  let settingsDialogOpen: boolean = false;

  const closeSettingsDialog = () => {
    settingsDialogOpen = false;
  };
</script>

<Dialog.Root bind:open={settingsDialogOpen}>
  <Dialog.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost">Settings</Button>
  </Dialog.Trigger>
  <Settings closeFn={closeSettingsDialog} />
</Dialog.Root>
