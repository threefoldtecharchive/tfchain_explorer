import { GetDataQueryType } from "@/graphql/api";

export interface IState {
  data: GetDataQueryType | null;
  loading: boolean;
  node_filters: null;
  farm_filters: null;
}

export default {
  data: null,
  loading: false,
  node_filters: null,
  farm_filters: null,
} as IState;
