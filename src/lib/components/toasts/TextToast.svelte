<script lang="ts">
  import BellRing from 'lucide-svelte/icons/bell-ring';
  import BaseToast from './BaseToast.svelte';

  export let dismissFn: () => void;
  export let text: string;
</script>

<BaseToast {dismissFn}>
  <div class="grid grid-cols-[auto_1fr] place-items-center gap-2">
    <div>
      <BellRing />
    </div>
    <div class="space-y-4 text-sm">
      <p>{text}</p>
    </div>
  </div>
</BaseToast>
