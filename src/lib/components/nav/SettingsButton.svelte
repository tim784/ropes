<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import Settings from '../modals/Settings.svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { portal } from '$stores/portal';

  let settingsDialogOpen: boolean = false;

  const closeSettingsDialog = () => {
    settingsDialogOpen = false;
  };
</script>

<Dialog.Root portal={$portal} bind:open={settingsDialogOpen}>
  <Dialog.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost">Settings</Button>
  </Dialog.Trigger>
  <Settings closeFn={closeSettingsDialog} />
</Dialog.Root>
