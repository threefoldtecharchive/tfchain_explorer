import { getDataQuery, GetDataQueryType, GetTotalCountQueryType } from "@/graphql/api";
import apollo from "@/plugins/apollo";

const LIMIT = 20;

function _createDataRequests(totals: GetTotalCountQueryType<number>) {
    const length = Math.ceil(Math.max(...Object.values(totals)) / LIMIT);
    const reqs = Array.from({ length }, (_, i) => {
        return apollo.defaultClient.query<GetDataQueryType>({
            query: getDataQuery,
            variables: { limit: LIMIT, offset: LIMIT * i }
        })
    });
    return Promise.all(reqs);
}

export default function createDataRequests(totals: GetTotalCountQueryType<number>): Promise<GetDataQueryType> {
    return _createDataRequests(totals)
        .then((results) => {
            const data = results.map(({ data }) => data);
            if (data.length === 0) {
                throw new Error("No data was found.");
            }

            const result = data[0];
            for (let i = 1; i < data.length; i++) {
                const value = data[i];
                result.nodes.push(...value.nodes);
                result.farms.push(...value.farms);
                result.twins.push(...value.twins);
                result.countries.push(...value.countries);
            }
            return result;
        });
}