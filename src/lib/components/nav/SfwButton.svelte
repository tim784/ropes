<script lang="ts">
  import { settings } from '$stores/settings';
  import Button from "$components/ui/Button.svelte";
  import Kbd from '$components/ui/Kbd.svelte';
  $: buttonName = $settings.sfwMode ? 'Join Now' : 'SFW Mode';

  function toggleSFWMode() {
    settings.update((old) => {
      old.sfwMode = !old.sfwMode;
      return old;
    });
  }

  function handleSFWModeKeybindToggle(e: KeyboardEvent) {
    if (!(e.altKey && e.key === 'z')) return;
    toggleSFWMode();
    e.preventDefault();
  }
</script>

<svelte:window on:keydown={handleSFWModeKeybindToggle} />

<Button variant="destructive" class="font-bold" on:click={toggleSFWMode}>
  {buttonName} (<Kbd keys={["AltOrOption", "Z"]} />)
</Button>
