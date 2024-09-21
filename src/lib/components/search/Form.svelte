<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import TagsSection from './TagsSection.svelte';
  // import SortBase from './SortBase.svelte';
  import Sort from './Sort.svelte';
  import Size from './Size.svelte';
  import { settings } from '$stores/settings';
  import MakeDefault from './MakeDefault.svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
  import Search from 'lucide-svelte/icons/search';
  import UserSearch from 'lucide-svelte/icons/user-search';
  import Eraser from 'lucide-svelte/icons/eraser';
  import { type PageDataStore, type SearchDataStore } from '$stores/page';
  import { getContext, setContext } from 'svelte';
  import {
    SORT_KEY_NAME,
    SORT_ORDER_NAME,
    TAGLIST_NAME,
    SIZE_MID_NAME,
    SIZE_RANGE_NAME,
    SIZE_UNIT_NAME,
    SET_DEFAULT_NAME
  } from '$gather/searchForm';
  import type { QueryParamStore } from '$stores/page';

  const queryParamsStore = getContext<QueryParamStore>('queryParamsStore');
  const pageDataStore = getContext<PageDataStore>('pageDataStore');
  const searchDataStore = getContext<SearchDataStore>('searchDataStore');
  const searchUrlPath = '/torrents.php';

  type Form = {
    [TAGLIST_NAME]: string;
    [SORT_KEY_NAME]: string;
    [SORT_ORDER_NAME]: string;
    [SIZE_MID_NAME]: string;
    [SIZE_RANGE_NAME]: string;
    [SIZE_UNIT_NAME]: string;
    [SET_DEFAULT_NAME]: string;
  };

  const form: Form = {
    [TAGLIST_NAME]:
      $queryParamsStore.get(TAGLIST_NAME) ?? $searchDataStore.searchForm.taglistValue ?? '',
    [SORT_KEY_NAME]: $queryParamsStore.get(SORT_KEY_NAME) ?? 'time',
    [SORT_ORDER_NAME]: $queryParamsStore.get(SORT_ORDER_NAME) ?? 'desc',
    [SIZE_MID_NAME]: $queryParamsStore.get(SIZE_MID_NAME) ?? '',
    [SIZE_RANGE_NAME]: $queryParamsStore.get(SIZE_RANGE_NAME) ?? '',
    [SIZE_UNIT_NAME]: $queryParamsStore.get(SIZE_UNIT_NAME) ?? 'gb',
    [SET_DEFAULT_NAME]: ''
  };
  function clearTags() {
    form[TAGLIST_NAME] = '';
  }

  function clearAll() {
    form[TAGLIST_NAME] = '';
    form[SORT_KEY_NAME] = 'time';
    form[SORT_ORDER_NAME] = 'desc';
    form[SIZE_MID_NAME] = '';
    form[SIZE_RANGE_NAME] = '';
    form[SIZE_UNIT_NAME] = 'gb';
    form[SET_DEFAULT_NAME] = '';
  }

  function getFormUrl(form: Form): string {
    const url = new URL(searchUrlPath, window.location.origin);
    for (const [key, value] of Object.entries(form)) {
      url.searchParams.set(key, value as string);
    }
    return url.toString();
  }

  function submit() {
    const url = getFormUrl(form);
    if ($settings.spaMode) {
      pageDataStore.navigate(url);

      // reset this on submit. this is a destructive action that's inconcievable
      // to want to persist
      form[SET_DEFAULT_NAME] = '';
    } else {
      window.location.href = url;
    }
  }
  setContext('submitFunction', submit);
</script>

<form class="w-full space-y-4 p-1 transition-colors">
  <TagsSection bind:value={form[TAGLIST_NAME]} />

  <Sort bind:keyValue={form[SORT_KEY_NAME]} bind:orderValue={form[SORT_ORDER_NAME]} />

  <Size
    bind:midValue={form[SIZE_MID_NAME]}
    bind:rangeValue={form[SIZE_RANGE_NAME]}
    bind:unitValue={form[SIZE_UNIT_NAME]}
  />

  <MakeDefault bind:value={form[SET_DEFAULT_NAME]} />

  <div class="grid grid-cols-[1fr_min-content]">
    <Button
      type={$settings.spaMode ? 'button' : 'submit'}
      on:click={() => {
        if ($settings.spaMode) {
          submit();
        }
      }}
      class="rounded-e-none rounded-s-lg border-e-2 text-xl font-bold"
      size="lg"><Search class="me-2" />Search</Button
    >

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
                pageDataStore.navigate(searchUrlPath);
              }}><UserSearch class="me-2" />Go to Default Search</DropdownMenu.Item
            >
          {:else}
            <DropdownMenu.Item href={searchUrlPath}
              ><UserSearch class="me-2" />Go to Default Search</DropdownMenu.Item
            >
          {/if}
          <DropdownMenu.Item on:click={clearTags}
            ><Eraser class="me-2" />Clear Tags</DropdownMenu.Item
          >
          <DropdownMenu.Item on:click={clearAll}
            ><Eraser class="me-2 fill-foreground/50" />Reset All</DropdownMenu.Item
          >
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</form>

{#if import.meta.env.DEV}
  <p class="break-all font-mono">{getFormUrl(form)}</p>
{/if}
