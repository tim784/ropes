import { makeAppIdentifier } from '../constants';
import { localStorageBacked } from './localStorageBacked';
import { Filter, type SerializedFilter } from '$lib/filter';
import { derived } from 'svelte/store';

type SerializedFilterStore = {
  root: SerializedFilter;
  currentId: string;
};

function defaultSerializedFilterStore(): SerializedFilterStore {
  const root = Filter.newRootFilter();
  return {
    root,
    currentId: root.id
  };
}

const key = makeAppIdentifier('filters');

function makeSerializedFiltersStore() {
  const filters = localStorageBacked<SerializedFilterStore>(
    key,
    defaultSerializedFilterStore,
    JSON.stringify,
    JSON.parse
  );

  return filters;
}

export type FilterStore = {
  root: Filter;
  current: Filter;
};

function makeFilterStore() {
  const serializedFilters = makeSerializedFiltersStore();
  const { set, update } = serializedFilters;

  const filters = derived(serializedFilters, ($serializedFilters) => {
    const root = Filter.fromSerialized($serializedFilters.root);
    const current = root.findId($serializedFilters.currentId) ?? root;

    return {
      root,
      current,
    } as FilterStore;
  });

  return {
    subscribe: filters.subscribe,
    set: (filterStore: FilterStore) => {
      set({
        root: filterStore.root.toSerialized(),
        currentId: filterStore.current.id
      } as SerializedFilterStore);
    },
    update: (fn: (filterStore: FilterStore) => FilterStore) => {
      update((serialized) => {
        const updated = fn({
          root: Filter.fromSerialized(serialized.root),
          current:
            Filter.fromSerialized(serialized.root).findId(serialized.currentId) ??
            Filter.fromSerialized(serialized.root)
        } as FilterStore);

        return {
          root: updated.root.toSerialized(),
          currentId: updated.current.id
        } as SerializedFilterStore;
      });
    },
    updateCurrentById: (id: string) => {
      update((serialized) => {
        return {
          root: serialized.root,
          currentId: id
        };
      });
    }
  };
}

export const filters = makeFilterStore();
