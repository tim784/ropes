import { writable } from 'svelte/store';

/**
 * Create a store backed by localStorage. The store will be initialized with the
 * value from localStorage, or the default value if no value is present in
 * localStorage. The store will also update localStorage whenever the value is
 * updated.
 *
 * The `serialize` and `deserialize` functions are used to convert the value to
 * and from a string for storage in localStorage. If these functions throw, the
 * default value will be used instead.
 *
 * @param key The key to use for storing the value in localStorage.
 *
 * @param defaultValue A function that returns the default value for the store.
 * Will be used to set the store initially and if deserialization fails.
 *
 * @param serialize Converts a value to a string for storage in localStorage.
 *
 * @param deserialize Converts a string from localStorage to a value.
 *
 * @returns A writable store.
 */
export function localStorageBacked<T>(
  key: string,
  defaultValue: () => T,
  serialize: (value: T) => string,
  deserialize: (value: string) => T
) {
  function safeDeserialize(value: string): T {
    try {
      return deserialize(value);
    } catch (e) {
      console.error(`Error deserializing value "${value}" for key "${key}" from localStorage:`, e);
      return defaultValue();
    }
  }

  let item;
  try {
    item = localStorage.getItem(key);
  } catch (e) {
    console.error(`Error getting item "${key}" from localStorage:`, e);
  }
  const initialValue = item ? safeDeserialize(item) : defaultValue();

  // Listen for changes to the value in localStorage _from other tabs_
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === key && event.storageArea === localStorage) {
      set(event.newValue !== null ? safeDeserialize(event.newValue) : defaultValue());
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  const { subscribe, set, update } = writable<T>(initialValue);

  subscribe((value) => {
    let serialized;
    try {
      serialized = serialize(value);
    } catch (e) {
      console.error(`Error serializing value "${value}" for key "${key}" to localStorage:`, e);
      return;
    }
    try {
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.error(`Error setting item "${key}" in localStorage to:`, serialized, e);
    }
  });

  return {
    subscribe,
    set,
    update
  };
}
