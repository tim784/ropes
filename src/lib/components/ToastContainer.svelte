<script lang="ts">
  import { toasts, type ToastsStore } from '$stores/toasts';

  export let toastsStore: ToastsStore = toasts;
</script>

<div
  class="fixed bottom-8 left-1/2 z-[60] flex max-w-[clamp(250px,_50dvw,_500px)] -translate-x-1/2 flex-col items-center gap-2"
>
  {#each $toastsStore as [id, toastData] (id)}
      <svelte:component this={toastData.componentType} {...toastData.props} />
  {/each}
</div>
