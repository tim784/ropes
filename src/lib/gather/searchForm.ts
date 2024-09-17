import { querySelector, querySelectorAll } from './util';

type SearchFormElement = HTMLFormElement;

export type SearchForm = {
  sortCriteria: Option[];
  sortOrders: Option[];
  sizeTypes: Option[];
  onlyFreeleech: Checkbox;
  limitToOneHundred: Checkbox;
  categories: Checkbox[];
  taglistValue: string;
};

export type Option = {
  value: string;
  label: string;
};

export type Checkbox = {
  label: string;
  value: string;
  name: string;
};

export const SORT_CRITERIA_NAME = 'order_by';
export const SORT_ORDER_NAME = 'order_way';
export const SIZE_MID_NAME = 'sizeall';
export const SIZE_UNIT_NAME = 'sizetype';
export const SIZE_RANGE_NAME = 'sizerange';
export const TAGLIST_NAME = 'taglist';
export const ONLY_FREELEECH_NAME = 'filter_freeleech';
export const LIMIT_TO_ONE_HUNDRED_NAME = 'limit_matches';

export const CATEGORY_TABLE_ID = 'cat_list';

// filtered (for now)
export const TITLE_AND_DESCRIPTION_TERMS_NAME = 'searchtext';
export const TITLE_TERMS_NAME = 'title';
export const SET_DEFAULT_NAME = 'setdefault';
export const CLEAR_DEFAULT_NAME = 'cleardefault';
export const FILTER_CATEGORY_NAME_PREFIX = 'filter_cat';

function getSeachForm(doc: Document) {
  return querySelector('#search_form', doc) as SearchFormElement;
}

function getSelectOptions(searchForm: SearchFormElement, selectName: string): Option[] {
  return querySelectorAll(`select[name="${selectName}"] option`, searchForm).map((option) => {
    return {
      value: (option as HTMLOptionElement).value,
      label: (option as HTMLOptionElement).textContent!.trim()
    };
  });
}

function getCheckbox(searchForm: SearchFormElement, inputName: string): Checkbox {
  // emp fortunately always attaches labels to checkboxes, so we can use that to
  // get the checkbox name
  const input = querySelector(`input[name="${inputName}"]`, searchForm) as HTMLInputElement;
  const name = input.name;
  const value = input.value;

  // find label
  const labelElement = querySelector(`label[for="${input.id}"]`, searchForm) as HTMLLabelElement;
  const labelName = labelElement.textContent!.trim();

  return {
    label: labelName,
    value,
    name
  };
}

function getCategoryCheckboxes(searchForm: SearchFormElement): Checkbox[] {
  const checkboxes = querySelectorAll(
    `#${CATEGORY_TABLE_ID} input[type="checkbox"]`,
    searchForm
  ) as HTMLInputElement[];
  return checkboxes.map((checkbox) => {
    const name = checkbox.name;
    const value = checkbox.value;

    // find label
    const labelElement = querySelector(
      `label[for="${checkbox.id}"]`,
      searchForm
    ) as HTMLLabelElement;
    const label = labelElement.textContent!.trim();

    return {
      label,
      value,
      name
    };
  });
}

function getTaglistValue(searchForm: SearchFormElement): string {
  const taglist = querySelector(
    `textarea[name="${TAGLIST_NAME}"]`,
    searchForm
  ) as HTMLTextAreaElement | null;
  return taglist?.value ?? '';
}

export function getSearchForm(doc: Document): SearchForm {
  const searchForm = getSeachForm(doc);

  return {
    sortCriteria: getSelectOptions(searchForm, SORT_CRITERIA_NAME),
    sortOrders: getSelectOptions(searchForm, SORT_ORDER_NAME),
    sizeTypes: getSelectOptions(searchForm, SIZE_UNIT_NAME),
    onlyFreeleech: getCheckbox(searchForm, ONLY_FREELEECH_NAME),
    limitToOneHundred: getCheckbox(searchForm, LIMIT_TO_ONE_HUNDRED_NAME),
    categories: getCategoryCheckboxes(searchForm),
    taglistValue: getTaglistValue(searchForm)
  };
}
