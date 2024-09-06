<script lang="ts">
  import SizeBound from './SizeBound.svelte';
  import { SizeRange, type Size, unitValues, getUnitPower, bytesToUnit } from '$lib/size';
  import { getContext } from 'svelte';
  import { type Readable } from 'svelte/store';
  import { type Search, SIZE_MID_NAME, SIZE_UNIT_NAME, SIZE_RANGE_NAME } from '$gather/search';
  import { localFormData } from '$stores/localFormData';

  const search = getContext<Readable<Search>>('search');
  let error: string | null = null;

  function getPageSizeRange(search: Search): SizeRange | undefined | null {
    const mid = search.formData.get(SIZE_MID_NAME)?.toString();
    const range = search.formData.get(SIZE_RANGE_NAME)?.toString();
    const unit = search.formData.get(SIZE_UNIT_NAME)?.toString();

    return SizeRange.fromEmpSizeRange({
      [SIZE_MID_NAME]: mid,
      [SIZE_RANGE_NAME]: range,
      [SIZE_UNIT_NAME]: unit
    });
  }

  function parseSize(minSize: Size | undefined, maxSize: Size | undefined): SizeRange | undefined {
    if (!minSize && !maxSize) return undefined;
    return SizeRange.fromSizes(minSize, maxSize);
  }

  $: pageSizeRange = getPageSizeRange($search);
  let minSize: Size | undefined;
  let maxSize: Size | undefined;

  $: console.log('minSize', minSize, 'maxSize', maxSize);
  $: sizeRange = parseSize(minSize, maxSize);
  $: if (sizeRange) {
    localFormData.setRange(sizeRange);
  } else {
    localFormData.clearRange();
  }
</script>

<div>
  <p class="mb-2 block text-xl font-bold">Size</p>
  <div class="grid grid-flow-row gap-2">
    {#key pageSizeRange?.minBytes}
      <SizeBound
        label="Min"
        initialSize={pageSizeRange?.minSize}
        shown={Boolean(pageSizeRange)}
        bind:size={minSize}
      />
    {/key}
    {#key pageSizeRange?.maxBytes}
      <SizeBound
        label="Max"
        initialSize={pageSizeRange?.maxSize}
        shown={Boolean(pageSizeRange)}
        bind:size={maxSize}
      />
    {/key}
  </div>
</div>
