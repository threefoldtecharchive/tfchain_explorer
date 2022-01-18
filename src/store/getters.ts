import { GetDataQueryType, INode } from "@/graphql/api";
import {
  applyFilters,
  comparisonFilter,
  conditionFilter,
  inFilter,
  rangeFilter,
} from "@/utils/filters";
import { GetterTree } from "vuex";
import state, { IState } from "./state";
import toTeraOrGigaOrPeta from "../filters/toTeraOrGigaOrPeta";
import { byInternet } from "country-code-lookup";

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
  const parts = ip.split(".");
  return (
    parts[0] === "10" ||
    (parts[0] === "172" &&
      parseInt(parts[1], 10) >= 16 &&
      parseInt(parts[1], 10) <= 31) ||
    (parts[0] === "192" && parts[1] === "168")
  );
}

function getAccessNodesCount(nodes: INode[]) {
  return nodes.reduce((total, node) => {
    if (node.publicConfig?.ipv4 && !isPrivateIP(node.publicConfig.ipv4))
      total += 1;
    return total;
  }, 0);
}

function getGatewaysCount(nodes: INode[]) {
  return nodes.reduce((total, node) => {
    if (
      node.publicConfig?.ipv4 &&
      !isPrivateIP(node.publicConfig.ipv4) &&
      node.publicConfig.domain
    )
      total += 1;
    return total;
  }, 0);
}

export function getFarmPublicIPs(state: IState, farmId: number): [number,number,number] {
  const farm = (fallbackDataExtractor("farms")(state)).find(f => f.farmId === farmId);
  if (farm) {
    const freePublicIps = getFarmFreePublicIps(farm);
    const usedPublicIps = getFarmUsedPublicIps(farm);
    const totalPublicIps = farm.publicIPs.length;
    return [totalPublicIps, freePublicIps, usedPublicIps];
  }
  return [0,0,0];
}

export function getFarmFreePublicIps(farm: any): number {
  const freePublicIps = farm.publicIPs.filter((x: any) => x.contractId == 0);
    return freePublicIps.length
}
export function getFarmUsedPublicIps(farm: any): number {
  const freePublicIps = farm.publicIPs.filter((x: any) => x.contractId != 0);
    return freePublicIps.length
}
export interface IStatistics {
  id: number;
  data: number | string;
  title: string;
  icon: string;
}

// prettier-ignore
export function getStatistics(state: IState): IStatistics[] {
  if (!state.data) {
    return [];
  }
  
  const nodes = fallbackDataExtractor("nodes")(state);
  const farms = fallbackDataExtractor('farms')(state);
  const countries = [...new Set(nodes.map(node => node.country))]
  const nodeContracts = fallbackDataExtractor("nodeContracts")(state);
  const nodeContractsNo = nodeContracts.length
  const twins = fallbackDataExtractor("twins")(state);
  const twinsNo = twins.length
  const accessNodes = getAccessNodesCount(nodes)
  const gateways = getGatewaysCount(nodes)
  const cru = nodes.reduce((total, next) => total + BigInt(next.cru ?? 0), BigInt(0)).toString();
  const hru = nodes.reduce((total, next) => total + BigInt(next.hru ?? 0), BigInt(0)).toString();
  const sru = nodes.reduce((total, next) => total + BigInt(next.sru ?? 0), BigInt(0)).toString();
  const mru = nodes.reduce((total, next) => total + BigInt(next.mru ?? 0), BigInt(0)).toString();
  const publicIPsNo = farms.reduce((total, next) => total + BigInt(next.publicIPs.length ?? 0), BigInt(0)).toString();
  
  return [
    { id: 0, data: nodes.length, title: "Nodes", icon: "mdi-laptop" },
    { id: 1, data: farms.length, title: "Farms", icon: "mdi-tractor" },
    { id: 2, data: countries.length, title: "Countries", icon: "mdi-earth" },
    { id: 3, data: cru, title: "Total CPUs", icon: "mdi-cpu-64-bit" },
    { id: 4, data: toTeraOrGigaOrPeta(sru), title: "Total SSD", icon: "mdi-nas" },
    { id: 5, data: toTeraOrGigaOrPeta(hru), title: "Total HDD", icon: "mdi-harddisk" },
    { id: 6, data: toTeraOrGigaOrPeta(mru), title: "Total RAM", icon: "mdi-memory" },
    { id: 7, data: accessNodes, title: "Access Nodes", icon: "mdi-gate" },
    { id: 8, data: gateways, title: "Gateways", icon: "mdi-boom-gate-outline" },
    { id: 9, data: twinsNo, title: "Twins", icon: "mdi-brain" },
    { id: 10, data: publicIPsNo, title: "Public IPs", icon: "mdi-access-point" },
    { id: 11, data: nodeContractsNo, title: "Contracts", icon: "mdi-file-document-edit-outline" },
  ]
}

