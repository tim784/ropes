<script lang="ts">
  import { type Torrent, DoubleseedState, FreeleechState, InteractionState } from '$lib/torrent';
  import { Badge, type Size } from '$components/ui/badge';

  export let torrent: Torrent;
  export let hasSeen: boolean;
  export let isBookmarked: boolean;
  export let isPersonalFreeleech: boolean;
  export let isPersonalDoubleseed: boolean;

  $: freeleech = mapFreeleech(torrent, isPersonalFreeleech);
  $: doubleseed = mapDoubleseed(torrent, isPersonalDoubleseed);
  const interaction = mapInteraction(torrent);

  function mapFreeleech(torrent: Torrent, isPersonalFreeleech: boolean) {
    let freeleechState;

    // prioritize personal freeleech
    if (isPersonalFreeleech) {
      freeleechState = FreeleechState.Personal;
    } else {
      freeleechState = torrent.freeleechState;
    }
    switch (freeleechState) {
      case FreeleechState.Personal:
        return 'Personal Freeleech';
      case FreeleechState.Sitewide:
        return 'Sitewide Freeleech';
      case FreeleechState.Unlimited:
        return 'Unlimited Freeleech';
      default:
        return null;
    }
  }

  function mapDoubleseed(torrent: Torrent, isPersonalDoubleseed: boolean) {
    let doubleseedState;

    // prioritize personal doubleseed
    if (isPersonalDoubleseed) {
      doubleseedState = DoubleseedState.Personal;
    } else {
      doubleseedState = torrent.doubleseedState;
    }

    switch (doubleseedState) {
      case DoubleseedState.Personal:
        return 'Personal Doubleseed';
      case DoubleseedState.Sitewide:
        return 'Sitewide Doubleseed';
      default:
        return null;
    }
  }

  function mapInteraction(torrent: Torrent) {
    switch (torrent.interactionState) {
      case InteractionState.Seeding:
        return 'Seeding';
      case InteractionState.Snatched:
        return 'Snatched';
      case InteractionState.Leeching:
        return 'Leeching';
      case InteractionState.Grabbed:
        return 'Grabbed';
      default:
        return null;
    }
  }

  const badgeSize: Size = 'tight';
</script>

{#if freeleech || doubleseed || interaction || torrent.isWarned || hasSeen || isBookmarked}
  <ul class="flex flex-wrap items-center gap-x-2 gap-y-1">
    {#if torrent.isWarned}
      <li>
        <Badge variant="red" size={badgeSize}>Warned</Badge>
      </li>
    {/if}

    {#if freeleech}
      <li>
        <Badge variant="amber" size={badgeSize}>{freeleech}</Badge>
      </li>
    {/if}

    {#if doubleseed}
      <li>
        <Badge variant="emerald" size={badgeSize}>{doubleseed}</Badge>
      </li>
    {/if}

    {#if interaction}
      <li>
        <Badge variant="indigo" size={badgeSize}>{interaction}</Badge>
      </li>
    {:else if hasSeen}
      <li>
        <Badge variant="gray" size={badgeSize}>Seen</Badge>
      </li>
    {/if}

    {#if isBookmarked}
      <li>
        <Badge variant="sky" size={badgeSize}>Bookmarked</Badge>
      </li>
    {/if}
  </ul>
{/if}
