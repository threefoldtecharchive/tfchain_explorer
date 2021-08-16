import { IState } from "./state";

function _findById(items: any[] = [], key: string) {
  return (id?: string) => {
    return id ? items.find((item) => item[key] === id) : null;
  };
}

export default {
  loading: (state: IState) => state.loading,
  nodes(state: IState) {
    /**
     * @todo Add filters here
     */
    return state.data?.nodes ?? [];
  },
  farms(state: IState) {
    /**
     * @todo Add filters here
     */
    return state.data?.farms ?? [];
  },
  locations: (state: IState) => state.data?.locations ?? [],
  twins: (state: IState) => state.data?.twins ?? [],
  countries: (state: IState) => state.data?.countries ?? [],
  publicConfigs: (state: IState) => state.data?.publicConfigs ?? [],
  cities: (state: IState) => state.data?.cities ?? [],

  /* Getters By Id */
  node: (state: IState) => _findById(state.data?.nodes, "nodeId"),
  farm: (state: IState) => _findById(state.data?.farms, "farmId"),
  location: (state: IState) => _findById(state.data?.locations, "locationId"),
  twin: (state: IState) => _findById(state.data?.twins, "twinId"),
  country: (state: IState) => _findById(state.data?.countries, "countryId"),
  publicConfig: (state: IState) => _findById(state.data?.publicConfigs, "publicConfigId"), // prettier-ignore
  city: (state: IState) => _findById(state.data?.cities, "cityId"),
};
