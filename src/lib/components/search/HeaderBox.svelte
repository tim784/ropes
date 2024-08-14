<script lang="ts">
  import { page, isSearchPage } from '$stores/page';
  import { settings } from '$stores/settings';
  import PostCarousel from '$components/search/PostCarousel.svelte';
  import Stats from '$components/nav/Stats.svelte';
  import type { LatestForumPost } from '$gather/latestForumPosts';

  let posts: LatestForumPost[] = [];

  $: if (isSearchPage($page)) {
    $page.dataPromise.then((data) => {
      posts = data.latestForumPosts;
    });
  }
</script>

<div
  class="mx-auto grid w-fit grid-flow-row rounded border *:border-b *:px-4 *:py-2 last:*:border-b-0"
>
  <div class="grid grid-cols-[auto_1fr] place-items-center gap-x-6 gap-y-4">
    <span class="font-bold text-muted-foreground">Stats</span>
    <Stats />
    {#if posts.length > 0 && $settings.showLatestForumThreads}
      <span class="font-bold text-muted-foreground">Latest Posts</span>
      <PostCarousel {posts} />
    {/if}
  </div>
</div>
