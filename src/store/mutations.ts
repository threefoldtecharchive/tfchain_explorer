import { GetDataQueryType } from "@/graphql/api";
import { IState } from "./state";

export enum MutationTypes {
  SET_LOAD = "setLoad",
  SET_DATA = "setData",
  SET_NODE_FILTER = "setNodeFilter",
  UPDATE_NODE_FILTER = "updateNodeFilter",
}

interface ISetNodeFilter {
  key: keyof IState["filters"]["nodes"];
  value: any;
}

export default {
  setLoad(state: IState, payload: boolean) {
    state.loading = payload;
  },
  setData(state: IState, payload: GetDataQueryType) {
    state.data = payload;
  },
  setNodeFilter(state: IState, { key, value }: ISetNodeFilter) {
    state.filters.nodes[key] = value;
  },
  updateNodeFilter(state: IState, { key, value }: ISetNodeFilter) {
    const filters = state.filters.nodes[key];
    const idx = filters.indexOf(value.toString());
    if (idx > -1) {
      filters.splice(idx, 1);
    }
  },
};
