import { makeAppIdentifier } from '../constants';
import { localStorageBacked } from './localStorageBacked';
import { type Filter, CombinedFilter } from '$lib/filter';
import { derived } from 'svelte/store';

function defaultFilters(): Filter[] {
  return [];
}

const key = makeAppIdentifier('filters');

export const filterStore = localStorageBacked<Filter[]>(
  key,
  defaultFilters,
  JSON.stringify,
  JSON.parse
);

export const combinedFilter = derived(filterStore, ($filters) => CombinedFilter.fromFilters($filters));
