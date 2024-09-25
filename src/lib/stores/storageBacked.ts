import { writable } from 'svelte/store';

/**
 * Create a store backed by a storage area, such as localStorage or
 * sessionsStorage. The store will be initialized with the value from the
 * storageArea, or the result of the `defaultValue` function if no value is
 * present in localStorage. Whenever the value in the storage area changes, subscribers
 * to this store will be called.
 *
 * The `serialize` and `deserialize` functions are used to convert the value to
 * and from a string for storage in localStorage. If the `serialize` function
 * throws, no value will be storage in the storage area. If the `deserialize`
 * function throws, the default value will be used instead.
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
export function storageBacked<T>(
  key: string,
  defaultValue: () => T,
  serialize: (value: T) => string,
  deserialize: (value: string) => T,
  storageArea: Storage = localStorage
) {
  const storageAreaName = storageArea === localStorage ? 'localStorage' : 'sessionStorage';

  function safeDeserialize(value: string): T {
    try {
      return deserialize(value);
    } catch (e) {
      console.error(`Error deserializing value "${value}" for key "${key}" from localStorage:`, e);
      return defaultValue();
    }
  }

  const initialItem = storageArea.getItem(key);
  const initialStoreValue = initialItem !== null ? safeDeserialize(initialItem) : defaultValue();

  // Listen for changes to the value in storagearea from _other places/tabs_
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === key && event.storageArea === storageArea) {
      set(event.newValue !== null ? safeDeserialize(event.newValue) : defaultValue());
    }
  };

  window.addEventListener('storage', handleStorageEvent);

  const { subscribe, set, update } = writable<T>(initialStoreValue);

  subscribe((value) => {
    let serialized;
    try {
      serialized = serialize(value);
    } catch (e) {
      console.error(`Error serializing value under key "${key}" for ${storageAreaName}`, value);
      throw new Error('Error serializing value', { cause: e });
    }
    try {
      storageArea.setItem(key, serialized);
    } catch (e) {
      console.error(`Error setting item under "${key}" for ${storageAreaName}`, serialized);
      throw new Error('Error setting item', { cause: e });
    }
  });

  return {
    subscribe,
    set,
    update
  };
}
