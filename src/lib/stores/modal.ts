import { writable } from 'svelte/store';
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';

export type ModalComponentData = {
  componentType: ComponentType;
  props?: Record<string, any>;
};

function makeModalStore() {
  const { subscribe, set: setStore } = writable<ModalComponentData | null>(null);

  return {
    subscribe,
    set<T extends SvelteComponent<{ closeFn: () => void }>>(
      componentType: ComponentType<T>,
      props?: Omit<ComponentProps<T>, 'closeFn'>
    ) {
      setStore({ componentType, props });
    },
    clear: () => setStore(null)
  };
}

export const currentModal = makeModalStore();
