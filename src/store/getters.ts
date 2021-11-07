import { GetDataQueryType } from "@/graphql/api";
import {
  applyFilters,
  conditionFilter,
  inFilter,
  rangeFilter,
} from "@/utils/filters";
import { GetterTree } from "vuex";
import state, { IState } from "./state";
import toTeraOrGigaOrPeta from '../filters/toTeraOrGigaOrPeta'

type ExtractKeyOf<T, K extends keyof T> = T[K] extends Array<infer Q> ? keyof Q : T[K]; // prettier-ignore
type ExtractValue<T, K extends keyof T> = T[K] extends Array<infer Q> ? Q : T[K]; // prettier-ignore

/**
 * @param key1
 * @param key2
 *
 * @description
 * key1: it only accepts one of [GetDataQueryType] keys for example ('nodes' | 'farms' | etc...)
 * key2: When ever you choose a `key1` value it starts to accept the keys of  [GetDataQueryType[key1]]
 *       So let's say your choosen key1 was nodes => key2 should be (keyof INode)
 *
 * @example
 * findById('wrong value', 'any value') // Error!
 * findById('nodes', 'wrong value')     // Error!
 * findById('nodes', 'nodeId')          // Works!
 */
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
export function getTotalCPUs(state: IState) {
  const nodes: any | undefined = state.data?.nodes;
}

function isPrivateIP(ip: string) {
  const parts = ip.split('.');
  return parts[0] === '10' ||
    (parts[0] === '172' && (parseInt(parts[1], 10) >= 16 && parseInt(parts[1], 10) <= 31)) ||
    (parts[0] === '192' && parts[1] === '168');
}

function getAccessNodesCount(accessNodes: any[]) {
  let accessNodeCounter = 0;
  accessNodes.forEach((accessNode) => {
    if (accessNode.ipv4 && !isPrivateIP(accessNode.ipv4)) {
      accessNodeCounter += 1
    }
  });
  return accessNodeCounter
}
function getGatewaysCount(gateways: any[]) {
  let gatewaysCounter = 0;
  gateways.forEach((gateway) => {
    if (gateway.ipv4 && !isPrivateIP(gateway.ipv4) && gateway.domain) {
      gatewaysCounter += 1
    }
  });
  return gatewaysCounter
}

export interface IStatistics {
  id: number;
  data: number | string;
  title: string;
  icon: string;
}
export function getStatistics(state: IState): IStatistics[] {
  const nodes = fallbackDataExtractor("nodes")(state);
  const farms = fallbackDataExtractor('farms')(state);
  const countries = fallbackDataExtractor("countries")(state);
  const publicConfigs = fallbackDataExtractor("publicConfigs")(state);
  const twins = fallbackDataExtractor("twins")(state);
  const twinsNo = twins.length
  const accessNodes = getAccessNodesCount(publicConfigs)
  const gateways = getGatewaysCount(publicConfigs)
  const cru = nodes.reduce((total, next) => total + BigInt(next.cru ?? 0), BigInt(0)).toString();
  const hru = nodes.reduce((total, next) => total + BigInt(next.hru ?? 0), BigInt(0)).toString();
  const sru = nodes.reduce((total, next) => total + BigInt(next.sru ?? 0), BigInt(0)).toString();
  const mru = nodes.reduce((total, next) => total + BigInt(next.mru ?? 0), BigInt(0)).toString();
  return [
    { "id": 0, "data": nodes.length, "title": "Nodes", "icon": "mdi-laptop" },
    { "id": 1, "data": farms.length, "title": "Farms", "icon": "mdi-tractor" },
    { "id": 2, "data": countries.length, "title": "Countries", "icon": "mdi-earth" },
    { "id": 3, "data": cru, "title": "Total CPUs", "icon": "mdi-cpu-64-bit" },
    { "id": 4, "data": toTeraOrGigaOrPeta(sru), "title": "Total SSD", "icon": "mdi-nas" },
    { "id": 5, "data": toTeraOrGigaOrPeta(hru), "title": "Total HDD", "icon": "mdi-harddisk" },
    { "id": 6, "data": toTeraOrGigaOrPeta(mru), "title": "Total RAM", "icon": "mdi-memory" },
    { "id": 7, "data": accessNodes, "title": "Access Nodes", "icon": "mdi-gate" },
    { "id": 8, "data": gateways, "title": "Gateways", "icon": "mdi-boom-gate-outline" },
    { "id": 9, "data": twinsNo, "title": "Twins", "icon": "mdi-brain" },
  ]
}

export default {
  loading: (state) => state.loading,
  nodes: fallbackDataExtractor("nodes"),
  farms: fallbackDataExtractor("farms"),
  locations: fallbackDataExtractor("locations"),
  twins: fallbackDataExtractor("twins"),
  publicConfigs: fallbackDataExtractor("publicConfigs"),

  /* Getters By Id */
  node: findById("nodes", "nodeId"),
  farm: findById("farms", "farmId"),
  location: findById("locations", "id"),
  twin: findById("twins", "twinId"),
  publicConfig: findById("publicConfigs", "id"),

  /* filters helpers */
  getFilter: (state) => {
    return (key1: string, key2: string) => {
      return (state.filters as any)[key1][key2];
    };
  },

  /* filtered values */
  filtered_nodes: applyFilters(
    fallbackDataExtractor("nodes"),
    (state) => state.filters.nodes,
    inFilter("nodeId"),
    inFilter("createdById"),
    inFilter("farmId"),
    inFilter("twinId"),
    inFilter("country"),
    inFilter("farmingPolicyId"),
    rangeFilter("hru"),
    rangeFilter("mru"),
    rangeFilter("sru"),
    rangeFilter("cru"),
    conditionFilter("uptime")
  ),

  filtered_farm: applyFilters(
    fallbackDataExtractor("farms"),
    (state) => state.filters.farms,
    inFilter("createdById"),
    inFilter("farmId"),
    inFilter("twinId"),
    inFilter("certificationType"),
    inFilter("name")
  ),

  /* visual helpers */
  maxValueOf(state) {
    return (key: keyof GetDataQueryType, valueOf: string) => {
      const items: any[] = fallbackDataExtractor(key, state);
      const values = items.map((i: any) => +(i as any)[valueOf]) as any[];
      return Math.max(...values);
    };
  },
} as GetterTree<IState, IState>;
