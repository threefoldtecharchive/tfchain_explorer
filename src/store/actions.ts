import type { ActionContext } from "vuex";
import type { IState } from "./state";
import apollo from "@/plugins/apollo";
import { getDataQuery, GetDataQueryType, getTotalCountQuery, GetTotalCountQueryType } from '../graphql/api';
import { MutationTypes } from './mutations';
import moment from 'moment';
import getPricingPolicies from "@/utils/getPricingPolicies";

export enum ActionTypes {
    INIT_POLICIES = "initPolicies",
    INIT_PRICING_POLICIES = "initPricingPolicies",
    LOAD_DATA = "loadData"
}

export default {
    initPolicies({ commit }: ActionContext<IState, IState>) {
        fetch("https://raw.githubusercontent.com/threefoldtech/tfchain/development/farming_policies.json")
            .then<{id: number, name: string}[]>(res => res.json())
            .then(items => {
                return items.map(({ name }) => name);
            })
            .then(data => {
                commit(MutationTypes.SET_POLICIES, data);
            });
    },
    initPricingPolicies({ commit }: ActionContext<IState, IState>) {
        getPricingPolicies()
            .then(policies => {
                commit(MutationTypes.SET_PRICING_POLICIES, policies);
            }).catch(err => {
                console.log("Error while loading pricing polices", err);
            })
    },
    loadData({ commit }: ActionContext<IState, IState>) {
        commit(MutationTypes.SET_LOAD, true);
            apollo.defaultClient.query<GetTotalCountQueryType>({
                query: getTotalCountQuery
            })
            .then(({ data }) => data)
        .then((data) => {
            const { nodes, farms, twins, countries, nodeContracts } = data;
            return {
                nodes: nodes.totalCount,
                farms: farms.totalCount,
                twins: twins.totalCount,
                countries: countries.totalCount,
                nodeContracts: nodeContracts.totalCount
            };
        })
        .then((variables) => {
            return apollo.defaultClient.query<GetDataQueryType>({
                query: getDataQuery,
                variables
            })
        })
        .then(({ data }) => {
            data.nodes = data.nodes.map(node => {
                const { updatedAt } = node
                const startTime = moment()
                const end = moment(updatedAt)
                const hours = startTime.diff(end, 'hours')
                // if updated difference in hours with now is less then 2 hours, node is up
                if (hours <= 2) {
                    node.status = true
                } else {
                    node.status = false
                }
                return node
            })
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