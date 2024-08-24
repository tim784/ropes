<script lang="ts">
  import { cn } from '$src/lib/components/shadcn-utils.js';

  export let char = '•';
  let className: string | undefined = undefined;
  export { className as class };
</script>

<span class={cn('mx-1', className)}>{char}</span>
