import { GetDataQueryType } from "@/graphql/api";
import { applyFilters, nodeIdFilter, rangeFilter } from "@/utils/filters";
import { GetterTree } from "vuex";
import { IState } from "./state";

type ExtractKeyOf<T, K extends keyof T> = T[K] extends Array<infer Q> ? keyof Q : T[K]; // prettier-ignore
type ExtractValue<T, K extends keyof T> = T[K] extends Array<infer Q> ? Q : T[K]; // prettier-ignore

function findById<T = GetDataQueryType, K extends keyof T = keyof T, R extends ExtractKeyOf<T, K> = T[K] extends (infer Q)[] ? keyof Q : T[K]>(key1: K, key2: R): (state: IState) => (id?: string) => ExtractValue<T, K> | null; // prettier-ignore
function findById(key1: any, key2: any) {
  return (state: IState) => {
    return (id?: string) => {
      if (id === undefined || id === null) return null;

      const items = fallbackDataExtractor(key1, state);
      return items.find((item: any) => item[key2] == id);
    };
  };
}

export function fallbackDataExtractor<T = GetDataQueryType, K extends keyof T = keyof T>(key: K): (state: IState) => T[K]; // prettier-ignore
export function fallbackDataExtractor<T = GetDataQueryType, K extends keyof T = keyof T>(key: K, state: IState): T[K]; // prettier-ignore
export function fallbackDataExtractor(key: any, state?: any) {
  if (state) return state.data?.[key] ?? [];
  return (state: any) => state.data?.[key] ?? [];
}

export default {
  loading: (state) => state.loading,
  nodes: fallbackDataExtractor("nodes"),
  farms: fallbackDataExtractor("farms"),
  locations: fallbackDataExtractor("locations"),
  twins: fallbackDataExtractor("twins"),
  countries: fallbackDataExtractor("countries"),
  publicConfigs: fallbackDataExtractor("publicConfigs"),
  cities: fallbackDataExtractor("cities"),

  /* Getters By Id */
  node: findById("nodes", "nodeId"),
  farm: findById("farms", "farmId"),
  location: findById("locations", "id"),
  twin: findById("twins", "twinId"),
  country: findById("countries", "id"),
  publicConfig: findById("publicConfigs", "id"),
  city: findById("cities", "id"),

  /* filters helpers */
  getFilter: (state) => {
    return (key1: string, key2: string) => {
      return (state.filters as any)[key1][key2];
    };
  },
  nodes_id: (state) => {
    const nodes = fallbackDataExtractor("nodes", state);
    return nodes.map(({ nodeId }) => nodeId);
  },
  node_filters(state) {
    return (filter: keyof IState["filters"]["nodes"]) => {
      return state.filters.nodes[filter];
    };
  },

  /* filtered values */
  filtered_nodes: applyFilters(
    fallbackDataExtractor("nodes"),
    (state) => state.filters.nodes,
    nodeIdFilter,
    rangeFilter("hru"),
    rangeFilter("mru"),
    rangeFilter("sru"),
    rangeFilter("cru")
  ),
} as GetterTree<IState, IState>;
