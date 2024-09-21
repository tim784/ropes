<script lang="ts">
  import { tagCache, type TagCache, type CachedTagResult } from '$stores/tagCache';
  import { Taglist, Tag, isNegationChar } from '$lib/tag';
  import { fetchAutocompleteTags } from '$api/autocomplete';
  import pDebounce from 'p-debounce';
  import Kbd from '$components/ui/Kbd.svelte';
  import LoadingSpinner from '$components/ui/LoadingSpinner.svelte';
  import { makeAppIdentifier } from '$lib/constants';
  import { getContext } from 'svelte';
  import type { Result } from '$lib/result';
  import type { FormInputEvent } from '$components/ui/input';
  import Search from 'lucide-svelte/icons/search';
  import { cn } from '$components/shadcn-utils';
  import { formatNumber } from '$lib/util';

  export let taglistString: string;
  export let taglist: Taglist;

  const tagsElementId = makeAppIdentifier('tags-entry');
  const debounceDurationMilliseconds = 300;

  let containerWidth = 0;
  let containerHeight = 0;
  let inputElement: HTMLInputElement | undefined = undefined;
  let value: string | undefined = undefined;
  let partialTagResult: Result<Tag, string> | null = null;
  let matches: CachedTagResult[] = [];
  let selectedMatchIndex: number | null = null;
  let inputHasFocus = false;
  let dropdownOpen = false;
  let isFetching = false;

  $: partialTagResult = getPartialTagResult(value);
  $: matches = getMatches(partialTagResult, $tagCache);
  $: retrieveMatchesFromApi(partialTagResult);
  $: if (matches.length > 0) {
    selectedMatchIndex = 0;
  }
  $: scrollSelectedIntoView(selectedMatchIndex);

  const submitFunction = getContext<() => void>('submitFunction');

  function getPartialTagResult(input: string | undefined): Result<Tag, string> | null {
    if (input === undefined || input === '' || isNegationChar(input)) {
      return null;
    } else {
      let badCharIndex: number | null = null;
      let badChar: string | null = null;
      for (let index = 0; index < input.length; index++) {
        if (
          (index === 0 && !/^[-!a-zA-Z0-9.]$/.test(input[index])) ||
          (index > 0 && !/^[a-zA-Z0-9.]$/.test(input[index]))
        ) {
          badCharIndex = index;
          badChar = input[index];
          break;
        }
      }
      if (badCharIndex !== null) {
        return {
          success: false,
          error: `Invalid character \`${badChar}\` at index ${badCharIndex}`
        };
      } else {
        return Tag.fromString(input);
      }
    }
  }

  function getMatches(
    partialTagResult: Result<Tag, string> | null,
    tagCache: TagCache
  ): CachedTagResult[] {
    if (partialTagResult === null || !partialTagResult.success) {
      return [];
    }

    return tagCache.search(partialTagResult.value.name).filter((t) => !taglist.hasByName(t.name));
  }

  function retrieveMatchesFromApi_(partialTagResult: Result<Tag, string> | null) {
    if (partialTagResult === null || !partialTagResult.success) {
      return;
    }

    isFetching = true;

    fetchAutocompleteTags(partialTagResult.value, 'autocomplete').then((suggestions) => {
      suggestions = [...suggestions,
        {
          name: 'reallllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllly.long.tag',
          useCount: 12345678
        }
      ]
      tagCache.merge(suggestions);
      isFetching = false;
    });
  }

  const retrieveMatchesFromApi = pDebounce(retrieveMatchesFromApi_, debounceDurationMilliseconds);

  function scrollSelectedIntoView(selectedMatchIndex: number | null) {
    if (selectedMatchIndex === null) {
      return;
    }

    const selectedElement = document.querySelector(`[data-match-index="${selectedMatchIndex}"]`);
    selectedElement?.scrollIntoView({ block: 'nearest' });
  }

  function handleKeydown(e: FormInputEvent<KeyboardEvent>) {
    switch (e.key) {
      case 'Escape':
        dropdownOpen = false;
        break;
      case 'ArrowDown':
        if (selectedMatchIndex === null) {
          selectedMatchIndex = 0;
        } else {
          selectedMatchIndex = Math.min(selectedMatchIndex + 1, matches.length - 1);
        }
        e.preventDefault(); // don't move input cursor
        break;
      case 'ArrowUp':
        if (selectedMatchIndex === null) {
          selectedMatchIndex = matches.length - 1;
        } else {
          selectedMatchIndex = Math.max(selectedMatchIndex - 1, 0);
        }
        e.preventDefault(); // don't move input cursor
        break;
      case 'Enter':
        if (value === '') {
          submitFunction();
        } else {
          addTag();
        }
        break;
      default:
        dropdownOpen = true;
        break;
    }
  }

  function addTag() {
    if (selectedMatchIndex !== null && partialTagResult && partialTagResult.success) {
      const selectedMatch = matches[selectedMatchIndex];
      const newTag = Tag.create(
        partialTagResult.value.isNegated ? Tag.DEFAULT_NEGATION_CHAR : undefined,
        selectedMatch.name
      );
      if (!newTag.success) {
        console.error(newTag.error);
        return;
      }
      taglist.add(newTag.value);
      taglistString = taglist.toString();
      value = '';
      selectedMatchIndex = null;
      dropdownOpen = false;
      isFetching = false;
    }
  }

  function handleFocus(e: FormInputEvent<FocusEvent>) {
    inputHasFocus = true;
    dropdownOpen = true;
  }

  function handleBlur(e: FormInputEvent<FocusEvent>) {
    inputHasFocus = false;

    // if relatedTarget has data-match-index, then we're focusing on a match, so
    // don't close the dropdown (the addTag function will do this after click).
    // otherwise, close it.
    if (e.relatedTarget) {
      const matchIndex = (e.relatedTarget as HTMLElement).dataset.matchIndex;
      if (matchIndex !== undefined) {
        return;
      }
    }
    dropdownOpen = false;
  }

  function handleSearchFocusKeybind(e: KeyboardEvent) {
    if (e.key === 's' && e.altKey) {
      if (inputElement) {
        inputElement.focus();
      }
      e.preventDefault();
    }
  }

  $: inputClass = cn(
    'flex h-10 w-full items-center border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:border-primary focus-within:bg-popover group',
    dropdownOpen ? 'rounded-t-lg border-t border-x' : 'rounded-lg border'
  );

  // TODO: make it so that, when new matches come in after loading, it doesn't
  // change the selected match, or just generally isn't disruptive
  //
  // TODO: when down-click on button, border-primary on inputclass is removed
  //
  // TODO: can't tab past input if value is non-empty. this is a firefox bug,
  // not present on other browsers, thus, okay to ignore?
  //
  // TODO: in production, for tags with lots of uses, the content wraps to the
  // next line. prevent this. this should always be a single line. ensure no
  // x-scroll either. maybe flex is the better move here?
  //
  // TODO: when scrolling with mouse wheel and pointer is over the dropdown, the
  // the selected match keeps jumping around (sometimes.)
