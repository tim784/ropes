import { type TaglistTag, type CacheTag } from '$lib/tag';
import { priorities, queueFetch } from '$api/queue';

type TagResponse = [string, [string, string][]];

function getTagsFromResponse(response: TagResponse): CacheTag[] {
  const apiTags: CacheTag[] = [];
  for (const [name, markup] of response[1]) {
    const count = parseInt(markup.match(/<span class="num">\((\d+)\)<\/span>/)?.[1]!);
    apiTags.push({ name, count });
  }
  return apiTags;
}

export async function fetchAutocompleteTags(
  partialTag: TaglistTag,
  type: 'validate' | 'autocomplete' = 'autocomplete'
): Promise<CacheTag[]> {
  const response = await queueFetch(
    `/tags.php?action=autocomplete&name=${partialTag.name}`,
    { credentials: 'same-origin' },
    `autocompleting tags for "${partialTag.name}"`,
    type === 'autocomplete' ? priorities.autocomplete : priorities.validateTag
  );

  const data = await response.json();
  const suggestions = getTagsFromResponse(data);
  return suggestions;
}
/**
 * 3 things: loading, emptyInput, hasSuggestions
 * if loading, spinner
 * if no suggestions, show "match not found"
 * else show suggestions
 */