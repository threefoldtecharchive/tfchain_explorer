import type { ActionContext } from "vuex";
import type { IState } from "./state";
import apollo from "@/plugins/apollo";
import { getDataQuery, GetDataQueryType, getTotalCountQuery, GetTotalCountQueryType } from '../graphql/api';
import { MutationTypes } from './mutations';
import moment from 'moment';

export enum ActionTypes {
    INIT_POLICIES = "initPolicies",
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
    loadData({ commit }: ActionContext<IState, IState>) {
        commit(MutationTypes.SET_LOAD, true);
            apollo.defaultClient.query<GetTotalCountQueryType>({
                query: getTotalCountQuery
            })
            .then(({ data }) => {
                return data
                // return fetch(`${window.configs.proxy_url}/nodes?max_result=${data.nodes.totalCount}`)
                //     .then<{nodeId: number, status: "up" | "down"}[]>(res => res.json())
                //     .then(nodes => {
                //         return nodes.reduce((items, node) => {
                //             items[node.nodeId] = node.status === "up";
                //             return items;
                //         }, {} as {[key: number]: boolean});
                //     })
                //     .then(nodes => {
                //         commit(MutationTypes.SET_NODES_STATUS, nodes);
                //     })
                //     .then(() => data);
            })
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
                console.log(`now ${startTime}`)
                console.log(`node updated at ${end}`)
                const minutes = startTime.diff(end, 'minutes')
            
                console.log(`diff: ${minutes}`)
                // if updated difference in minutes with now is less then 10 minutes, node is up
                if (minutes < 15) {
                    node.status = true
                } else {
                    node.status = false
                }
                return node
            })
            console.log(data.nodes)
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