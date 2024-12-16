import { Path, PathValue } from "../types";

export function deepGet<T, K extends Path<T>>(
  obj: T,
  path_key: K
): PathValue<T, K> {
  const path_parts = path_key.split(".");
  let obj_part: any = obj;
  for (let i = 0; i < path_parts.length; i++) {
    if (obj_part === undefined) {
      break;
    }
    if (obj_part === null) {
      break;
    }
    if (Array.isArray(obj_part) && Number.isNaN(Number(path_parts[i]))) {
      obj_part = obj_part.map((p) => p[path_parts[i]]);
    } else {
      obj_part = obj_part[path_parts[i]];
    }
  }
  return obj_part as PathValue<T, K>;
}

export function deepSet<T, K extends Path<T>, V = PathValue<T, K>>(
  obj: T,
  path_key: K,
  value: V
): T {
  const return_object: T = obj;

  const path_parts = path_key.split(".");

  let path_part_obj: any = obj;
  if (path_part_obj === undefined) {
    path_part_obj = {};
  }

  for (const pathPart of path_parts.slice(0, path_parts.length - 1)) {
    const part = path_part_obj?.[pathPart];
    if (part === undefined) {
      path_part_obj[pathPart] = {};
      path_part_obj = path_part_obj[pathPart];
      continue;
    }

    if (part === null) {
      path_part_obj[pathPart] = {};
      path_part_obj = path_part_obj[pathPart];
      continue;
    }

    path_part_obj = part;
  }

  path_part_obj[path_parts[path_parts.length - 1]] = value;

  return return_object;
}

export function deepPush<
  T,
  PathKey extends Path<T>,
  PathValueType extends PathValue<T, PathKey> extends Array<
    infer ArrayValueType
  >
    ? ArrayValueType
    : never
>(obj: T, path_key: PathKey, value: PathValueType): T {
  const return_object: T = obj;

  const path_parts = path_key.split(".");

  let path_part_obj: any = obj;
  if (path_part_obj === undefined) {
    path_part_obj = {};
  }

  for (const pathPart of path_parts.slice(0, path_parts.length - 1)) {
    const part = path_part_obj?.[pathPart];
    if (part === undefined) {
      path_part_obj[pathPart] = {};
      path_part_obj = path_part_obj[pathPart];
      continue;
    }

    if (part === null) {
      path_part_obj[pathPart] = {};
      path_part_obj = path_part_obj[pathPart];
      continue;
    }

    path_part_obj = part;
  }

  const last_path_part = path_parts[path_parts.length - 1];
  if (Array.isArray(path_part_obj[last_path_part]) === false) {
    path_part_obj[last_path_part] = [value];
  } else {
    path_part_obj[last_path_part].push(value);
  }

  return return_object;
}
