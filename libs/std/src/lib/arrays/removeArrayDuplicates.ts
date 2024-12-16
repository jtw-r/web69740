import { ObjectKeysWithValueOfType, ObjectWithStringKeys } from "../index";

export function removeArrayDuplicates<T>(input: T[]) {
  const set = new Set(input);
  return [...set.values()].filter((v) => !!v);
}

export function removeArrayDuplicatesByKey<T extends ObjectWithStringKeys>(
  input: T[],
  key: ObjectKeysWithValueOfType<T, string>,
) {
  const map = new Map<string, T>();
  for (const arrayElement of input) {
    const id = arrayElement[key];
    map.set(id, arrayElement);
  }
  return [...map.values()];
}
