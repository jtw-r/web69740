import { PathsOfValue } from "../types";
import { ObjectWithStringKeys } from "../types/ObjectWithStringKeys";


export type ValidSortPropertyTypes =
  | string
  | number
  | Date
  | bigint
  | boolean
  | undefined
  | null;
export type validSortPropertyDeepKey<T extends ObjectWithStringKeys> =
  PathsOfValue<T, ValidSortPropertyTypes>;
