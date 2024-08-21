<script lang="ts">
  import Button from '$components/ui/Button.svelte';
  import { localFormData } from '$stores/localFormData';
  import TagsSection from './TagsSection.svelte';
  import SortCriteria from './SortCriteria.svelte';
  import SortOrder from './SortOrder.svelte';
  import { settings } from '$stores/settings';
  import MakeDefault from './MakeDefault.svelte';
  import * as DropdownMenu from '$components/ui/dropdown-menu';
  import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
  import Search from 'lucide-svelte/icons/search';
  import UserSearch from 'lucide-svelte/icons/user-search';
  import Eraser from 'lucide-svelte/icons/eraser';
  import { page } from '$stores/page';
</script>

<!-- because this form uses a get, it doesn't really need to be a form. in face,
i kinda like the search button showing the url it'd navigate to in non-SPA mode
-->
<form class="w-full space-y-4 p-1 transition-colors">
  <TagsSection />

  <SortCriteria />
  <SortOrder />

  <MakeDefault />

  <div class="grid grid-cols-[1fr_min-content]">
    {#if $settings.spaMode}
      <Button
        type="button"
        on:click={$localFormData.submit}
        class="rounded-e-none rounded-s-lg border-e-2 text-xl font-bold"
        size="lg"><Search class="me-2" />Search</Button
      >
    {:else}
      <Button
        href={$localFormData.getUrl()}
        class="rounded-e-none rounded-s-lg border-e-2 text-xl font-bold"
        size="lg"><Search class="me-2" />Search</Button
      >
    {/if}
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
                page.navigateToSearch(new FormData());
              }}><UserSearch class="me-2" />Go to Default Search</DropdownMenu.Item
            >
          {:else}
            <DropdownMenu.Item href="/torrents.php"
              ><UserSearch class="me-2" />Go to Default Search</DropdownMenu.Item
            >
          {/if}
          <DropdownMenu.Item on:click={localFormData.clearTags}
            ><Eraser class="me-2" />Clear Tags</DropdownMenu.Item
          >
          <DropdownMenu.Item on:click={localFormData.clearAll}
            ><Eraser class="me-2 fill-foreground/50" />Clear All</DropdownMenu.Item
          >
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</form>

{#if import.meta.env.DEV}
  <p class="break-all font-mono">{$localFormData.getUrl()}</p>
{/if}
