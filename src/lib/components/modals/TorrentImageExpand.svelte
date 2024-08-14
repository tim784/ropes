<script lang="ts">
  import { onMount } from 'svelte';
  import type { Torrent } from '$gather/torrents';
  import { settings } from '$stores/settings';

  export let torrent: Torrent;
  export let closeFn: () => void;
  let initialSfwMode = $settings.sfwMode;

  const resizePathPartPattern = /^\/images\/resize\/\d+/;

  function getFullSizeImageUrlOrFallback(image_href: string) {
    const url = new URL(image_href);
    if (url.pathname.match(resizePathPartPattern)) {
      url.pathname = url.pathname.replace(resizePathPartPattern, '/images');
      return url.href;
    }
    return image_href;
  }

  onMount(() => {
    const unsubscribeSettings = settings.subscribe((update) => {
      // if switching sfw mode, close the dialog
      if (initialSfwMode !== update.sfwMode) {
        closeFn();
      }
    });
    return () => {
      unsubscribeSettings();
    };
  });
</script>

<div class="container mx-auto transparency-bg" on:click={closeFn} role="presentation">
  <picture>
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
</div>

<style>
  .transparency-bg {
    /* background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" %3E%3Cg fill="%23F0F0F0" fill-opacity="0.3"%3E%3Cpath d="M0 0h8v8H0zm8 8h8v8H8z" /%3E%3C/g%3E%3C/svg%3E'); */
    background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%3E%3Crect%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%23999%22%2F%3E%3Cg%20fill%3D%22%23666%22%3E%3Cpath%20d%3D%22M0%200h8v8H0zM8%208h8v8H8z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E');
    background-size: 16px 16px;
  }
</style>