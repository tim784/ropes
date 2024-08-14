<script lang="ts">
  import { onMount } from 'svelte';
  import { currentModal, type ModalComponentData } from '$stores/modal';
  import ToastContainer from './ToastContainer.svelte';
  import { modalToasts } from '$stores/toasts';

  let modalComponentData: ModalComponentData | null = null;
  let dialogElement: HTMLDialogElement;

  const closeFn = () => currentModal.clear();

  onMount(() => {
    const unsubscribeModal = currentModal.subscribe((value) => {
      if (value === null) {
        dialogElement.close();
      } else {
        dialogElement.showModal();
      }
      modalComponentData = value;
    });
    dialogElement.addEventListener('close', closeFn);

    return () => {
      unsubscribeModal();
      dialogElement.removeEventListener('close', closeFn);
    };
  });

  function handleClickOutside(event: MouseEvent) {
    if (event.target === dialogElement) {
      closeFn();
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialogElement}
  on:click={handleClickOutside}
  class="isolate bg-transparent backdrop:bg-black/75"
  tabindex="-1"
>
  <!-- ok, the below comment works for autofocus, which i've been struggling
  with. maybe we need to make the child components be dialogs. dynamic
  components with autofocus doesn't work. maybe this should just be a generic
  div container. -->
  <!-- <button autofocus class="text-white focus:text-red-500">hi</button> -->
  <svelte:component
    this={modalComponentData?.componentType}
    {closeFn}
    {...modalComponentData?.props}
  />

  <ToastContainer toastsStore={modalToasts} />
</dialog>
