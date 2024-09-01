import type { Torrent } from '$lib/torrent';

export type FilterTags = string[] | null;

export type Filter = {
  name: string;
  blockTags: FilterTags;
  allowTags: FilterTags;
  id: string;
  enabled: boolean;
};

// if block is null, block nothing. if block is empty, block nothing. else, block only what is in block
// if allow is null, allow everything. if allow is empty, allow everything. else, allow only what is in allow

export class FilterGroup {
  constructor(
    public allowTags: Set<string> | null,
    public blockTags: Set<string> | null
  ) {}

  static fromFilters(filters: Filter[]): FilterGroup {
    let allowTags: Set<string> | null = null;
    let blockTags: Set<string> | null = null;

    for (const filter of filters) {
      if (!filter.enabled) {
        continue;
      }

      if (filter.allowTags !== null) {
        if (allowTags === null) {
          allowTags = new Set(filter.allowTags);
        } else {
          for (const tag of filter.allowTags) {
            allowTags.add(tag);
          }
        }
      }

      if (filter.blockTags !== null) {
        if (blockTags === null) {
          blockTags = new Set(filter.blockTags);
        } else {
          for (const tag of filter.blockTags) {
            blockTags.add(tag);
          }
        }
      }
    }

    return new FilterGroup(allowTags, blockTags);
  }

  filter(torrent: Torrent): boolean {
    if (torrent.tags === null) {
      return true;
    }

    const tags = new Set(torrent.tags);

    if (this.blockTags !== null && tags.intersection(this.blockTags).size > 0) {
      return false;
    }

    if (this.allowTags === null) {
      return true;
    }

    return tags.intersection(this.allowTags).size > 0;
  }
}
