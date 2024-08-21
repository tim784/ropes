<!-- development color scheme testing -->
<script lang="ts">
  import { Input } from '$components/ui/input/index.js';
  import { toasts } from '$stores/toasts';
  import ErrorToast from './toasts/ErrorToast.svelte';
  import TextToast from './toasts/TextToast.svelte';
  import Button from '$components/ui/Button.svelte';
  import Link from '$components/ui/Link.svelte';
</script>

<div class="flex flex-wrap p-4 *:p-4">
  <div class="bg-primary text-primary-foreground">Primary</div>
  <div class="bg-secondary text-secondary-foreground">Secondary</div>
  <div class="bg-destructive text-destructive-foreground">Destructive</div>
  <div class="bg-muted text-muted-foreground">Muted</div>
  <div class="bg-accent text-accent-foreground">Accent</div>
  <div class="bg-popover text-popover-foreground">Popover</div>
  <div class="bg-card text-card-foreground">Card</div>
  <div class="bg-background text-foreground">Foreground on Background</div>
  <div class="border-2">bordered</div>
  <Input class="m-1 w-auto" placeholder="input" value="Input" />
  <div class="text-success">Success</div>
  <div class="text-warning">Warning</div>
  <div class="text-error">Error</div>
  <Button
    on:click={() => {
      toasts.add(TextToast, {
        text: 'hi buddy!'
      });
    }}>default</Button
  >
  <Button
    variant="destructive"
    on:click={() => {
      toasts.add(ErrorToast, {
        description: 'testing error toasts',
        error: new Error('Toast burnt')
      });
    }}>destructive</Button
  >
  <Button variant="outline">outline</Button>
  <Button variant="secondary">secondary</Button>
  <Button variant="ghost">ghost</Button>
  <Link href="https://example.com">https://example.com"</Link>
  <Link href="/torrents.php">/torrents.php</Link>
  <Link href="/torrents.php?id=123">/torrents.php?id=123</Link>
  <Link href="/torrents.php?action=advanced">/torrents.php?action=advanced</Link>
</div>
