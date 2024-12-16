import { ObjectWithStringKeys } from "./index";

export type ObjectKeysWithValueOfType<
  Obj extends ObjectWithStringKeys,
  Types = string,
> = {
  [K in keyof Obj]: Obj[K] extends Types ? K : never;
}[keyof Obj];
