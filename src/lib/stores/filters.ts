import { makeAppIdentifier } from '../constants';
import { localStorageBacked } from './localStorageBacked';
import { type Filter, FilterGroup } from '$lib/filter';
import { derived } from 'svelte/store';

export type FilterStore = Filter[];

function defaultFilterStore(): FilterStore {
  return [];
}

const key = makeAppIdentifier('filters');

export const filters = localStorageBacked<FilterStore>(
  key,
  defaultFilterStore,
  JSON.stringify,
  JSON.parse
);

export const curFilterGroup = derived(filters, ($filters) => FilterGroup.fromFilters($filters));
