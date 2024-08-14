<script lang="ts">
  import CircleAlert from 'lucide-svelte/icons/circle-alert';
  import BaseToast from './BaseToast.svelte';
  import Kbd from '../ui/Kbd.svelte';

  export let dismissFn: () => void;
  export let description: string;
  export let error: Error;
</script>

<BaseToast {dismissFn} variant="error">
  <div class="grid grid-cols-[auto_1fr] place-items-center gap-2">
    <div>
      <CircleAlert />
    </div>
    <div class="space-y-4 text-sm">
      <p>
        Error while {description}: <span class="font-mono">{error.message}</span>.
      </p>
      <p>
        More details logged to console, which can be openend with <Kbd keys={['F12']} />.
      </p>
      <p>Try reloading to fix the issue.</p>
    </div>
  </div>
</BaseToast>
