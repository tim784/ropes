<script lang="ts">
  import { type Filter } from '$lib/filter';
  import { Textarea } from '$components/ui/textarea';
  import { Label } from '$components/ui/label';
  import { Input } from '$components/ui/input';
  import { filterStore } from '$src/lib/stores/filters';
  import { makeAppIdentifier } from '$lib/constants';
  import ConfirmButton from '$components/ui/ConfirmButton.svelte';
  import { onMount } from 'svelte';
  import pDebounce from 'p-debounce';

  export let filter: Filter;
  export let scrollingContainer: HTMLElement | null;

  const nameInputId = makeAppIdentifier('filter-name-input');
  const blockTagsInputId = makeAppIdentifier('filter-block-tags-input');
  const allowTagsInputId = makeAppIdentifier('filter-allow-tags-input');

  let localName = filter.name;
  let localBlockTagsValue = filter.blockTags.join(' ');
  let localAllowTagsValue = filter.allowTags.join(' ');

  $: localBlockTags = localBlockTagsValue.split(/\s+/).filter((tag) => tag !== '');
  $: localAllowTags = localAllowTagsValue.split(/\s+/).filter((tag) => tag !== '');

  function updateFilter(name: string, blockTags: string[], allowTags: string[]) {
    filterStore.update((filterStore) => {
      filter.name = name;
      filter.blockTags = blockTags;
      filter.allowTags = allowTags;
      return filterStore;
    });
  }

  const debounceDuration = 1000;
  const updateFilterDebounced = pDebounce(updateFilter, debounceDuration);

  $: updateFilterDebounced(localName, localBlockTags, localAllowTags);

  function deleteFilter() {
    filterStore.update((filterStore) => {
      return filterStore.filter((f) => f.id !== filter.id);
    });
  }

  onMount(() => {
    if (scrollingContainer) scrollingContainer.scrollTop = 0;
  });
</script>

<div class="prose px-8 py-4 dark:prose-invert">
  <Label for={nameInputId}><h3 class="mt-0">Name</h3></Label>
  <Input id={nameInputId} bind:value={localName} type="text" minlength={5} />

  <Label for={blockTagsInputId}><h3>Exclude List (Optional)</h3></Label>
  <Textarea
    id={blockTagsInputId}
    class="font-mono"
    placeholder="bad.one bad.two bad.three"
    bind:value={localBlockTagsValue}
  />
  <p class="mt-1 text-sm text-muted-foreground">
    If a torrent has a tag in this list, it will be excluded. Separate tags with spaces. If blank,
    no torrents will be excluded.
  </p>

  <Label for={allowTagsInputId}><h3>Include List (Optional)</h3></Label>
  <Textarea
    id={allowTagsInputId}
    class="font-mono"
    placeholder="good.one good.two good.three"
    bind:value={localAllowTagsValue}
  />
  <p class="mt-1 text-sm text-muted-foreground">
    If a torrent has a tag in this list, it will be included. Exclusion happens before inclusion.
    Separate tags with spaces. If blank, all torrents will be included.
  </p>

  <h3>Actions</h3>
  <ul>
    <li>
      <ConfirmButton on:confirm={deleteFilter}>
        <svelte:fragment slot="quiescent">Delete Filter</svelte:fragment>
      </ConfirmButton>
    </li>
  </ul>
</div>
