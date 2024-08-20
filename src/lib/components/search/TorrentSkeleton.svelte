<script lang="ts">
  import Image from 'lucide-svelte/icons/image';
  import { randInt, randItemFromArray } from '$lib/util';
  import { Skeleton } from '$components/ui/skeleton';
  import { fade } from 'svelte/transition';

  const widths = ['w-9/12', 'w-10/12', 'w-11/12', 'w-full'];
  function randWidth() {
    return randItemFromArray(widths);
  }
</script>

<div
  class="flex max-w-full flex-col items-center gap-4 rounded-lg border-border bg-card shadow-lg"
  transition:fade
>
  <!-- image -->
  <Skeleton class="relative h-52 w-full">
    <Image
      class="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 text-muted-foreground"
    />
    <span class="sr-only">Image Placeholder</span>
  </Skeleton>

  <div class="flex w-full flex-col gap-4 p-4">
    <!-- badges -->
    <div class="flex w-full gap-2">
      {#each Array.from({ length: randInt(0, 3) }) as _}
        <Skeleton class="h-6 w-20 rounded-full" />
      {/each}
    </div>

    <!-- title -->
    <div class="flex flex-col gap-2">
      {#each Array.from({ length: randInt(1, 3) }) as _}
        <Skeleton class={`h-6 rounded-full ${randWidth()}`} />
      {/each}
    </div>

    <!-- meta -->
    <div class="flex flex-col gap-2">
      <div class="flex w-full gap-2">
        {#each Array.from({ length: 2 }) as _}
          <Skeleton class="h-5 w-32  rounded-full" />
        {/each}
      </div>
      <div class="flex w-full gap-2">
        {#each Array.from({ length: 3 }) as _}
          <Skeleton class="h-5 w-[5.175rem]  rounded-full" />
        {/each}
      </div>
      <div class="flex w-full gap-2">
        {#each Array.from({ length: 2 }) as _}
          <Skeleton class="h-5 w-32  rounded-full" />
        {/each}
      </div>
    </div>

    <!-- actions -->
    <Skeleton class="h-12 w-full" />
  </div>
</div>
