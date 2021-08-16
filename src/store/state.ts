import { GetDataQueryType } from "@/graphql/api";

export interface IState {
  data: GetDataQueryType | null;
  loading: boolean;
  node_filters: {
    ids: string[];
  };
  farm_filters: null;
}

export default {
  data: null,
  loading: false,
  node_filters: {
    ids: [],
  },
  farm_filters: null,
} as IState;
