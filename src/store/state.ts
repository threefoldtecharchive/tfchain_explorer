import { GetDataQueryType } from "@/graphql/api";

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
const createRangeFilter = () => ({ enabled: false, value: { min: 0, max: Number.MAX_SAFE_INTEGER} });

export interface IState {
  data: GetDataQueryType | null;
  loading: boolean;
  filters: {
    nodes: {
      nodeId: IInFilter;
      createdById: IInFilter;
      farmId: IInFilter;
      twinId: IInFilter;
      locationId: IInFilter;
      farmingPolicyId: IInFilter;
      hru: IRangeFilter;
      cru: IRangeFilter;
      mru: IRangeFilter;
      sru: IRangeFilter;
    };
    farms: {
      createdById: IInFilter;
      farmId: IInFilter;
      twinId: IInFilter;
      certificationType: IInFilter;
      // farmingPolicyId: IInFilter;
      // locationId: IInFilter;
      // hru: IRangeFilter;
      // cru: IRangeFilter;
      // mru: IRangeFilter;
      // sru: IRangeFilter;
    };
  };
}

export default {
  data: null,
  loading: false,
  filters: {
    nodes: {
      nodeId: createInFilter(),
      createdById: createInFilter(),
      farmId: createInFilter(),
      twinId: createInFilter(),
      locationId: createInFilter(),
      farmingPolicyId: createInFilter(),
      hru: createRangeFilter(),
      cru: createRangeFilter(),
      sru: createRangeFilter(),
      mru: createRangeFilter(),
    },
    farms: {
      createdById: createInFilter(),
      farmId: createInFilter(),
      twinId: createInFilter(),
      certificationType: createInFilter(),
    },
  },
} as IState;
