<script lang="ts">
  import { unitLabels, unitValues, type Size, isUnitValue } from '$lib/size';
  import { makeAppIdentifier } from '$lib/constants';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$components/ui/select';
  import type { Selected } from 'bits-ui';
  import { z } from 'zod';

  export let label: string;
  export let initialSize: Size | undefined;
  export let size: Size | undefined;
  export let shown: boolean;

  const showCheckboxId = makeAppIdentifier(`show-${label}-checkbox`);
  const sizeSchema = z.object({
    value: z.string().min(1).pipe(z.coerce.number().nonnegative().safe()),
    unit: z.string().refine(isUnitValue, { message: 'invalid unit' })
  });
  const errorMap: z.ZodErrorMap = (error, ctx) => {
    return { message: 'Non-negative number required' };
  };

  let inputElement: HTMLInputElement | undefined;
  let error: string | null;

  let value: string | undefined = initialSize?.value.toString();
  let unit = initialSize?.unit ?? 'gb';
  let selectedUnit: Selected<string> = { value: unit, label: unitLabels[unit] };

  function react(
    value: string | undefined,
    unit: Selected<string> | undefined,
    shown: boolean
  ): Size | undefined {
    if (!shown) return undefined;
    const parsed = sizeSchema.safeParse({ value, unit: unit?.value }, { errorMap });
    if (parsed.success) {
      inputElement?.setCustomValidity('');
      error = null;
      return parsed.data;
    } else {
      error = parsed.error.flatten().fieldErrors.value?.join(', ') ?? 'unknown error';
      inputElement?.setCustomValidity(error);
      return undefined;
    }
  }

  $: size = react(value, selectedUnit, shown);
</script>

<div class="grid grid-flow-row gap-2">
  <div class="flex h-10 items-center gap-4">
    <Checkbox bind:checked={shown} id={showCheckboxId} />
    <label class="min-w-[4ch] text-lg" for={showCheckboxId}>{label}</label>
    {#if shown}
      <Input class="font-mono" required bind:value bind:el={inputElement} />
      <Select.Root bind:selected={selectedUnit}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {#each unitValues.filter((uv) => uv !== 'b') as unit}
            <Select.Item value={unit} label={unitLabels[unit]} />
          {/each}
        </Select.Content>
      </Select.Root>
    {/if}
  </div>
  {#if shown && error}
    <p class="text-error">{error}</p>
  {/if}
</div>
