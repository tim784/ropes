<script lang="ts">
  import { type PageDataStore, type QueryParamStore, type SearchDataStore } from '$stores/page';
  import type { Pagination } from '$gather/pagination';
  import ChevronLeft from 'lucide-svelte/icons/chevron-left';
  import ChevronRight from 'lucide-svelte/icons/chevron-right';
  import Skeleton from '$components/ui/skeleton/skeleton.svelte';
  import { getContext } from 'svelte';
  import PaginatorButton from './PaginatorButton.svelte';

  const pageDataStore = getContext<PageDataStore>('pageDataStore');
  const searchDataStore = getContext<SearchDataStore>('searchDataStore');
  const queryParamsStore = getContext<QueryParamStore>('queryParamsStore');

  function makePageRadius(pagination: Pagination, radius = 2): (number | null)[] {
    const pageNumberSet: Set<number> = new Set();

    pageNumberSet.add(1);
    pageNumberSet.add(pagination.totalPages);

    const radiusMin = Math.max(1, currentPageNumber - radius);
    const radiusMax = Math.min(pagination.totalPages, currentPageNumber + radius);

    for (let i = radiusMin; i <= radiusMax; i++) {
      pageNumberSet.add(i);
    }

    const pageNumbers: (number | null)[] = Array.from(pageNumberSet).sort((a, b) => a - b);

    if (pageNumbers.length > 1) {
      if (pageNumbers[1] !== 2) {
        pageNumbers.splice(1, 0, null);
      }

      if (pageNumbers[pageNumbers.length - 2] !== pagination.totalPages - 1) {
        pageNumbers.splice(pageNumbers.length - 1, 0, null);
      }
    }

    return pageNumbers;
  }

  $: currentPageNumber = Number($queryParamsStore.get('page') ?? 1);
  $: pagination = $searchDataStore.pagination;
  $: pageNumbers = makePageRadius(pagination);
</script>

<ul class="my-4 flex items-center justify-center gap-4">
  {#if $pageDataStore.isLoading}
    {#each Array.from({ length: 5 }) as _}
      <li>
        <Skeleton class="h-8 w-8" />
      </li>
    {/each}
  {:else}
    <li>
      <PaginatorButton pageNumber={currentPageNumber - 1} disabled={currentPageNumber === 1}>
        <ChevronLeft />
      </PaginatorButton>
    </li>

    {#each pageNumbers as pageNumber}
      {#if pageNumber === null}
        <li class="select-none">...</li>
      {:else}
        <li>
          <PaginatorButton {pageNumber} isActive={pageNumber === currentPageNumber} />
        </li>
      {/if}
    {/each}

    <li>
      <PaginatorButton
        pageNumber={currentPageNumber + 1}
        disabled={currentPageNumber === pagination.totalPages}
      >
        <ChevronRight />
      </PaginatorButton>
    </li>
  {/if}
</ul>
