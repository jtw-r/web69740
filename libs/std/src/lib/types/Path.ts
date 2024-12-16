/**
 * Thank you react-hook-form
 * [https://github.com/react-hook-form/react-hook-form/blob/4f4eae58797af983660513f2eac0497a8beca8bb/src/types/path/eager.ts]
 *
 * This code has been pulled in to handle accessing deeply nested object properties, with type-checking / editor hints
 * Used in combination with `/libs/std/src/lib/deep/deep.ts`
 */

/**
 *
 */
export type Primitive =
  | null
  | undefined
  | string
  | number
  | boolean
  | symbol
  | bigint;

export type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;

/**
 * Helper function to break apart T1 and check if any are equal to T2
 *
 * See {@link IsEqual}
 */
type AnyIsEqual<T1, T2> = T1 extends T2
  ? IsEqual<T1, T2> extends true
    ? true
    : never
  : never;

/**
 * Helper type for recursively constructing paths through a type.
 * This actually constructs the strings and recurses into nested
 * object types.
 *
 * See {@link Path}
 */
type PathImpl<
  K extends string | number,
  V,
  TraversedTypes,
> = V extends Primitive
  ? `${K}`
  : // Check so that we don't recurse into the same type
  // by ensuring that the types are mutually assignable
  // mutually required to avoid false positives of subtypes
  true extends AnyIsEqual<TraversedTypes, V>
    ? `${K}`
    : `${K}` | `${K}.${PathInternal<V, TraversedTypes | V>}`;

export type IsTuple<T extends ReadonlyArray<any>> = number extends T["length"]
  ? false
  : true;

export type ArrayKey = number;

export type TupleKeys<T extends ReadonlyArray<any>> = Exclude<
  keyof T,
  keyof any[]
>;

/**
 * Helper type for recursively constructing paths through a type.
 * This obscures the internal type param TraversedTypes from exported contract.
 *
 * See {@link Path}
 */
type PathInternal<T, TraversedTypes = T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], TraversedTypes>;
      }[TupleKeys<T>]
      : PathImpl<ArrayKey, V, TraversedTypes> | PathInternal<V, TraversedTypes>
    : {
      [K in keyof T]-?: PathImpl<K & string, T[K], TraversedTypes>;
    }[keyof T];

/**
 * Type which eagerly collects all paths through a type
 * @typeParam T - type which should be introspected
 * @example
 * ```
 * Path<{foo: {bar: string}}> = 'foo' | 'foo.bar'
 * ```
 */
// We want to explode the union type and process each individually
// so assignable types don't leak onto the stack from the base.
export type Path<T> = PathInternal<T>;

export type IsAny<T> = 0 extends 1 & T ? true : false;

type ArrayPathImpl<
  K extends string | number,
  V,
  TraversedTypes,
> = V extends Primitive
  ? IsAny<V> extends true
    ? string
    : never
  : V extends ReadonlyArray<infer U>
    ? U extends Primitive
      ? IsAny<V> extends true
        ? string
        : never
      : // Check so that we don't recurse into the same type
      // by ensuring that the types are mutually assignable
      // mutually required to avoid false positives of subtypes
      true extends AnyIsEqual<TraversedTypes, V>
        ? never
        : `${K}` | `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`
    : true extends AnyIsEqual<TraversedTypes, V>
      ? never
      : `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`;

/**
 * Helper type for recursively constructing paths through a type.
 * This obscures the internal type param TraversedTypes from exported contract.
 *
 * See {@link ArrayPath}
 */
type ArrayPathInternal<T, TraversedTypes = T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
        [K in TupleKeys<T>]-?: ArrayPathImpl<
          K & string,
          T[K],
          TraversedTypes
        >;
      }[TupleKeys<T>]
      : ArrayPathImpl<ArrayKey, V, TraversedTypes>
    : {
      [K in keyof T]-?: ArrayPathImpl<K & string, T[K], TraversedTypes>;
    }[keyof T];

/**
 * Type which eagerly collects all paths through a type which point to an array
 * type.
 * @typeParam T - type which should be introspected.
 * @example
 * ```
 * Path<{foo: {bar: string[], baz: number[]}}> = 'foo.bar' | 'foo.baz'
 * ```
 */
// We want to explode the union type and process each individually
// so assignable types don't leak onto the stack from the base.
export type ArrayPath<T> = T extends any ? ArrayPathInternal<T> : never;

type A = Path<{ a: { b: string; c: string }[] }>;

/**
 * Type to evaluate the type which the given path points to.
 * @typeParam T - deeply nested type which is indexed by the path
 * @typeParam P - path into the deeply nested type
 * @example
 * ```
 * PathValue<{foo: {bar: string}}, 'foo.bar'> = string
 * PathValue<[number, string], '1'> = string
 * ```
 */
export type PathValue<T, P extends Path<T> | ArrayPath<T>> = T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? PathValue<T[K], R>
        : never
      : K extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? PathValue<V, R & Path<V>>
          : never
        : never
    : P extends keyof T
      ? T[P]
      : P extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? V
          : never
        : never
  : never;

export type GetFieldType<Obj, Path> =
  Path extends `${infer Left}.${infer Right}`
    ? Left extends keyof Obj
      ?
      | GetFieldType<Exclude<Obj[Left], undefined>, Right>
      | Extract<Obj[Left], undefined>
      : undefined
    : Path extends keyof Obj
      ? Obj[Path]
      : undefined;

export type PathOf<Obj, PathString> = SubPathOf<Obj, PathString, PathString>;

type SubPathOf<Obj, OriginalPath, PathPart> =
  PathPart extends `${infer Left}.${infer Right}`
    ? Left extends keyof Obj
      ?
      | SubPathOf<Exclude<Obj[Left], never>, OriginalPath, Right>
      | Extract<Obj[Left], never>
      : never
    : PathPart extends keyof Obj
      ? OriginalPath
      : never;

export type PathOfValue<Obj, PathStr extends Path<Obj>, Type> =
  PathValue<Obj, PathStr> extends Type ? PathStr : never;

export type PathsOfValue<Obj, Type> = {
  [Key in Path<Obj>]: PathValue<Obj, Key> extends Type ? Key : never;
}[Path<Obj>];
