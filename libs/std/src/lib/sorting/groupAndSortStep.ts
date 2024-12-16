import { removeArrayDuplicates } from "../arrays";
import { deepGet } from "../deep";
import { ObjectWithStringKeys, PathValue } from "../types";
import { MultiSortOption } from "./multiSort";
import { sort } from "./sort";
import { validSortPropertyDeepKey } from "./sortByDeepProp";

export const undef_symbol = Symbol("groupAndSortStep_undef");

/**
 * For some reason, this function keeps crashing webstorm's typescript server. I think its due to the `deep` type
 * @param arr
 * @param sorts
 */
export function groupAndSortStep<Arr extends ObjectWithStringKeys>(
  arr: Arr[],
  sorts: MultiSortOption<Arr>[],
  currentIndex: number
) {
  type GroupKey = PathValue<Arr, validSortPropertyDeepKey<Arr>> | Symbol;

  const groups = new Map<GroupKey, Arr[]>();

  const parentKey = sorts[currentIndex - 1].key;
  const key = sorts[currentIndex].key;

  let uniqueParentKeysInOrder: GroupKey[] = [];

  for (const element of arr) {
    const parent_value = deepGet(element, parentKey);
    const existing = groups.get(parent_value ?? undef_symbol);

    if (existing) {
      groups.set(parent_value ?? undef_symbol, [...existing, element]);
    } else {
      groups.set(deepGet(element, parentKey) ?? undef_symbol, [element]);
    }

    uniqueParentKeysInOrder = removeArrayDuplicates([
      ...uniqueParentKeysInOrder,
      parent_value ?? undef_symbol,
    ]);
  }

  for (const [group, entries] of groups) {
    const sorted = entries.sort((a, b) =>
      sort(
        sorts[currentIndex].direction,
        deepGet(a, key),
        deepGet(b, key),
        sorts[currentIndex].weights,
        sorts[currentIndex].emptyValues
      )
    );

    if (currentIndex === sorts.length - 1) {
      groups.set(group, sorted);
      continue;
    }

    groups.set(group, groupAndSortStep(sorted, sorts, currentIndex + 1));
  }

  const fully_sorted: Arr[] = [];

  for (const uniqueParentKey of uniqueParentKeysInOrder) {
    const v = groups.get(uniqueParentKey) ?? [];
    fully_sorted.push(...v);
  }

  return fully_sorted;
}
