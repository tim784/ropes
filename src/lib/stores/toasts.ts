import { writable } from 'svelte/store';
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import { settings } from '$stores/settings';

export type ToastComponentData = {
  componentType: ComponentType;
  props?: Record<string, unknown>;
};

const getNewId = () => new Date().getTime();

function makeToastsStore() {
  const { subscribe, update } = writable<Map<number, ToastComponentData>>(new Map());

  settings.subscribe((settings) => {
    if (settings.sfwMode) {
      update((toasts) => {
        toasts.clear();
        return toasts;
      });
    }
  });

  return {
    subscribe,

    add<T extends SvelteComponent<{ dismissFn: () => void }>>(
      componentType: ComponentType<T>,
      props?: Omit<ComponentProps<T>, 'dismissFn'>
    ) {
      const id = getNewId();

      const dismissFn = () => {
        update((toasts) => {
          toasts.delete(id);
          return toasts;
        });
      };

      update((toasts) => {
        const allProps = { dismissFn, ...(props ?? {}) };
        toasts.set(id, { componentType, props: allProps });
        return toasts;
      });
    }
  };
}

export type ToastsStore = ReturnType<typeof makeToastsStore>;

export const toasts = makeToastsStore();
