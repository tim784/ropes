import { appTitle, makeAppIdentifier, appId } from '$lib/constants';
import { isSupportedPageType } from '$lib/pageType';
import { enabled } from '$stores/enabled';
import App from '$components/App.svelte';

function placeLoadButton() {
  const enableButtonId = makeAppIdentifier('enable-button');

  if (document.getElementById(enableButtonId)) {
    return;
  }

  const ul = document.querySelector('#menu ul:last-of-type');
  const li = document.createElement('li');

  // we make an <a>, and not a <button>, so that the styling is consistent with
  // the other items in the menu
  const a = document.createElement('a');

  // needed because we have no href
  a.style.cursor = 'pointer';

  a.id = enableButtonId;
  a.textContent = `Load ${appTitle}`;
  a.addEventListener('click', () => enabled.set(true));
  li.appendChild(a);
  ul?.appendChild(li);
}

function createEntrypointDiv() {
  const entrypointDiv = document.createElement('div');
  entrypointDiv.id = appId;
  return document.body.appendChild(entrypointDiv);
}

if (isSupportedPageType()) {
  placeLoadButton();

  new App({
    target: createEntrypointDiv()
  });
}
