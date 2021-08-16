import { GetDataQueryType } from "@/graphql/api";
import { applyFilters, nodeIdFilter } from "@/utils/filters";
import { GetterTree } from "vuex";
import { IState } from "./state";

function findById(items: any[] = [], key: string) {
  return (id?: string) => {
    return id ? items.find((item) => item[key] === id) : null;
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
  node: (state) => findById(state.data?.nodes, "nodeId"),
  farm: (state) => findById(state.data?.farms, "farmId"),
  location: (state) => findById(state.data?.locations, "locationId"),
  twin: (state) => findById(state.data?.twins, "twinId"),
  country: (state) => findById(state.data?.countries, "countryId"),
  publicConfig: (state) => findById(state.data?.publicConfigs, "publicConfigId"), // prettier-ignore
  city: (state) => findById(state.data?.cities, "cityId"),

  /* filters helpers */
  nodes_id: (state) => {
    const nodes = fallbackDataExtractor("nodes", state);
    return nodes.map(({ nodeId }) => nodeId.toString());
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
    nodeIdFilter
  ),
} as GetterTree<IState, IState>;
