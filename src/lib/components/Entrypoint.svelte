<script lang="ts">
  import { onMount } from 'svelte';
  import { enabled } from '$stores/enabled';
  import { appName, appTitle } from '$lib/constants';
  import App from '$components/App.svelte';
  import { determinePageType, PageType } from '$stores/page';

  const buttonId = `${appName}-load-button`;

  function pageTypeIsSupported() {
    // Flesh out more page types when we implement them
    return determinePageType() === PageType.Search;
  }

  // we need to do this programmatically because we're inserting into a dom area
  // outside of this component
  function placeLoadButton() {
    if (document.getElementById(buttonId)) {
      return;
    }

    const ul = document.querySelector('#menu ul:last-of-type');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.style.cursor = 'pointer';
    a.id = buttonId;
    a.textContent = `Load ${appTitle}`;
    a.addEventListener('click', () => ($enabled = true));
    li.appendChild(a);
    ul?.appendChild(li);
  }

  onMount(() => {
    if (pageTypeIsSupported()) {
      placeLoadButton();
    }
  });
</script>

{#if pageTypeIsSupported() && $enabled}
  <App />
{/if}
