import { PathValue, ObjectWithStringKeys } from "../types";
import { SortWeights } from "./sort";
import { validSortPropertyDeepKey } from "./sortByDeepProp";


export type MultiSortOption<
  T extends ObjectWithStringKeys,
  K extends validSortPropertyDeepKey<T> = validSortPropertyDeepKey<T>
> = {
  key: K;
  direction: "AZ" | "ZA";
  weights?: SortWeights<PathValue<T, K>>;
  emptyValues?: "start" | "end";
};
