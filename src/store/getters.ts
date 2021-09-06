import { GetDataQueryType } from "@/graphql/api";
import { applyFilters, inFilter, rangeFilter } from "@/utils/filters";
import { GetterTree } from "vuex";
import { IState } from "./state";

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
    inFilter("locationId"),
    inFilter("farmingPolicyId"),
    rangeFilter("hru"),
    rangeFilter("mru"),
    rangeFilter("sru"),
    rangeFilter("cru")
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
