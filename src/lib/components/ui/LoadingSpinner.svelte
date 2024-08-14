<script lang="ts">
  /**
   * A loading spinner with two animations:
   * - On initial load, spins really fast
   * - Then, perpetually spins at a slower pace
   *
   * Supplemented with animations in `app.css`
   *
   * Ripped from
   * https://bitbucket.org/atlassian/atlassian-frontend-mirror/annotate/master/design-system/spinner/src/spinner.tsx?at=master
   * (or https://atlassian.design/components/spinner/examples)
   */
  import { cn } from '$components/shadcn-utils.js';

  let className: string | undefined = undefined;
  export { className as class };
</script>

<span class={cn('loading-spinner-rotate inline-flex shrink-0', className)}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="loading-spinner-load-in"
    aria-label="Loading"
    role="img"
    transform-origin="center"
  >
    <!-- outer transparent-ish -->
    <circle cx="8" cy="8" r="7" opacity="0.25" />

    <!-- inner opaque -->
    <circle stroke-dasharray="60px" cx="8" cy="8" r="7" />
  </svg>
</span>
