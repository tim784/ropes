<script lang="ts">
  /**
   * The RichTagInput component provides suggestions to partially entered tags.
   *
   * Under the hood, we're using cmdk-sv to manage much of the state and logic,
   * but with significant customizations. Lotta of
   * <https://www.youtube.com/watch?v=EzWNBmjyv7Y> energy, possibly at my own
   * expense.
   */
  import { onMount } from 'svelte';
  import { tagCache, type TagCache } from '$stores/tagCache';
  import { TaglistTag, type CacheTag } from '$lib/tag';
  import { fetchAutocompleteTags } from '$api/autocomplete';
  import pDebounce from 'p-debounce';
  import Kbd from '$components/ui/Kbd.svelte';
  import AddedTags from './AddedTags.svelte';
  import * as Command from '$components/ui/command';
  import { createState } from 'cmdk-sv';
  import { settings } from '$stores/settings';
  import { localFormData } from '$src/lib/stores/localFormData';
  import LoadingSpinner from '$components/ui/LoadingSpinner.svelte';
  import { wipe } from '$lib/transition';
  import { TAGLIST_NAME } from '$src/lib/gather/search';
  import { makeAppIdentifier } from '$lib/constants';

  const tagsElementId = makeAppIdentifier('tags-entry');

  const inputState = createState();

  $: tags = TaglistTag.validateSyntax($localFormData.d.get(TAGLIST_NAME)?.toString() || '');

  let inputHasFocus = false;
  let escapedOut = false;
  let isPointerOverSuggestions = false;
  let hasJustEnteredTag = false;
  $: open =
    (inputHasFocus || isPointerOverSuggestions) &&
    !escapedOut &&
    !$settings.sfwMode &&
    !hasJustEnteredTag;

  let isLoading = false;
  let suggestions: CacheTag[] = [];

  let lastTag: TaglistTag | null = null;
  $: partialTag = TaglistTag.fromString($inputState.search);
  $: negationChar = partialTag.negationChar;
  $: [isValid, reason] = partialTag.validate();

  function matchSuggestions(tagCache: TagCache, partialTag: TaglistTag, currentTags: TaglistTag[]) {
    return tagCache
      .match(partialTag.name)
      .filter((t) => !currentTags.some((ct) => ct.name === t.name));
  }

  function resetInput() {
    // yeesh, gotta do em both it seems.
    inputState.update((state) => ({ ...state, search: '' }));
    inputElement.value = '';
  }

  const fetchMergeAndSuggest = pDebounce(
    (partialTag: TaglistTag) =>
      fetchAutocompleteTags(partialTag).then((fetchedTags) => {
        tagCache.merge(fetchedTags);
        suggestions = matchSuggestions($tagCache, partialTag, tags);
        isLoading = false;
      }),
    300
  );

  $: {
    // state seems to update on a interval regardless of changed input, so lets
    // make sure we're not doing too much work.
    if (!(lastTag && partialTag.name === lastTag.name) && partialTag.name !== '') {
      escapedOut = false;
      hasJustEnteredTag = false;
      if (isValid) {
        suggestions = matchSuggestions($tagCache, partialTag, tags);
        isLoading = true;
        fetchMergeAndSuggest(partialTag);
      } else {
        suggestions = [];
        isLoading = false;
      }
      lastTag = partialTag;
    }
  }

  $: emptyInput = $inputState.search === '';

  // note that this doesn't count the negation character. you're still empty if
  // you've only typed that.
  $: emptyName = partialTag.name === '';
  $: hasSuggestions = suggestions.length > 0;

  $: showHelp = emptyName && !isLoading;
  $: showNoMatches = !isLoading && !hasSuggestions && !emptyName;
  $: showInvalid = showNoMatches && !isValid;
  $: showSuggestions = !emptyName && hasSuggestions;

  let inputHeight: number;
  let inputWidth: number;
  let inputElement: HTMLInputElement;

  function getSelectedSuggestionName() {
    const selected = document.querySelector(
      '[data-cmdk-item][data-selected="true"]'
    ) as HTMLElement | null;
    if (!selected) {
      return null;
    }
    return selected.dataset.suggestionName;
  }

  function addSuggestionToTags(suggestionName: string) {
    const suggestionTaglistTag = new TaglistTag(negationChar, suggestionName);
    localFormData.addTag(suggestionTaglistTag);
    resetInput();
    hasJustEnteredTag = true;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      escapedOut = true;
    } else if (e.key === 'Home' || e.key === 'End') {
      // kinda crazy we need to do this ourselves. seems cmdk-sv tried to rebuild
      // an <input> element from scratch with keydown handlers and forgot this
      // one, i think. https://github.com/huntabyte/cmdk-sv/issues/97
      if (inputElement) {
        let position = 0;
        if (e.key === 'End') {
          position = inputElement.value.length;
        }
        inputElement.setSelectionRange(position, position);
        e.preventDefault();
      }
    } else if (e.key === 'Enter') {
      const selectedSuggestionName = getSelectedSuggestionName();
      if (selectedSuggestionName) {
        addSuggestionToTags(selectedSuggestionName);
      } else if (emptyInput) {
        $localFormData.submit();
      }
      e.preventDefault();
    }
  }

  function handleItemClick(suggestion: CacheTag) {
    addSuggestionToTags(suggestion.name);
    isPointerOverSuggestions = false;
  }

  onMount(() => {
    function handleKeybind(e: KeyboardEvent) {
      if (e.key === 's' && e.altKey) {
        if (inputElement) {
          inputElement.focus();
        }
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', handleKeybind);

    return () => {
      window.removeEventListener('keydown', handleKeybind);
    };
  });
</script>

<div class="space-y-4">
  <Command.Root loop={false} shouldFilter={false} state={inputState} class="group relative">
    <Command.Input
      id={tagsElementId}
      placeholder="Search for a tag..."
      on:focus={() => {
        inputHasFocus = true;
        escapedOut = false;
        hasJustEnteredTag = false;
      }}
      on:blur={() => (inputHasFocus = false)}
      on:keydown={handleKeydown}
      bind:clientHeight={inputHeight}
      bind:clientWidth={inputWidth}
      suggestionsOpen={open}
      class=""
      bind:el={inputElement}
      keys={['AltOrOption', 'S']}
    />
    {#if open}
      <Command.List
        class="absolute z-10 w-full rounded-b border border-ring bg-popover px-2 py-1.5 text-sm text-popover-foreground shadow-md"
        style={`top: ${inputHeight}px;`}
      >
        {#if isLoading}
          <div class="flex items-center px-1">
            <LoadingSpinner class="me-2 size-4" />Loading...
          </div>
        {/if}
        {#if showSuggestions}
          <div
            on:pointerenter={() => {
              isPointerOverSuggestions = true;
            }}
            on:pointerleave={() => {
              isPointerOverSuggestions = false;
            }}
          >
            <Command.Group heading="Suggestions">
              {#each suggestions as suggestion (suggestion.name)}
                <Command.Item data-suggestion-name={suggestion.name}
                  ><button
                    type="button"
                    class="flex w-full justify-between px-2 py-1.5"
                    class:font-bold={suggestion.exact}
                    on:click={() => handleItemClick(suggestion)}
                    transition:wipe={{ axis: 'y' }}
                  >
                    <span>{negationChar}{suggestion.name}</span>
                    <span class="text-sm text-foreground/50">({suggestion.count} uses)</span>
                  </button></Command.Item
                >
              {/each}
            </Command.Group>
          </div>
        {/if}
        {#if showInvalid}
          <p class="mb-4 break-words text-sm">
            Tag <span class="font-mono">{partialTag.toString()}</span> is invalid:
          </p>
          <p class="font-mono text-sm">
            {reason}
          </p>
        {:else if showNoMatches}
          <p class="break-words text-sm">
            No matches for <span class="font-mono">{partialTag.toString()}</span>
          </p>
        {/if}
        {#if showHelp}
          <p class="mb-4">
            Add tags one at a time. To submit entire search, press <Kbd keys={['Enter']} /> when empty.
          </p>
          <p class="mb-2 font-bold">Syntax</p>
          <div class="grid grid-cols-[auto_1fr] gap-2">
            <div class="justify-self-end font-mono font-bold">tag</div>
            <div>Include a tag</div>

            <div class="justify-self-end">
              <span class="font-mono font-bold">!tag</span> or&nbsp;<span
                class="font-mono font-bold">-tag</span
              >
            </div>
            <div>Exclude a tag</div>
          </div>
        {/if}
      </Command.List>
    {/if}
  </Command.Root>

  <AddedTags />
</div>
