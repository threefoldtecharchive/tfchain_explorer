import { INode } from "./../graphql/api";
import { GetDataQueryType } from "@/graphql/api";
import { IState } from "./state";

export enum MutationTypes {
  SET_LOAD = "setLoad",
  SET_DATA = "setData",
  SET_FILTER_ENABLE = "setFilterEnable",
  SET_FILTER_VALUE = "setFilterValue",
  SET_POLICIES = "setPolicies",
  SET_NODES_STATUS = "setNodesStatus",
  SET_PRICING_POLICIES = "setPricingPolicies",
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
  setPricingPolicies(state: IState, payload: Map<number, string>) {
    state.pricingPolicies = payload;
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
  loadNodesData(state: IState, payload: any): void {
    payload.json().then((data: any) => {
      for (let i = 0; i < data.length; i++) {
        const node: INode = {
          id: data[i].id,
          created: data[i].created,
          createdAt: data[i].createdAt,
          createdById: "",
          version: data[i].version,
          gridVersion: data[i].gridVersion,
          nodeId: data[i].nodeId,
          farmId: data[i].farmId,
          twinId: data[i].twinId,
          hru: data[i].total_resources.hru,
          sru: data[i].total_resources.sru,
          cru: data[i].total_resources.cru,
          mru: data[i].total_resources.mru,
          farmingPolicyId: data[i].farmingPolicyId,
          location: data[i].location,
          publicConfig: data[i].publicConfig,
          status: data[i].status,
          certificationType: data[i].certificationType,
          interfaces: [
            {
              name: "",
              mac: "",
              ips: "",
              id: "",
            },
          ],
        };
        console.log({ node });
        /**
         * @todo fix the rest of table data
         */
        state.nodes.push(node);
      }
    });
  },
};
