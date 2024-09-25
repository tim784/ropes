import { makeAppIdentifier } from '../constants';
import { storageBacked } from './storageBacked';
import { CombinedFilter, type Filter } from '$lib/filter';
import { derived } from 'svelte/store';
import { z } from 'zod';
import { nanoid } from 'nanoid';

const filtersSchema = z
  .array(
    z.object({
      id: z.string().catch(nanoid()),
      name: z.string().catch(''),
      blockTags: z.array(z.string()).catch([]),
      allowTags: z.array(z.string()).catch([]),
      onByDefault: z.boolean().catch(false)
    })
  )
  .catch([]);

// this will be used in if JSON.parse fails, but as long we get a value out from
// that, the schema's `catch` will kick in on other malformed-ness
function defaultFilters(): Filter[] {
  return [];
}

const filterStoreKey = makeAppIdentifier('filters');

export const filterStore = storageBacked<Filter[]>(
  filterStoreKey,
  defaultFilters,
  JSON.stringify,
  (s) => {
    const parsed = JSON.parse(s);
    return filtersSchema.parse(parsed);
  }
);

const onFilterIdsStoreKey = makeAppIdentifier('on-filter-ids');

// a filter store backed by sessionStorage. it sources from filterStore, but
// otherwise manages its own state
function createOnFilterIdsStore() {
  const store = storageBacked<Set<string>>(
    onFilterIdsStoreKey,
    () => new Set(),
    (set) => JSON.stringify(Array.from(set)),
    (s) => new Set(JSON.parse(s)),
    sessionStorage
  );
  const { subscribe, update, set } = store;

  filterStore.subscribe((filters) => {
    const filtersById = new Map(filters.map((f) => [f.id, f]));
    update((onFilters) => {
      const newOnFilters = new Set<string>();
      for (const filter of filters) {
        // if the filter was on or is on by default, and it's in the onFilters.
        // also, remove filters that no longer exist
        if (filtersById.has(filter.id) && (onFilters.has(filter.id) || filter.onByDefault)) {
          newOnFilters.add(filter.id);
        }
      }
      return newOnFilters;
    });
  });

  return {
    subscribe,
    set,
    update,
    add: (id: string) => {
      update((onFilters) => {
        onFilters.add(id);
        return new Set(onFilters);
      });
    },
    remove: (id: string) => {
      update((onFilters) => {
        onFilters.delete(id);
        return new Set(onFilters);
      });
    }
  };
}

export const onFilterStore = createOnFilterIdsStore();

export const combinedFilter = derived([filterStore, onFilterStore], ([$filters, $onFilters]) =>
  CombinedFilter.fromFilters($filters.filter((f) => $onFilters.has(f.id)))
);
