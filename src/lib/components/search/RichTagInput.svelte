<script lang="ts">
  import { tagCache, type TagCache, type CachedTagResult } from '$stores/tagCache';
  import {
    Taglist,
    Tag,
    isNegationChar,
    InvalidNegationError,
    UnsupportedNodeError
  } from '$lib/tag';
  import { fetchAutocompleteTags } from '$api/autocomplete';
  import pDebounce from 'p-debounce';
  import Kbd from '$components/ui/Kbd.svelte';
  import LoadingSpinner from '$components/ui/LoadingSpinner.svelte';
  import { makeAppIdentifier } from '$lib/constants';
  import type { Result } from '$lib/result';
  import type { FormInputEvent } from '$components/ui/input';
  import Search from 'lucide-svelte/icons/search';
  import { cn } from '$components/shadcn-utils';
  import { formatNumber } from '$lib/util';
  import { getContext, createEventDispatcher } from 'svelte';
  import { notTags } from '$stores/notTags';
  import type { BaseParseAstError } from '$src/lib/tag/ast';
  import type { BaseTokenError } from '$src/lib/tag/token';

  export let taglist: Taglist;

  class TagFormatError extends Error {
    constructor() {
      super('Incorrect tag format');
    }
  }

  type TagEntryResult = Result<
    Tag,
    | BaseTokenError
    | BaseParseAstError
    | UnsupportedNodeError
    | InvalidNegationError
    | TagFormatError
  >;

  const tagsElementId = makeAppIdentifier('tags-entry');
  const debounceDurationMilliseconds = 300;
  const dispatch = createEventDispatcher();

  let containerWidth = 0;
  let containerHeight = 0;
  let thisElement: HTMLElement | undefined = undefined;
  let inputElement: HTMLInputElement | undefined = undefined;
  let value: string = '';
  let partialTagResult: TagEntryResult | null = null;
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

  function getPartialTagResult(input: string): TagEntryResult | null {
    if (input === '' || isNegationChar(input)) {
      return null;
    } else {
      // we can parse this input value with our taglist AST parser, but there
      // are some additional constraints on the input format
      if (!/^[-!]?[a-zA-Z0-9.]{1,}$/.test(input)) {
        return { success: false, error: new TagFormatError() };
      }
      return Tag.fromString(input);
    }
  }

  function getMatches(
    partialTagResult: TagEntryResult | null,
    tagCache: TagCache
  ): CachedTagResult[] {
    if (partialTagResult === null || !partialTagResult.success) {
      return [];
    }

    return tagCache.search(partialTagResult.value.name).filter((t) => !taglist.hasByName(t.name));
  }

  function retrieveMatchesFromApi_(partialTagResult: TagEntryResult | null) {
    if (partialTagResult === null || !partialTagResult.success) {
      return;
    }

    isFetching = true;

    fetchAutocompleteTags(partialTagResult.value, 'autocomplete').then((matches) => {
      tagCache.merge(matches);

      if (!matches.map((m) => m.name).includes(partialTagResult.value.name)) {
        $notTags.add(partialTagResult.value.name);
      }

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
      case 'Tab':
        dropdownOpen = false;
        break;
      default:
        // when user types something, (re)open dropdown
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
      dispatch('tagadd', newTag.value);
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
  }

  function handleOutsideClick(e: MouseEvent) {
    if (!thisElement?.contains(e.target as Node)) {
      dropdownOpen = false;
    }
  }

  function handleWindowFocusIn(e: FocusEvent) {
    if (e.target && !thisElement?.contains(e.target as Node) && e.target !== inputElement) {
      dropdownOpen = false;
    }
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
    'flex h-10 w-full items-center border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:border-primary focus-within:bg-popover',
    dropdownOpen ? 'rounded-t-lg border-t border-x border-primary bg-popover' : 'rounded-lg border'
  );
</script>

<svelte:window
  on:keydown={handleSearchFocusKeybind}
  on:click={handleOutsideClick}
  on:focusin={handleWindowFocusIn}
/>

<div
  class="relative"
  bind:clientHeight={containerHeight}
  bind:clientWidth={containerWidth}
  bind:this={thisElement}
>
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

    {#if !inputHasFocus && !dropdownOpen}
      <Kbd class="text-sm" keys={['AltOrOption', 's']} />
    {/if}
    {#if isFetching && dropdownOpen}
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
        <output class="text-warning">Invalid character in input</output>
      {:else}
        {#if matches.length > 0}
          <!-- tabindex to -1 because, when scrollable, it accepts focus, which messes with tabbing order -->
          <ul class="max-h-[50dvh] overflow-y-scroll" tabindex="-1">
            {#each matches as match, index (match.name)}
              <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
              <li
                class="grid w-full cursor-pointer grid-cols-[auto_auto] items-center justify-between gap-2 rounded px-2 py-1"
                class:font-bold={match.exact}
                class:bg-accent={selectedMatchIndex === index}
                data-match-index={index}
                on:pointerenter={() => {
                  selectedMatchIndex = index;
                }}
                on:click={() => {
                  inputElement?.focus();
                  addTag();
                }}
              >
                <span class="break-all">{match.name}</span>
                <span class="whitespace-nowrap text-sm text-foreground/50"
                  >({formatNumber(match.useCount)} uses)</span
                >
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
