import { IState } from "@/store/state";
import { applyFilters, inFilter, rangeFilter } from "@/utils/filters";

describe("applyFilters.ts", () => {
  let state: IState;
  beforeEach(() => {
    state = ({
      data: {
        nodes: [
          {
            nodeId: 0,
            cru: "6546846987",
          },
          {
            nodeId: 1,
            cru: "564657879",
          },
        ],
      },
      filters: {
        nodes: {
          cru: {
            enabled: false,
            value: {
              min: 0,
              max: 6546846987798,
            },
          },
          nodeId: {
            enabled: false,
            value: [0],
          },
        },
      },
    } as unknown) as IState;
  });

  test("No filters at all", () => {
    const t = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes
    )(state);
    expect(t).toEqual(state.data?.nodes);
  });

  test("Filter everything", () => {
    const t = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes,
      () => []
    )(state);
    expect(t).toEqual([]);
  });

  test("Filter None", () => {
    const t = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes,
      (_, data) => data
    )(state);
    expect(t).toEqual(state.data?.nodes);
  });

  test("Range Filter", () => {
    // not enabled
    const t1 = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes,
      rangeFilter("cru")
    )(state);
    expect(t1).toEqual(state.data?.nodes);

    // enabled
    state.filters.nodes.cru.enabled = true;
    const t2 = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes,
      rangeFilter("cru")
    )(state);
    expect(t2).toEqual(state.data?.nodes);
  });

  test("In Filter", () => {
    // not enabled
    const t1 = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes,
      inFilter("nodeId")
    )(state);
    expect(t1).toEqual(state.data?.nodes);

    // enabled
    state.filters.nodes.nodeId.enabled = true;
    const t2 = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes,
      inFilter("nodeId")
    )(state);
    expect(t2).toEqual([{ nodeId: 0, cru: "6546846987" }]);
  });

  test("Mix of Filters", () => {
    // enable all
    state.filters.nodes.nodeId.enabled = true;
    state.filters.nodes.cru.enabled = true;
    const t = applyFilters(
      (state) => state.data?.nodes ?? [],
      (state) => state.filters.nodes,
      rangeFilter("cru"),
      inFilter("nodeId")
    )(state);
    expect(t).toEqual([{ nodeId: 0, cru: "6546846987" }]);
  });
});
