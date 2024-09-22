import { type Tag } from '$lib/tag';
import { priorities, queueFetch } from '$api/queue';
import type { CachedTag } from '$stores/tagCache';

type TagResponse = [string, [string, string][]];

function getTagsFromResponse(response: TagResponse): CachedTag[] {
  const apiTags: CachedTag[] = [];
  for (const [name, markup] of response[1]) {
    const useCount = parseInt(markup.match(/<span class="num">\((\d+)\)<\/span>/)?.[1] as string);
    apiTags.push({ name, useCount });
  }
  return apiTags;
}

export async function fetchAutocompleteTags(
  partialTag: Tag,
  type: 'validate' | 'autocomplete' = 'autocomplete'
): Promise<CachedTag[]> {
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
