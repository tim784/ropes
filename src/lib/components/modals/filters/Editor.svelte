<script lang="ts">
  import { Filter } from '$lib/filter';
  import { Textarea } from '$components/ui/textarea';
  import { Label } from '$components/ui/label';
  import { Input } from '$components/ui/input';
  import { filters } from '$src/lib/stores/filters';
  import { makeAppIdentifier } from '$lib/constants';
  import ConfirmButton from '$components/ui/ConfirmButton.svelte';
  import { onMount } from 'svelte';

  export let filter: Filter;
  export let scrollingContainer: HTMLElement | null;

  const nameInputId = makeAppIdentifier('filter-name-input');
  const denyTagsInputId = makeAppIdentifier('filter-deny-tags-input');
  const allowTagsInputId = makeAppIdentifier('filter-allow-tags-input');

  let localName = filter.name;
  let localDenyTagsValue = filter.denyTags.join(' ');
  let localAllowTagsValue = filter.allowTags.join(' ');

  $: localDenyTags = localDenyTagsValue.split(' ');
  $: localAllowTags = localAllowTagsValue.split(' ');

  function arraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function updateFilter(name: string, denyTags: string[], allowTags: string[]) {
    if (
      name === filter.name &&
      arraysEqual(denyTags, filter.denyTags) &&
      arraysEqual(allowTags, filter.allowTags)
    )
      return;
    filters.update((filterStore) => {
      const found = filterStore.root.findId(filter.id);
      if (!found) return filterStore;
      found.name = name;
      found.denyTags = denyTags;
      found.allowTags = allowTags;
      return filterStore;
    });
  }

  $: updateFilter(localName, localDenyTags, localAllowTags);

  function deleteFilter() {
    filters.update((filterStore) => {
      const found = filterStore.root.findId(filter.id);
      if (!found) return filterStore;
      const parent = found.parent;
      if (!parent) return filterStore;
      parent.children = parent.children.filter((child) => child.id !== found.id);
      return filterStore;
    });
  }

  onMount(() => {
    if (scrollingContainer) scrollingContainer.scrollTop = 0;
  });
</script>

<div class="prose px-8 py-4 dark:prose-invert">
  <Label for={nameInputId}><h3 class="mt-0">Name</h3></Label>
  <Input id={nameInputId} bind:value={localName} type="text" minlength={5} />

  <Label for={denyTagsInputId}><h3>Blocklist</h3></Label>
  <p>Don't show torrents with these tags...</p>
  <Textarea
    id={denyTagsInputId}
    class="font-mono"
    placeholder="bad.one bad.two bad.three"
    bind:value={localDenyTagsValue}
  />
  <p class="mt-1 text-sm text-muted-foreground">Separate tags with spaces</p>

  <Label for={allowTagsInputId}><h3>Allowlist</h3></Label>
  <p>Unless the torrent has these tags...</p>
  <Textarea
    id={allowTagsInputId}
    class="font-mono"
    placeholder="good.one good.two good.three"
    bind:value={localAllowTagsValue}
  />
  <p class="mt-1 text-sm text-muted-foreground">Separate tags with spaces</p>

  <h3>Actions</h3>
  <ul>
    <li>
      <ConfirmButton on:confirm={deleteFilter} disabled={filter.children.length > 0}>
        <svelte:fragment slot="quiescent">Delete Filter</svelte:fragment>
      </ConfirmButton>
      {#if filter.children.length > 0}
        <p class="text-sm">Cannot delete this filter because it has children</p>
      {/if}</li>
  </ul>
</div>
