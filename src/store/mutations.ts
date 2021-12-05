import { GetDataQueryType } from "@/graphql/api";
import { IState } from "./state";

export enum MutationTypes {
  SET_LOAD = "setLoad",
  SET_DATA = "setData",
  SET_FILTER_ENABLE = "setFilterEnable",
  SET_FILTER_VALUE = "setFilterValue",
  SET_POLICIES = "setPolicies",
  SET_NODES_STATUS = "setNodesStatus",
}

interface ISetNodeFilter {
  key1: keyof IState["filters"];
  key2: any;
  value: any;
}

export default {
  setLoad(state: IState, payload: boolean) {
    state.loading = payload;
  },
  setData(state: IState, payload: GetDataQueryType) {
    state.data = payload;
  },
  setPolicies(state: IState, payload: any) {
    state.policies = payload;
  },
  setFilterEnable(state: IState, { key1, key2, value }: ISetNodeFilter) {
    (state.filters[key1] as any)[key2].enabled = value;
  },
  setFilterValue(state: IState, { key1, key2, value }: ISetNodeFilter) {
    (state.filters[key1] as any)[key2].value = value;
  },
  setNodesStatus(state: IState, payload: { [key: number]: boolean }) {
    state.nodes_status = payload;
  },
};
