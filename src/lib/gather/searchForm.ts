import { querySelector, querySelectorAll, removeNonNumericChars } from './util';

type SearchFormElement = HTMLFormElement;

export type SearchForm = {
  sortCriteria: Option[];
  sortOrders: Option[];
  sizeTypes: Option[];
  onlyFreeleech: Checkbox;
  limitToOneHundred: Checkbox;
  categories: Checkbox[];
  // formData: FormData;
};

export function defaultSearch(): SearchForm {
  return {
    sortCriteria: [],
    sortOrders: [],
    sizeTypes: [],
    onlyFreeleech: {
      label: '',
      value: '',
      name: ''
    },
    limitToOneHundred: {
      label: '',
      value: '',
      name: ''
    },
    categories: [],
    // formData: new FormData()
  };
}

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

function getFilteredFormData(url: string, doc: Document): FormData {
  const formData = new FormData();
  for (const [key, value] of new URL(url).searchParams.entries()) {
    formData.set(key, value);
  }

  // taglist is wierd: if its not in the url, it's the "default", which will be
  // in the document. this kinda sucks because if the user changes the taglist
  // value before ropes is loaded, then we'll think _that's_ the default, and
  // not the actual default. but we can't really do anything about that, and its
  // of little consequence.
  if (!formData.has(TAGLIST_NAME)) {
    const taglist = querySelector(`textarea[name="${TAGLIST_NAME}"]`, doc) as HTMLTextAreaElement;
    if (taglist) {
      formData.set(TAGLIST_NAME, taglist.value);
    }
  }

  // remove things we don't support/persist
  formData.delete(ONLY_FREELEECH_NAME);
  formData.delete(LIMIT_TO_ONE_HUNDRED_NAME);
  formData.delete(TITLE_AND_DESCRIPTION_TERMS_NAME);
  formData.delete(TITLE_TERMS_NAME);
  formData.delete(SET_DEFAULT_NAME);
  formData.delete(CLEAR_DEFAULT_NAME);

  // remove all category filters
  for (const key of formData.keys()) {
    if (key.startsWith(FILTER_CATEGORY_NAME_PREFIX)) {
      formData.delete(key);
    }
  }

  return formData;
}

export function getSearchForm(doc: Document): SearchForm {
  const searchForm = getSeachForm(doc);
  // const formData = getFilteredFormData(url, doc);

  return {
    sortCriteria: getSelectOptions(searchForm, SORT_CRITERIA_NAME),
    sortOrders: getSelectOptions(searchForm, SORT_ORDER_NAME),
    sizeTypes: getSelectOptions(searchForm, SIZE_UNIT_NAME),
    onlyFreeleech: getCheckbox(searchForm, ONLY_FREELEECH_NAME),
    limitToOneHundred: getCheckbox(searchForm, LIMIT_TO_ONE_HUNDRED_NAME),
    categories: getCategoryCheckboxes(searchForm),
    // formData
  };
}