</script>

<svelte:window on:keydown={handleSearchFocusKeybind} />

<div class="relative" bind:clientHeight={containerHeight} bind:clientWidth={containerWidth}>
  <div class={inputClass}>
    <Search class="mr-2 size-4 shrink-0 opacity-50" />
    <input
      autocomplete="off"
      bind:this={inputElement}
      bind:value
      id={tagsElementId}
      on:keydown={handleKeydown}
      on:focus={handleFocus}
      on:blur={handleBlur}
      placeholder="Search for a tag…"
      class="grow bg-inherit focus-visible:outline-none"
    />

    {#if !inputHasFocus}
      <Kbd class="text-sm" keys={['AltOrOption', 's']} />
    {/if}
    {#if isFetching}
      <LoadingSpinner class="ml-2 size-4" />
    {/if}
  </div>

  {#if dropdownOpen}
    <div
      class="absolute z-10 rounded-b-lg border border-primary bg-popover px-3 py-2"
      style:width={`${containerWidth}px`}
    >
      {#if partialTagResult === null}
        <div class="">
          <p class="mb-4">
            Add tags one at a time. To submit entire search, press <Kbd keys={['Enter']} /> when empty.
          </p>

          <h3 class="mb-4 text-lg font-bold">Syntax</h3>

          <div class="grid grid-cols-[auto_auto] gap-2">
            <div class="justify-self-center font-mono font-bold">tag</div>
            <div>Include a tag</div>

            <div class="justify-self-center">
              <span class="font-mono font-bold">!tag</span> or&nbsp;<span
                class="font-mono font-bold">-tag</span
              >
            </div>
            <div>Exclude a tag</div>
          </div>
        </div>
      {:else if !partialTagResult.success}
        <output class="font-mono text-warning">{partialTagResult.error}</output>
      {:else}
        {#if matches.length > 0}
          <ul
            class="grid max-h-[50dvh] grid-cols-[auto_auto] gap-x-2 overflow-y-scroll focus-visible:outline-none foo"
          >
            {#each matches as match, index (match.name)}
              <li class="col-span-2 grid grid-cols-subgrid">
                <button
                  class="col-span-2 grid grid-cols-subgrid items-center rounded px-2 py-1"
                  class:font-bold={match.exact}
                  class:bg-accent={selectedMatchIndex === index}
                  data-match-index={index}
                  on:pointerenter={() => {
                    selectedMatchIndex = index;
                  }}
                  on:click={addTag}
                >
                  <span class="justify-self-start hyphens-auto">{match.name}</span>
                  <span class="justify-self-end whitespace-nowrap text-sm text-foreground/50"
                    >({formatNumber(match.useCount)} uses)</span
                  >
                </button>
              </li>
            {/each}
          </ul>
        {/if}
        {#if matches.length === 0}
          {#if !isFetching}
            <p>No matches found.</p>
          {:else}
            <p class="italic">Loading...</p>
          {/if}
        {/if}
      {/if}
    </div>
  {/if}
</div>

<style>
  .foo {
    scrollbar-gutter: stable;
  }
</style>