import type { ActionContext } from "vuex";
import type { IState } from "./state";
import apollo from "@/plugins/apollo";
import { getDataQuery, GetDataQueryType } from '../graphql/api';
import { MutationTypes } from './mutations';


export enum ActionTypes {
    LOAD_DATA = 'loadData'
}

export default {
    loadData({ commit }: ActionContext<IState, IState>) {
        commit(MutationTypes.SET_LOAD, true);
    
        apollo.defaultClient.query<GetDataQueryType>({
            query: getDataQuery
        })
        .then(({ data }) => {
            commit(MutationTypes.SET_DATA, data);
        })
        .catch((err) => {
            /**
             * @todo Should handle this error nicely. :"(
             */
            console.log('something went wrong', err);
        })
        .finally(() => {
            commit(MutationTypes.SET_LOAD, false);
        })
    }
}