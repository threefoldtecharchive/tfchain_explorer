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

export function nodeIdFilter<T extends { nodeId: number }>(
  filters: { ids: string[] },
  items: T[]
): T[] {
  const ids = filters.ids;
  if (!ids.length) return items;
  return items.filter(({ nodeId }) => ids.includes(nodeId.toString()));
}
