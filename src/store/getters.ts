import { IState } from "./state";

function _findById(items: { id: string }[] = []) {
  return (id?: string) => {
    return id ? items.find((item) => item.id === id) : null;
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
  node: (state: IState) => _findById(state.data?.nodes),
  farm: (state: IState) => _findById(state.data?.farms),
  location: (state: IState) => _findById(state.data?.locations),
  twin: (state: IState) => _findById(state.data?.twins),
  country: (state: IState) => _findById(state.data?.countries),
  publicConfig: (state: IState) => _findById(state.data?.publicConfigs),
  city: (state: IState) => _findById(state.data?.cities),
};
