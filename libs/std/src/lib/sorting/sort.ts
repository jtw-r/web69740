export type SortWeights<T> = T extends string | number
  ? Record<T, number>
  : never;

export function sort<T>(
  direction: "AZ" | "ZA",
  a_field: T,
  b_field: T,
  weights?: SortWeights<T>,
  emptyValues?: "start" | "end"
) {
  switch (direction) {
    case "AZ": {
      if (!a_field) {
        if (emptyValues === "start") {
          return -1;
        } else if (emptyValues === "end") {
          return 1;
        } else {
          return -1;
        }
      } else if (!b_field) {
        if (emptyValues === "start") {
          return 1;
        } else if (emptyValues === "end") {
          return -1;
        } else {
          return 1;
        }
      }

      const a = !weights ? a_field : weights[a_field];
      const b = !weights ? b_field : weights[b_field];

      if (a === b) {
        return 0;
      } else if (a > b) {
        return 1;
      } else return -1;
    }
    case "ZA": {
      if (!a_field) {
        if (emptyValues === "start") {
          return -1;
        } else if (emptyValues === "end") {
          return 1;
        } else {
          return -1;
        }
      } else if (!b_field) {
        if (emptyValues === "start") {
          return 1;
        } else if (emptyValues === "end") {
          return -1;
        } else {
          return -1;
        }
      }

      const a = !weights ? a_field : weights[a_field];
      const b = !weights ? b_field : weights[b_field];

      if (a === b) {
        return 0;
      } else if (a > b) {
        return -1;
      } else return 1;
    }
  }
}

export function sortAZ<T>(a: T, b: T) {
  return sort("AZ", a, b);
}

export function sortZA<T>(a: T, b: T) {
  return sort("ZA", a, b);
}

export function sortByDir<T>(direction: "AZ" | "ZA") {
  return (a: T, b: T) => sort(direction, a, b);
}

export function sortByCombined<T, S>(
  key: (item: T) => S,
  direction: "AZ" | "ZA"
) {
  return (a: T, b: T) => sort(direction, key(a), key(b));
}

export function sortByCombinedAZ<T, S>(key: (item: T) => S) {
  return sortByCombined(key, "AZ");
}

export function sortByCombinedZA<T, S>(key: (item: T) => S) {
  return sortByCombined(key, "ZA");
}
