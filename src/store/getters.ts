import { GetDataQueryType, INode } from "@/graphql/api";
import { IState } from "./state";

function findById(items: any[] = [], key: string) {
  return (id?: string) => {
    return id ? items.find((item) => item[key] === id) : null;
  };
}

// prettier-ignore
function fallbackExtractor<T>(key: keyof GetDataQueryType): (state: IState) => T[];
function fallbackExtractor<T>(key: keyof GetDataQueryType, state: IState): T[];
function fallbackExtractor(key: keyof GetDataQueryType, state?: any) {
  if (state) return state.data?.[key] ?? [];
  return (state: IState) => state.data?.[key] ?? [];
}

export default {
  loading: (state: IState) => state.loading,
  nodes(state: IState) {
    let nodes = state.data?.nodes ?? [];

    /**
     * @todo Add filters here
     */
    // test ids filter
    const ids = state.node_filters.ids;
    if (ids.length) {
      nodes = nodes.filter(({ nodeId }) => ids.includes(nodeId.toString()));
    }

    return nodes;
  },
  farms(state: IState) {
    /**
     * @todo Add filters here
     */
    return state.data?.farms ?? [];
  },
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

  /* filters */
  nodes_id: (state: IState) => {
    const nodes = fallbackExtractor<INode>("nodes", state);
    return nodes.map(({ nodeId }) => nodeId.toString());
  },
  node_filters(state: IState) {
    return (filter: keyof typeof state["node_filters"]) => {
      return state.node_filters[filter];
    };
  },
};
