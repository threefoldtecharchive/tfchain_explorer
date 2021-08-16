import { GetDataQueryType, INode } from "@/graphql/api";
import { applyFilter, nodeIdFilter } from "@/utils/filters";
import { IState } from "./state";

function findById(items: any[] = [], key: string) {
  return (id?: string) => {
    return id ? items.find((item) => item[key] === id) : null;
  };
}

export function fallbackExtractor<T>(key: keyof GetDataQueryType): (state: IState) => T[]; // prettier-ignore
export function fallbackExtractor<T>(key: keyof GetDataQueryType, state: IState): T[]; // prettier-ignore
export function fallbackExtractor(key: keyof GetDataQueryType, state?: any) {
  if (state) return state.data?.[key] ?? [];
  return (state: IState) => state.data?.[key] ?? [];
}

export default {
  loading: (state: IState) => state.loading,
  nodes: fallbackExtractor("nodes"),
  farms: fallbackExtractor("farms"),
  locations: fallbackExtractor("locations"),
  twins: fallbackExtractor("twins"),
  countries: fallbackExtractor("countries"),
  publicConfigs: fallbackExtractor("publicConfigs"),
  cities: fallbackExtractor("cities"),

  /* Getters By Id */
  node: (state: IState) => findById(state.data?.nodes, "nodeId"),
  farm: (state: IState) => findById(state.data?.farms, "farmId"),
  location: (state: IState) => findById(state.data?.locations, "locationId"),
  twin: (state: IState) => findById(state.data?.twins, "twinId"),
  country: (state: IState) => findById(state.data?.countries, "countryId"),
  publicConfig: (state: IState) => findById(state.data?.publicConfigs, "publicConfigId"), // prettier-ignore
  city: (state: IState) => findById(state.data?.cities, "cityId"),

  /* filters helpers */
  nodes_id: (state: IState) => {
    const nodes = fallbackExtractor<INode>("nodes", state);
    return nodes.map(({ nodeId }) => nodeId.toString());
  },
  node_filters(state: IState) {
    return (filter: keyof IState["filters"]["nodes"]) => {
      return state.filters.nodes[filter];
    };
  },

  /* filtered values */
  filtered_nodes: (state: IState) => {
    return applyFilter(
      state,
      "nodes",
      nodeIdFilter,
      nodeIdFilter,
      nodeIdFilter,
      nodeIdFilter,
      nodeIdFilter,
      nodeIdFilter
    );
  },
};
