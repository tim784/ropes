<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { createLocalFormDataStore, urlFromFormData } from '$stores/localFormData';
  import TagsSection from './TagsSection.svelte';
  import SortCriteria from './SortCriteria.svelte';
  import SortOrder from './SortOrder.svelte';
  // import Size from './Size.svelte';
  import { settings } from '$stores/settings';
  import MakeDefault from './MakeDefault.svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
  import Search from 'lucide-svelte/icons/search';
  import UserSearch from 'lucide-svelte/icons/user-search';
  import Eraser from 'lucide-svelte/icons/eraser';
  import { type PageDataStore, type SearchDataStore } from '$stores/page';
  import { getContext, setContext } from 'svelte';
  import { TAGLIST_NAME } from '$gather/searchForm';
  import { get } from 'svelte/store';

  const pageDataStore = getContext<PageDataStore>('pageDataStore');

  const searchDataStore = getContext<SearchDataStore>('searchDataStore');

  const localFormDataStore = createLocalFormDataStore(
    $pageDataStore.url,
    get(searchDataStore).searchForm.taglistValue
  );
  setContext('localFormDataStore', localFormDataStore);

  const defaultSearchUrl = '/torrents.php';

  $: urlForForm = urlFromFormData($localFormDataStore);

  function clearTags() {
    localFormDataStore.update((formData) => {
      formData.delete(TAGLIST_NAME);
      return formData;
    });
  }

  function clearAll() {
    const clearedFormData = new FormData();

    // if taglist isn't present, emp returns the user's default search, which
    // not what we want. here we say want want a truly empty search by setting
    // it to an empty string
    clearedFormData.set(TAGLIST_NAME, '');

    localFormDataStore.set(clearedFormData);
  }
</script>

<form class="w-full space-y-4 p-1 transition-colors">
  <TagsSection />

  <SortCriteria />

  <SortOrder />

  <!-- <Size /> -->

  <MakeDefault />

  <div class="grid grid-cols-[1fr_min-content]">
    {#if $settings.spaMode}
      <Button
        type="button"
        on:click={() => pageDataStore.navigate(urlForForm)}
        class="rounded-e-none rounded-s-lg border-e-2 text-xl font-bold"
        size="lg"><Search class="me-2" />Search</Button
      >
    {:else}
      <Button
        href={urlForForm}
        class="rounded-e-none rounded-s-lg border-e-2 text-xl font-bold"
        size="lg"><Search class="me-2" />Search</Button
      >
    {/if}
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} type="button" size="lg" class="rounded-none rounded-e-lg px-2">
          <EllipsisVertical class="size-6" /><span class="sr-only">Other Search Actions</span
          ></Button
        >
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Separator />

          {#if $settings.spaMode}
            <DropdownMenu.Item
              on:click={() => {
                pageDataStore.navigate(defaultSearchUrl);
              }}><UserSearch class="me-2" />Go to Default Search</DropdownMenu.Item
            >
          {:else}
            <DropdownMenu.Item href={defaultSearchUrl}
              ><UserSearch class="me-2" />Go to Default Search</DropdownMenu.Item
            >
          {/if}
          <DropdownMenu.Item on:click={clearTags}
            ><Eraser class="me-2" />Clear Tags</DropdownMenu.Item
          >
          <DropdownMenu.Item on:click={clearAll}
            ><Eraser class="me-2 fill-foreground/50" />Clear All</DropdownMenu.Item
          >
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</form>

{#if import.meta.env.DEV}
  <p class="break-all font-mono">{urlForForm}</p>
{/if}
