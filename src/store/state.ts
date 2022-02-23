import { GetDataQueryType, IFarm } from "@/graphql/api";

interface IInFilter {
  enabled: boolean;
  value: string[];
}
const createInFilter = () => ({ enabled: false, value: [] });

interface IRangeFilter {
  enabled: boolean;
  value: {
    min: number;
    max: number;
  };
}
// prettier-ignore
const createRangeFilter = () => ({ enabled: false, value: { min: 0, max: Number.MAX_SAFE_INTEGER } });

interface IConditionFilter {
  enabled: boolean;
  value: boolean;
}

const createConditionFilter = () => ({ enabled: false, value: true });

interface IComparisonFilter {
  enabled: boolean;
  value: number;
}

const createComparisonFilter = () => ({ enabled: false, value: 0 });

export interface IPaginationData<T> {
  total: number,
  items: Map<number, T[]>;
}

function createPaginationData<T>(): IPaginationData<T> {
  return {
    total: 0,
    items: new Map<number, T[]>()
  }
}

export interface IState {
  data: GetDataQueryType | null;
  policies: { [key: string]: string };
  pricingPolicies: Map<number, string>;
  loading: boolean;
  nodes_status: { [key: number]: boolean };
  nodeContractsNo: number;
  twinsNo: number;
  versions: Array<{ name: string, value: any }>;
  filters: {
    nodes: {
      nodeId: IInFilter;
      createdById: IInFilter;
      farmId: IInFilter;
      twinId: IInFilter;
      country: IInFilter;
      farmingPolicyName: IInFilter;
      hru: IRangeFilter;
      cru: IRangeFilter;
      mru: IRangeFilter;
      sru: IRangeFilter;
      status: IConditionFilter;
      countryFullName: IInFilter;
      certificationType: IInFilter;
      freePublicIPs: IComparisonFilter;
    };
    farms: {
      createdById: IInFilter;
      farmId: IInFilter;
      twinId: IInFilter;
      certificationType: IInFilter;
      name: IInFilter;
      freePublicIPs: IComparisonFilter;
      pricingPolicyName: IInFilter;
    };
  };

  /* Refactored Data */
  farms: IPaginationData<IFarm>
}

export default {
  data: null,
  policies: {},
  pricingPolicies: new Map(),
  loading: false,
  nodes_status: {},
  nodeContractsNo: 0,
  versions: [],
  twinsNo: 0,
  filters: {
    nodes: {
      nodeId: createInFilter(),
      createdById: createInFilter(),
      farmId: createInFilter(),
      twinId: createInFilter(),
      country: createInFilter(),
      farmingPolicyName: createInFilter(),
      certificationType: createInFilter(),
      hru: createRangeFilter(),
      cru: createRangeFilter(),
      sru: createRangeFilter(),
      mru: createRangeFilter(),
      status: createConditionFilter(),
      countryFullName: createInFilter(),
      freePublicIPs: createComparisonFilter(),
    },
    farms: {
      createdById: createInFilter(),
      farmId: createInFilter(),
      twinId: createInFilter(),
      certificationType: createInFilter(),
      name: createInFilter(),
      freePublicIPs: createComparisonFilter(),
      pricingPolicyName: createInFilter(),
    },
  },


  /* Refactored data */
  farms: createPaginationData()
} as IState;
