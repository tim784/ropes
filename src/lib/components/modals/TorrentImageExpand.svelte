<script lang="ts">
  import type { Torrent } from '$gather/torrents';
  import * as Dialog from '$lib/components/ui/dialog';
  import { fade } from 'svelte/transition';
  import Button from '../ui/Button.svelte';
  import X from 'lucide-svelte/icons/x';
  export let torrent: Torrent;
  
  const resizePathPartPattern = /^\/images\/resize\/\d+/;

  function getFullSizeImageUrlOrFallback(image_href: string) {
    const url = new URL(image_href);
    if (url.pathname.match(resizePathPartPattern)) {
      url.pathname = url.pathname.replace(resizePathPartPattern, '/images');
      return url.href;
    }
    return image_href;
  }
</script>

<Dialog.Content
  class="container max-h-[calc(100dvh-2rem)] max-w-none overflow-scroll p-0 sm:rounded-none md:w-auto"
  transition={fade}
>
  <picture class="transparency-checker-bg">
    <!-- this is kinda neat. because we can typically get a valid full
      size image URL with getFullSizeImageUrlOrFallback, we have the
      browser check its validity for us in a source tag: if its a real
      URL, the browser will show it, otherwise, it will just use the
      normal image. note that this does cause a flicker because normal
      image will come straight from cache, while big image must load from
      network. -->
    <source srcset={getFullSizeImageUrlOrFallback(torrent.imageHref)} />
    <img src={torrent.imageHref} alt={torrent.name} />
  </picture>
  <svelte:fragment slot="close"
    ><Dialog.Close asChild let:builder>
      <Button
        builders={[builder]}
        size="icon"
        variant="ghost"
        class="absolute right-4 top-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X class="size-6" />
        <span class="sr-only">Close</span>
      </Button>
    </Dialog.Close>
  </svelte:fragment>
</Dialog.Content>
