<script lang="ts">
  export let isEnd: boolean = false;
</script>

{#if isEnd}
  <div class="inline-flex items-center">
    <div class="flex flex-col">
      <div class="h-[21px] w-[2px] bg-border" />
      <div class="h-[19px] w-[2px]" />
    </div>
    <div class="h-[2px] w-4 bg-border" />
  </div>
{:else}
  <div class="inline-flex items-center h-full">
    <div class="h-full w-[2px] bg-border" />
    <div class="h-[2px] w-4 bg-border" />
  </div>
{/if}
