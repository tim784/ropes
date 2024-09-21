import { localStorageBacked } from './localStorageBacked';
import { makeAppIdentifier } from '$lib/constants';
import { z } from 'zod';

export type CachedTag = {
  name: string;
  useCount: number;
};

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim();
}

export type CachedTagResult = CachedTag & { exact?: boolean };

export class TagCache {
  static objectSchema = z.array(z.tuple([z.string(), z.number()]));

  constructor(private tags: Map<string, number>) {}

  static default(): TagCache {
    return new TagCache(new Map());
  }

  static deserialize(str: string): TagCache {
    const parsed = TagCache.objectSchema.parse(JSON.parse(str));
    return new TagCache(new Map(parsed));
  }

  merge(tags: CachedTag[]): void {
    for (const tag of tags) {
      this.tags.set(tag.name, tag.useCount);
    }
  }

  serialize(): string {
    return JSON.stringify(Array.from(this.tags));
  }

  search(partialTag: string): CachedTagResult[] {
    if (partialTag.length === 0) return [];

    const needle = normalizeTag(partialTag);

    const matches = [];
    let exactMatch: CachedTagResult | undefined = undefined;

    for (const [name, count] of this.tags.entries()) {
      if (name === needle) {
        exactMatch = { name, useCount: count, exact: true };
      } else if (name.includes(needle)) {
        matches.push({ name, useCount: count });
      }
    }

    // sort otherMatches by count, then by name
    matches.sort((a, b) => {
      if (a.useCount !== b.useCount) {
        return b.useCount - a.useCount;
      }
      return a.name.localeCompare(b.name);
    });

    // put exact match at the front
    if (exactMatch) {
      matches.unshift(exactMatch);
    }

    return matches;
  }

  has(tag: string): boolean {
    return this.tags.has(normalizeTag(tag));
  }
}

const key = makeAppIdentifier('tag-cache');

export function createTagCacheStore() {
  const store = localStorageBacked<TagCache>(
    key,
    TagCache.default,
    (tagCache) => tagCache.serialize(),
    TagCache.deserialize
  );

  const { subscribe, set, update } = store;

  function merge(tags: CachedTag[]) {
    update((tagCache) => {
      tagCache.merge(tags);
      return tagCache;
    });
  }

  function clear() {
    set(TagCache.default());
  }

  return { subscribe, merge, clear };
}

export type TagCacheStore = ReturnType<typeof createTagCacheStore>;
export const tagCache = createTagCacheStore();
