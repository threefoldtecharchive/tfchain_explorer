import { IState } from "@/store/state";

export function applyFilters<T, R>(
  items: (state: IState) => T[],
  filters: (state: IState) => R,
  ...fns: Array<(filters: R, items: T[]) => T[]>
): (state: IState) => T[] {
  return (state) => {
    const f = filters(state);
    return fns.reduce((res, fn) => fn(f, res), items(state));
  };
}

export function nodeIdFilter<T extends { nodeId: number | string }>(
  filters: { ids: string[] },
  items: T[]
): T[] {
  const ids = filters.ids;
  if (!ids.length) return items;
  return items.filter(({ nodeId }) => ids.some((i) => i == nodeId));
}

export function rangeFilter(key: string) {
  return function<T>(
    filters: { [key: string]: { min: number; max: number } | any },
    items: T[]
  ): T[] {
    const { min, max } = filters[key];
    return items.filter((i) => {
      const v: number = (i as any)[key];
      return v >= min && v <= max;
    });
  };
}
