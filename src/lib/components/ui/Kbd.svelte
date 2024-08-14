<script lang="ts">
  import { cn } from '$lib/components/shadcn-utils.js';

  export let keys: string[];

  let className: string | undefined | null = undefined;
  export { className as class };

  function keysForPlatform(keys: string[]): string[] {
    // navigator.platform is deprecated, but oh well. user agent isn't reliable.
    // best guess effort. this isn't super important.
    let platform = navigator.platform;
    let isMac = platform.includes('Mac');
    return keys.map((key) => {
      if (key === 'CmdOrCtrl') {
        return isMac ? 'Cmd' : 'Ctrl';
      }

      if (key === 'AltOrOption') {
        return isMac ? 'Option' : 'Alt';
      }

      return key;
    });
  }
  $: platformKeys = keysForPlatform(keys);
</script>

<div class={cn('inline-flex text-muted-foreground px-0.5', className)}>
  {#each platformKeys as key, index (key)}
    <span>
      <kbd
        class="inline-flex h-6 items-center gap-1 rounded-lg border border-border bg-background-darker px-1.5 font-mono font-bold"
        >{key}</kbd
      >
    </span>{#if index !== keys.length - 1}+{/if}
  {/each}
</div>
