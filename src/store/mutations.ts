import { GetDataQueryType } from "@/graphql/api";
import { IState } from "./state";

export enum MutationTypes {
  SET_LOAD = "setLoad",
  SET_DATA = "setData",
  SET_FILTER = "setFilter",
  UPDATE_FILTER = "updateFilter",
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
    state.data = {
      ...payload,
      nodes: [
        // prefect now with all data exists
        {
          id: "Cm5oZCe6F0xx",
          createdAt: "2021-08-16T09:18:18.286Z",
          createdById: "tJ1h3JACSM",
          updatedAt: "2021-08-16T09:18:18.286Z",
          updatedById: undefined,
          deletedAt: undefined,
          deletedById: undefined,
          version: 1,
          gridVersion: 1,
          nodeId: 1.5,
          farmId: 1,
          twinId: 5,
          locationId: "1_OJR0vcJy",
          countryId: 0,
          cityId: 1,
          hru: "9001778946048",
          sru: "512110190592",
          cru: "24",
          mru: "202875785216",
          publicConfigId: "RFB_pvhBaA",
          uptime: 0,
          created: 1628862798,
          farmingPolicyId: 2,
        },
        ...payload.nodes,
      ],
    };
  },
  setFilter(state: IState, { key1, key2, value }: ISetNodeFilter) {
    (state.filters[key1] as any)[key2] = value;
  },
};
