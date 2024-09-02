import type { Torrent } from '$lib/torrent';

export type FilterTags = string[];

export type Filter = {
  name: string;
  blockTags: FilterTags;
  allowTags: FilterTags;
  id: string;
  enabled: boolean;
};

// if block is empty, block nothing. else, block only what is in block
// if allow is empty, allow everything. else, allow only what is in allow

export class FilterGroup {
  constructor(
    public allowTags: Set<string>,
    public blockTags: Set<string>
  ) {}

  static fromFilters(filters: Filter[]): FilterGroup {
    let allowTags: Set<string> = new Set();
    let blockTags: Set<string> = new Set();

    for (const filter of filters) {
      if (!filter.enabled) {
        continue;
      }
      for (const tag of filter.allowTags) {
        allowTags.add(tag);
      }
      for (const tag of filter.blockTags) {
        blockTags.add(tag);
      }
    }

    return new FilterGroup(allowTags, blockTags);
  }

  filter(torrent: Torrent): boolean {
    if (torrent.tags === null) {
      return true;
    }

    const tags = new Set(torrent.tags);

    if (this.blockTags.size > 0 && tags.intersection(this.blockTags).size > 0) {
      return false;
    }

    return this.allowTags.size === 0 || tags.intersection(this.allowTags).size > 0;
  }
}
