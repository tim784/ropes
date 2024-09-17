import { type TransitionConfig } from 'svelte/transition';
import { cubicInOut } from 'svelte/easing';
import { split_css_unit } from '$lib/util';

type Axis = 'x' | 'y';

/**
 * Wipe transition for an axis: on in, go from 0 to length; on out, vice versa.
 *
 * @param node Element to transition
 *
 * @param config Configuration object containing optional `delay`, `duration`, `easing`, and `axis`.
 *
 * @returns Transition configuration
 */
export function wipe(
  node: Element,
  {
    delay = 0,
    duration = 400,
    easing = cubicInOut,
    axis = 'x'
  }: { delay?: number; duration?: number; easing?: (t: number) => number; axis?: Axis } = {}
): TransitionConfig {
  const style = getComputedStyle(node);
  const [length, unit] = split_css_unit(axis === 'x' ? style.width : style.height);

  return {
    delay,
    duration,
    easing,
    css: (t) => `overflow: hidden; ${axis === 'x' ? 'width' : 'height'}: ${t * length}${unit};`
  };
}
