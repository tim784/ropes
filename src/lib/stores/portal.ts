import { writable } from 'svelte/store';

export const portal = writable<HTMLDivElement | null>(null);
