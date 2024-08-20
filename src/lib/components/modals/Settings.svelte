<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import Link from '$components/ui/Link.svelte';
  import X from 'lucide-svelte/icons/x';
  import packageJson from '$src/../package.json';
  import { settings } from '$stores/settings';
  import { seenTorrents } from '$stores/seen';
  import { tagCache } from '$stores/tagCache';
  import { notTags } from '$stores/notTags';
  import { Switch } from '$lib/components/ui/switch';
  import { isSupportedPage, page } from '$stores/page';
  import ConfirmButton from '$components/ui/ConfirmButton.svelte';
  import { toasts } from '$stores/toasts';
  import TextToast from '../toasts/TextToast.svelte';
  import { appTitle } from '$lib/constants';
  import * as Dialog from '$lib/components/ui/dialog';
  import { fade } from 'svelte/transition';
  import ToastContainer from '$components/ToastContainer.svelte';

  export let closeFn: () => void;

  let settingsUrl = '/';
  $: {
    const curPage = $page;
    if (isSupportedPage(curPage)) {
      curPage.dataPromise.then((data) => (settingsUrl = data.navigation.settingsUrl));
    }
  }

  // on vite server, GM_info will not be available because we're not a userscript there.
  const version = ('GM_info' in globalThis && GM_info?.script?.version) || packageJson.version;
</script>

<Dialog.Content
  class="container prose max-h-[75dvh] max-w-2xl overflow-y-scroll p-0 dark:prose-invert sm:rounded-none md:w-auto"
  transition={fade}
>
  <div class="sticky top-0 z-10 border-b bg-background-darker px-8 py-4">
    <div class="flex items-baseline justify-between">
      <h2 class="m-0">{appTitle} Settings</h2>

      <Button
        variant="ghost"
        size="icon"
        type="button"
        class="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        on:click={closeFn}><X /><span class="sr-only">Close</span></Button
      >
    </div>
  </div>

  <div class="mb-8 ml-8 mr-8 first:*:mt-0 last:*:mb-8">
    <ul>
      <li>
        <div class="flex items-baseline justify-between">
          <h3 class="mt-0">Open Links in New Tab</h3>
          <Switch bind:checked={$settings.openNonRopesInNewTab} />
        </div>
        <p>If set, links (that aren't search pages) will open in a new tab.</p>
        <p>If unset, links will open in this tab.</p>
      </li>

      <li>
        <div class="flex items-baseline justify-between">
          <h3>Prefer Rich Tag Mode</h3>
          <Switch bind:checked={$settings.preferRichTagMode} />
        </div>
        <p>
          Use Rich Tag Mode (one-at-a-time, autocompleted) by default or not. You can always switch
          modes as long if your search is supported.
        </p>
      </li>

      <li>
        <div class="flex items-baseline justify-between">
          <h3>Show Latest Forum Threads</h3>
          <Switch bind:checked={$settings.showLatestForumThreads} />
        </div>
        <p>
          Note that you must have <Link href={`${settingsUrl}#latest_forum_topics`}
            >forum topics selected in your settings</Link
          > for these to show up at all.
        </p>
      </li>

      <li>
        <div class="flex items-baseline justify-between">
          <h3>Single-Page App Mode</h3>
          <Switch bind:checked={$settings.spaMode} />
        </div>
        <p>
          In Single-Page App mode, {appTitle} will load supported pages internally without a page reload.
          This can be faster and will prevent the flash of original Empornium content, but you won't
          be able to right-click to open some links in new tabs (those related to search).
        </p>

        <p>
          If unset, {appTitle} will pass page loads to the the browser and links will be right-clickable.
        </p>
      </li>

      <li>
        <div class="flex items-baseline justify-between">
          <h3>Clear Seen Torrents</h3>
          <ConfirmButton
            on:confirm={() => {
              seenTorrents.clear();
              toasts.add(TextToast, { text: 'Seen torrents cleared!' });
            }}
            size="sm"
            class="w-[20ch] font-bold"
          >
            <svelte:fragment slot="quiescent">Clear Seen Torrents</svelte:fragment>
          </ConfirmButton>
        </div>
        <p>
          This will reset the "seen" status of all torrents you've viewed. Reload to take effect.
        </p>
      </li>

      <li>
        <div class="flex items-baseline justify-between">
          <h3>Clear Cached Tags</h3>
          <ConfirmButton
            on:confirm={() => {
              tagCache.clear();
              notTags.clear();
              toasts.add(TextToast, { text: 'Cached tags cleared!' });
            }}
            size="sm"
            class="w-[20ch] font-bold"
          >
            <svelte:fragment slot="quiescent">Clear Cached Tags</svelte:fragment>
          </ConfirmButton>
        </div>
        <p>Clear the local list of tags that power the tag autocomplete feature.</p>
      </li>

      <li>
        <h3>About</h3>
        <ul>
          <li>Version: <span class="font-mono">{version}</span></li>
          <li>Homepage: <Link href={packageJson.homepage}>{packageJson.homepage}</Link></li>
          <li>
            GitHub: <Link href={packageJson.repository.url}>{packageJson.repository.url}</Link>
          </li>
          <li>
            Forum Post: <Link href={packageJson.custom.forumHref}
              >{packageJson.custom.forumHref}</Link
            >
          </li>
          <li>Made by <Link href="/user.php?id=841079">timdotcom</Link></li>
        </ul>
      </li>
    </ul>
  </div>
</Dialog.Content>