export default {
  loading: (state) => state.loading,
  nodes: (state) => {
    const nodes = fallbackDataExtractor("nodes")(state);
    // const farms = findById("farms", "farmId")(state);
    return nodes.map((node) => {
      const country: any = node.country;
      const [totalPublicIPs,freePublicIPs,usedPublicIps]=getFarmPublicIPs(state, node.farmId);
      return {
        ...node,
        totalPublicIPs: totalPublicIPs,
        freePublicIPs : freePublicIPs,
        usedPublicIPs : usedPublicIps,
        countryFullName: country && country?.length == 2 ? byInternet(country)?.country: country,
        farmingPolicyName: state.policies[node.farmingPolicyId],
        // status: state.nodes_status[node.nodeId]? state.nodes_status[node.nodeId]: false,
        status: node.status
      };
    });
  },
  farms: fallbackDataExtractor("farms"),
  locations: fallbackDataExtractor("locations"),
  twins: fallbackDataExtractor("twins"),

  /* Getters By Id */
  node: findById("nodes", "nodeId"),
  farm: findById("farms", "farmId"),
  location: findById("locations", "id"),
  twin: findById("twins", "twinId"),

  /* filters helpers */
  getFilter: (state) => {
    return (key1: string, key2: string) => {
      return (state.filters as any)[key1][key2];
    };
  },

  /* filtered values */
  filtered_nodes: applyFilters(
    (state) => {
      const nodes = fallbackDataExtractor("nodes")(state);
      return nodes.map((node) => {
        const country: any = node.country;
        const [totalPublicIPs, freePublicIPs, usedPublicIps]=getFarmPublicIPs(state, node.farmId);

        return {
          ...node,
          totalPublicIPs: totalPublicIPs,
          freePublicIPs : freePublicIPs,
          usedPublicIPs : usedPublicIps,
          countryFullName: country && country?.length == 2 ? byInternet(country)?.country: country,
          farmingPolicyName: state.policies[node.farmingPolicyId],
          // status: state.nodes_status[node.nodeId]? state.nodes_status[node.nodeId]: false,
          status: node.status
        };
      });
    },
    (state) => state.filters.nodes,
    inFilter("nodeId"),
    inFilter("createdById"),
    inFilter("farmId"),
    inFilter("twinId"),
    inFilter("country"),
    inFilter("farmingPolicyName"),
    inFilter("countryFullName"),
    inFilter("certificationType"),
    rangeFilter("hru"),
    rangeFilter("mru"),
    rangeFilter("sru"),
    rangeFilter("cru"),
    conditionFilter("status"),
    comparisonFilter("freePublicIPs", ">=")
  ),

  filtered_farm: applyFilters(
    (state) => {
      const farms = fallbackDataExtractor("farms")(state);
      return farms.map((f) => {
        return {
          ...f,
          totalPublicIPs : f.publicIPs.length,
          freePublicIPs : getFarmFreePublicIps(f),
          usedPublicIPs : getFarmUsedPublicIps(f),
        };
      });
    },
    (state) => state.filters.farms,
    inFilter("createdById"),
    inFilter("farmId"),
    inFilter("twinId"),
    inFilter("certificationType"),
    inFilter("name"),
    comparisonFilter("freePublicIPs", ">="),
    inFilter("pricingPolicyId")
  ),

  /* visual helpers */
  maxValueOf(state) {
    return (key: keyof GetDataQueryType, valueOf: string) => {
      const items: any[] = fallbackDataExtractor(key, state);
      const values = items.map((i: any) => +(i as any)[valueOf]) as any[];
      return Math.max(...values);
    };
  },

  statistics: getStatistics,
} as GetterTree<IState, IState>;
