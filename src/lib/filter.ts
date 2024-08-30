import type { Torrent } from '$lib/torrent';

export const ROOT_FILTER_NAME = 'All';

export type SerializedFilter = {
  name: string;
  denyTags: string[];
  allowTags: string[];
  children: SerializedFilter[];
  id: string;
};

export class Filter {
  constructor(
    public name: string,
    public denyTags: string[] = [],
    public allowTags: string[] = [],
    public children: Filter[] = [],
    public parent: Filter | null = null,

    /** Something unchangeable */
    readonly id: string = self.crypto.randomUUID()
  ) {}

  static newRootFilter(): Filter {
    return new Filter(ROOT_FILTER_NAME);
  }

  static fromSerialized(serialized: SerializedFilter, parent: Filter | null = null): Filter {
    const f = new Filter(
      serialized.name,
      serialized.denyTags,
      serialized.allowTags,
      [],
      parent,
      serialized.id
    );

    f.children = serialized.children.map((child) => Filter.fromSerialized(child, f));

    return f;
  }

  toSerialized(): SerializedFilter {
    return {
      name: this.name,
      denyTags: this.denyTags,
      allowTags: this.allowTags,
      children: this.children.map((child) => child.toSerialized()),
      id: this.id
    };
  }

  /**
   * Depth-first search iterator over the filter tree.
   */
  *iter(): Generator<Filter, void, unknown> {
    yield this; // Yield the current filter first

    for (const child of this.children) {
      yield* child.iter(); // Recursively yield children in DFS order
    }
  }

  /**
   * Find a filter by name.
   *
   * @param name The name of the filter to find
   *
   * @returns The filter with the given name, or null if no such filter exists
   */
  findName(name: string): Filter | null {
    for (const filter of this.iter()) {
      if (filter.name === name) {
        return filter;
      }
    }

    return null;
  }

  findId(id: string): Filter | null {
    for (const filter of this.iter()) {
      if (filter.id === id) {
        return filter;
      }
    }

    return null;
  }

  getIdMap(): Map<string, Filter> {
    return new Map([...this.iter()].map((filter) => [filter.id, filter]));
  }

  getNameMap(): Map<string, Filter> {
    return new Map([...this.iter()].map((filter) => [filter.name, filter]));
  }

  private allTagsInLineage(type: 'deny' | 'allow'): string[] {
    let cur: Filter | null = this;
    const tags = new Set<string>();

    while (cur !== null) {
      const curTags = type === 'deny' ? cur.denyTags : cur.allowTags;
      curTags.forEach((tag) => tags.add(tag));
      cur = cur.parent;
    }

    return [...tags];
  }

  allDenyTagsInLineage(): string[] {
    return this.allTagsInLineage('deny');
  }

  allAllowTagsInLineage(): string[] {
    return this.allTagsInLineage('allow');
  }

  /**
   * Returns true if the torrent passes the filter, false otherwise.
   *
   * If the torrent has no tags, return true.
   *
   * Otherwise, check if any of torrent's tags are in denyTags. If none are,
   * return true. If some are, return if any of the tags are in allowTags.
   *
   * @param torrent The torrent to check
   *
   * @returns true if the torrent passes the filter, false otherwise
   */
  call(torrent: Torrent) {
    if (torrent.tags === null) {
      return true;
    }

    const tags = new Set(torrent.tags);

    const denyTags = this.allDenyTagsInLineage();
    const denied = denyTags.some((tag) => tags.has(tag));

    if (!denied) {
      return true;
    }

    const allowTags = this.allAllowTagsInLineage();
    const allowed = allowTags.some((tag) => tags.has(tag));

    return allowed;
  }
}
