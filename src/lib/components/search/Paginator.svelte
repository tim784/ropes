<script lang="ts">
  import { type PageDataStore, type SearchDataStore } from '$stores/page';
  import type { Pagination } from '$gather/pagination';
  import Button from '$components/ui/Button.svelte';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import { settings } from '$stores/settings';
  import Skeleton from '$components/ui/skeleton/skeleton.svelte';
  import { getContext } from 'svelte';

  const pageDataStore = getContext<PageDataStore>('pageDataStore');
  const searchDataStore = getContext<SearchDataStore>('searchDataStore');

  $: curUrl = new URL($pageDataStore.url);
  $: pagination = $searchDataStore.pagination;

  type PageItem = {
    number: number;
    isActive: boolean;
  };

  type Elision = null;

  function makePageRadius(pagination: Pagination, radius = 2): (PageItem | null)[] {
    const pages: (PageItem | Elision)[] = [];

    for (let i = pagination.currentPage - radius; i <= pagination.currentPage + radius; i++) {
      if (i < 1 || i > pagination.totalPages) {
        continue;
      }

      pages.push({
        number: i,
        isActive: i === pagination.currentPage
      });
    }

    // also push first and last iff they aren't already in the radius. if the first and last
    // are not sequential, push an ellision
    if (pages[0]?.number !== 1) {
      pages.unshift({
        number: 1,
        isActive: false
      });

      if (pages[1]?.number !== 2) {
        // insert after the first
        pages.splice(1, 0, null);
      }
    }

    if (pages[pages.length - 1]?.number !== pagination.totalPages) {
      pages.push({
        number: pagination.totalPages,
        isActive: false
      });

      if (pages[pages.length - 2]?.number !== pagination.totalPages - 1) {
        // insert before the last
        pages.splice(pages.length - 1, 0, null);
      }
    }

    return pages;
  }

  function urlForPage(pageNumber: number): string {
    const newUrl = new URL(curUrl);
    newUrl.searchParams.set('page', pageNumber.toString());
    return newUrl.toString();
  }
</script>

<ul class="my-4 flex items-center justify-center gap-4">
  {#if $pageDataStore.isLoading}
    {#each Array.from({ length: 5 }) as _}
      <li>
        <Skeleton class="h-8 w-8" />
      </li>
    {/each}
  {:else}
    {@const pageRadius = makePageRadius(pagination)}
    <li>
      {#if pagination.currentPage !== 1}
        {#if $settings.spaMode}
          <Button
            size="sm"
            variant="outline"
            class="px-2"
            on:click={() => {
              pageDataStore.navigate(urlForPage(pagination.currentPage - 1));
            }}
          >
            <ChevronLeft />
          </Button>
        {:else}
          <Button
            size="sm"
            href={urlForPage(pagination.currentPage - 1)}
            variant="outline"
            class="px-2"
          >
            <ChevronLeft />
          </Button>
        {/if}
      {:else}
        <Button size="sm" class="px-2" variant="outline" disabled>
          <ChevronLeft />
        </Button>
      {/if}
    </li>
    {#each pageRadius as pageItem}
      {#if pageItem === null}
        <li>...</li>
      {:else}
        {@const url = urlForPage(pageItem.number)}
        <li>
          {#if !pageItem.isActive}
            {#if $settings.spaMode}
              <Button
                size="sm"
                variant="outline"
                class="font-bold"
                on:click={() => {
                  pageDataStore.navigate(url);
                }}
              >
                {pageItem.number}
              </Button>
            {:else}
              <Button size="sm" class="font-bold" href={url} variant="outline">
                {pageItem.number}
              </Button>
            {/if}
          {:else}
            <Button
              size="sm"
              class="cursor-default border-2 border-primary font-bold hover:bg-background active:border-primary active:bg-background"
              variant="outline"
            >
              {pageItem.number}
            </Button>
          {/if}
        </li>
      {/if}
    {/each}

    <li>
      {#if pagination.currentPage !== pagination.totalPages}
        {#if $settings.spaMode}
          <Button
            size="sm"
            variant="outline"
            class="px-2"
            on:click={() => {
              pageDataStore.navigate(urlForPage(pagination.currentPage + 1));
            }}
          >
            <ChevronRight />
          </Button>
        {:else}
          <Button
            size="sm"
            href={urlForPage(pagination.currentPage + 1)}
            variant="outline"
            class="px-2"
          >
            <ChevronRight />
          </Button>
        {/if}
      {:else}
        <Button size="sm" class="px-2" variant="outline" disabled>
          <ChevronRight />
        </Button>
      {/if}
    </li>
  {/if}
</ul>
