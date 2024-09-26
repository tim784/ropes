<script lang="ts">
  import { filterStore } from '$stores/filters';
  import { Textarea } from '$components/ui/textarea';
  import { Label } from '$components/ui/label';
  import { Input } from '$components/ui/input';
  import { makeAppIdentifier } from '$lib/constants';
  import ConfirmButton from '$components/ui/ConfirmButton.svelte';
  import { onMount } from 'svelte';
  import { Checkbox } from '$components/ui/checkbox';
  import { z } from 'zod';
  import { createEventDispatcher } from 'svelte';
  import { type Filter } from '$lib/filter';
  import { get } from 'svelte/store';

  function splitTags(tagString: string) {
    return tagString
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((tag) => tag.length > 0);
  }

  const dispatch = createEventDispatcher();
  const nameInputId = makeAppIdentifier('filter-name-input');
  const onByDefaultInputId = makeAppIdentifier('filter-on-by-default-input');
  const blockTagsInputId = makeAppIdentifier('filter-block-tags-input');
  const allowTagsInputId = makeAppIdentifier('filter-allow-tags-input');
  const tagPattern = /^[a-zA-Z0-9.]+$/;
  const getFilters = () => get(filterStore);
  const schema = z
    .object({
      name: z
        .string()
        .min(1, 'Name should be non-empty')
        .refine(
          (name) => {
            const filtersWithName = getFilters().filter((f) => f.name === name);
            const isUnique = filtersWithName.every((f) => f.id === filterId);
            return isUnique;
          },
          {
            message: 'Name should be unique'
          }
        ),
      onByDefault: z.boolean(),
      blockTags: z.string(),
      allowTags: z.string()
    })
    .superRefine((val, ctx) => {
      const blockTags = splitTags(val.blockTags);
      const allowTags = splitTags(val.allowTags);

      if (blockTags.some((tag) => !tagPattern.test(tag))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid character in tag',
          path: ['blockTags']
        });
      }

      if (allowTags.some((tag) => !tagPattern.test(tag))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid character in tag',
          path: ['allowTags']
        });
      }

      if (blockTags.some((tag) => allowTags.includes(tag))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tags in allow list should not be in block list',
          path: ['allowTags']
        });
      }
    });

  type FormFilter = z.infer<typeof schema>;

  export let filterId: string;
  export let scrollingContainer: HTMLElement | null;

  function mapFilterToFormFilter(filter: Filter) {
    return {
      name: filter.name,
      onByDefault: filter.onByDefault,
      blockTags: filter.blockTags.join(' '),
      allowTags: filter.allowTags.join(' ')
    };
  }

  function mapFormFilterToFilter(formFilter: FormFilter) {
    return {
      id: filterId,
      name: formFilter.name,
      onByDefault: formFilter.onByDefault,
      blockTags: splitTags(formFilter.blockTags),
      allowTags: splitTags(formFilter.allowTags)
    };
  }

  let formFilter = mapFilterToFormFilter($filterStore.find((f) => f.id === filterId)!);
  $: parse = schema.safeParse(formFilter);

  let nameElement: HTMLInputElement | undefined = undefined;
  let blockTagsElement: HTMLTextAreaElement | undefined = undefined;
  let allowTagsElement: HTMLTextAreaElement | undefined = undefined;

  $: nameErrors = getErrors(parse, 'name', nameElement);
  $: blockTagsErrors = getErrors(parse, 'blockTags', blockTagsElement);
  $: allowTagsErrors = getErrors(parse, 'allowTags', allowTagsElement);

  function updateFilter(formFilter: FormFilter) {
    filterStore.update((filterStore) => {
      return filterStore.map((f) => {
        if (f.id === filterId) {
          return mapFormFilterToFilter(formFilter);
        }
        return f;
      });
    });
  }

  function getErrors(
    parsed: ReturnType<typeof schema.safeParse>,
    path: string,
    element: HTMLInputElement | HTMLTextAreaElement | undefined
  ): string[] {
    if (!element) return [];
    element.setCustomValidity('');

    if (parsed.success) return [];

    const errorsForPath = parsed.error.errors
      .filter((error) => error.path[0] === path)
      .map((error) => error.message);
    if (errorsForPath.length > 0) {
      // we don't present this validity message, but, for styling, want the
      // element to be in the invalid state
      element.setCustomValidity(errorsForPath.join(', '));
    }
    return errorsForPath;
  }

  $: updateFilter(formFilter);

  function dispatchDelete() {
    dispatch('delete');
  }

  onMount(() => {
    // scroll to top on switch
    if (scrollingContainer) scrollingContainer.scrollTop = 0;
  });
</script>

<div class="prose px-8 py-4 dark:prose-invert">
  <Label for={nameInputId}><h3 class="mt-0">Name</h3></Label>
  <Input id={nameInputId} bind:value={formFilter.name} type="text" bind:el={nameElement} />
  {#if nameErrors.length > 0}
    <p class="mt-1 text-sm text-error mb-0">{nameErrors.join(', ')}</p>
  {/if}

  <div class="flex items-baseline justify-between">
    <Label for={onByDefaultInputId}><h3>Is On by Default</h3></Label>
    <Checkbox id={onByDefaultInputId} bind:checked={formFilter.onByDefault} />
  </div>
  <p class="mt-1 text-sm text-muted-foreground">
    Sets whether this filter is on by default in new tabs.
  </p>

  <Label for={blockTagsInputId}><h3>Exclude List (Optional)</h3></Label>
  <Textarea
    id={blockTagsInputId}
    class="font-mono"
    bind:value={formFilter.blockTags}
    bind:el={blockTagsElement}
  />
  {#if blockTagsErrors.length > 0}
    <p class="mt-1 text-sm text-error">{blockTagsErrors.join(', ')}</p>
  {/if}
  <p class="mt-1 text-sm text-muted-foreground">
    If a torrent has a tag in this list, it will be excluded. Separate tags with spaces. If blank,
    no torrents will be excluded.
  </p>

  <Label for={allowTagsInputId}><h3>Include List (Optional)</h3></Label>
  <Textarea
    id={allowTagsInputId}
    class="font-mono"
    bind:value={formFilter.allowTags}
    bind:el={allowTagsElement}
  />
  {#if allowTagsErrors.length > 0}
    <p class="mt-1 text-sm text-error">{allowTagsErrors.join(', ')}</p>
  {/if}
  <p class="mt-1 text-sm text-muted-foreground">
    If a torrent has a tag in this list, it will be included. Exclusion happens before inclusion.
    Separate tags with spaces. If blank, all torrents will be included.
  </p>

  <h3>Actions</h3>
  <ul>
    <li>
      <ConfirmButton on:confirm={dispatchDelete}>
        <svelte:fragment slot="quiescent">Delete Filter</svelte:fragment>
      </ConfirmButton>
    </li>
  </ul>
</div>
