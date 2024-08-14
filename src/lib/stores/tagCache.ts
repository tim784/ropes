import type { Writable } from 'svelte/store';
import { localStorageBacked } from './localStorageBacked';
import { makeAppIdentifier } from '$lib/constants';
import { type CacheTag } from '$lib/tag';
import { normalizeTag } from '$lib/tag';

export type TagMap = Map<string, number>;
function newTagMap(): TagMap {
  return new Map<string, number>();
}

export type TagCache = {
  // low-level map from tag name to number of torrents in which tag appears
  tags: TagMap;

  // returns a list of tags that match the partial tag name
  match(partialTagName: string): CacheTag[];

  // check if a tag is in the cache
  has(tag: string): boolean;
};

function makeTagCache(map?: TagMap): TagCache {
  const map_ = map ?? newTagMap();
  return {
    tags: map_,
    match: createMatchFn(map_),
    has: createHasFn(map_)
  };
}

function createMatchFn(tags: Map<string, number>): TagCache['match'] {
  return (partialTagName: string) => {
    if (partialTagName.length === 0) return [];
    let needle = normalizeTag(partialTagName);

    // find all matches
    const matchingTags = Array.from(tags.entries())
      .map(([name, count]) => ({ name, count }) as CacheTag)
      .filter((t) => t.name.includes(needle));

    // find exact match and pop it to local variable
    const exactIdx = matchingTags.findIndex((t) => t.name === needle);
    let exact: CacheTag | null = null;
    if (exactIdx !== -1) {
      exact = matchingTags[exactIdx];

      matchingTags.splice(exactIdx, 1);
    }

    // sort by count, then by name
    matchingTags.sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });

    // put exact match at the top
    if (exact) {
      exact.exact = true;
      matchingTags.unshift(exact);
    }

    return matchingTags as CacheTag[];
  };
}

function createHasFn(tags: Map<string, number>): TagCache['has'] {
  return (tag: string) => {
    return tags.has(normalizeTag(tag));
  };
}

const key = makeAppIdentifier('tag-cache');
const tagCacheBase = localStorageBacked<TagCache>(
  key,
  makeTagCache,
  (tagCache) => {
    return JSON.stringify(Array.from(tagCache.tags));
  },
  (str) => {
    return makeTagCache(new Map(JSON.parse(str)));
  }
);

export type TagCacheStore = Writable<TagCache> & { merge(tags: CacheTag[]): void; clear(): void };
export const tagCache: TagCacheStore = {
  ...tagCacheBase,
  merge(tags) {
    tagCacheBase.update((tagCache) => {
      for (const tag of tags) {
        tagCache.tags.set(tag.name, tag.count);
      }
      return tagCache;
    });
  },
  clear() {
    tagCacheBase.set(makeTagCache());
  }
};
