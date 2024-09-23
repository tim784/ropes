<script lang="ts">
  import * as Select from '$components/ui/select';
  import Input from '$components/ui/input/input.svelte';
  import { type SearchDataStore } from '$stores/page';
  import { SIZE_MID_NAME, SIZE_RANGE_NAME, SIZE_UNIT_NAME, type Option } from '$gather/searchForm';
  import { makeAppIdentifier } from '$lib/constants';
  import { getContext } from 'svelte';
  import { Switch } from '$components/ui/switch';
  import { z } from 'zod';
  import { formatNumber } from '$lib/util';
  import type { Selected } from 'bits-ui';

  export let midValue: string;
  export let rangeValue: string;
  export let unitValue: string;

  const searchDataStore = getContext<SearchDataStore>('searchDataStore');

  // const defaultUnitValue = 'gb';

  const sizeUnits: Option[] = $searchDataStore.searchForm.sizeUnits;
  const labelsByValue: Map<string, string> = new Map(sizeUnits.map((su) => [su.value, su.label]));

  const enabledId = makeAppIdentifier('size-limit-enabled');
  const sizeLimitLabelId = makeAppIdentifier('size-limit-label');

  const midInputId = makeAppIdentifier('size-mid-input');
  const rangeInputId = makeAppIdentifier('size-range-input');
  const unitSelectId = makeAppIdentifier('size-unit-select');

  let minMaxSize: [number, number] | null = null;
  let errorMessage: string | null = null;
  let enabled = ![null, ''].includes(midValue);

  $: selectedUnit = {
    value: unitValue,
    label: labelsByValue.get(unitValue) ?? 'Unknown'
  };

  function onSelectedUnitChange(selected: Selected<string> | undefined) {
    unitValue = selected?.value ?? '';
  }

  const numberValueSchema = z
    .string()
    .regex(/^\d+(\.\d+)?$/)
    .transform((value) => {
      const parsed = z.coerce.number().nonnegative().finite().safe().safeParse(value);
      return parsed.success ? parsed.data : z.NEVER;
    });

  type NumberValue = z.infer<typeof numberValueSchema>;
  type ParseResult =
    | { success: true; mid: NumberValue; range: NumberValue }
    | { success: false; message: string };

  function parseMidAndRange(midValue: string | null, rangeValue: string | null): ParseResult {
    const mid = numberValueSchema.safeParse(midValue);
    if (!mid.success) {
      return {
        success: false,
        message: 'Midpoint must be a nonnegative number'
      };
    }

    const range = numberValueSchema.safeParse(rangeValue);
    if (!range.success) {
      return {
        success: false,
        message: 'Range must be a nonnegative number'
      };
    }

    return {
      success: true,
      mid: mid.data,
      range: range.data
    };
  }

  function minMaxFromRange(mid: number, range: number): [number, number] {
    return [Math.max(0, mid - range), mid + range];
  }

  function setInfo(midValue: string | null, rangeValue: string | null) {
    const parsed = parseMidAndRange(midValue, rangeValue);

    if (!parsed.success) {
      errorMessage = parsed.message;
      minMaxSize = null;
      return;
    } else {
      errorMessage = null;
      minMaxSize = minMaxFromRange(parsed.mid, parsed.range);
    }
  }

  $: setInfo(midValue, rangeValue);
</script>

<div class="grid grid-cols-2 items-baseline justify-between gap-2">
  <label class="mb-2 block text-xl font-bold" for={enabledId} id={sizeLimitLabelId}
    >Size Limit</label
  >

  <Switch
    id={enabledId}
    class="justify-self-end"
    bind:checked={enabled}
    onCheckedChange={(checked) => {
      if (!checked) {
        midValue = '';
        rangeValue = '';
      }
    }}
    aria-labelledby={sizeLimitLabelId}
  />

  {#if enabled}
    <div class="col-span-2 grid grid-cols-3 gap-2">
      <label for={midInputId}>Midpoint</label>
      <label for={rangeInputId}>Range &plusmn;</label>
      <label for={unitSelectId}>Unit</label>

      <Input name={SIZE_MID_NAME} id={midInputId} bind:value={midValue} autocomplete="off" />

      <Input name={SIZE_RANGE_NAME} id={rangeInputId} bind:value={rangeValue} autocomplete="off" />

      <Select.Root
        bind:selected={selectedUnit}
        onSelectedChange={onSelectedUnitChange}
        name={SIZE_UNIT_NAME}
      >
        <Select.Trigger id={unitSelectId}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          {#each sizeUnits as { value, label } (value)}
            <Select.Item {value} {label} />
          {/each}
        </Select.Content>
        <Select.Input />
      </Select.Root>
    </div>

    <div class="col-span-2 text-sm">
      {#if errorMessage}
        <p class="text-error">{errorMessage}</p>
      {/if}
      {#if minMaxSize}
        <p class="text-muted-foreground">
          Size of at least {formatNumber(minMaxSize[0])}
          {selectedUnit.label} and at most {formatNumber(minMaxSize[1])}
          {selectedUnit.label}
        </p>
      {/if}
    </div>
  {/if}
</div>
