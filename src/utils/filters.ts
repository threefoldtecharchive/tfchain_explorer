import { IState } from "@/store/state";
import { GetDataQueryType } from "@/graphql/api";
import { fallbackExtractor } from "@/store/getters";

export function applyFilter<T>(
  state: IState,
  key: keyof GetDataQueryType,
  ...fns: ((key: keyof IState["filters"], state: IState, data: T[]) => T[])[]
) {
  return fns.reduce(
    (res, fn) => fn((key as unknown) as any, state, res),
    fallbackExtractor<T>(key, state)
  );
}

export function nodeIdFilter(
  key: keyof IState["filters"],
  state: IState,
  nodes: { nodeId: number | string }[]
) {
  const ids = state.filters[key]["ids"];
  return ids.length
    ? nodes.filter(({ nodeId }) => ids.includes(nodeId.toString()))
    : nodes;
}
