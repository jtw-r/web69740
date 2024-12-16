import { deepGet } from "../deep";
import { ObjectWithStringKeys } from "../types";
import { groupAndSortStep } from "./groupAndSortStep";
import { MultiSortOption } from "./multiSort";
import { sort } from "./sort";

export function groupAndSortByProps<T extends ObjectWithStringKeys>(
  arr: T[],
  sorts: MultiSortOption<T>[]
): T[] {
  if (!arr || !Array.isArray(arr)) {
    return [];
  }

  const initial_layer = (arr ?? []).sort((a, b) => {
    return sort(
      sorts[0]?.direction,
      deepGet(a, sorts[0]?.key),
      deepGet(b, sorts[0]?.key),
      sorts[0]?.weights,
      sorts[0]?.emptyValues
    );
  });

  if (sorts.length === 1) {
    return initial_layer;
  }

  if (sorts.length === 1) {
    return initial_layer;
  }

  return groupAndSortStep(initial_layer, sorts, 1);
}
