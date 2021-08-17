<template>
  <v-container fluid>
    <h1>
      Nodes
    </h1>
    <v-divider />
    <br />
    <v-row>
      <v-col cols="3">
        <h3>
          Filters
        </h3>
        <br />
        <v-row>
          <v-chip
            v-for="(filter, idx) in filters"
            :key="filter.key"
            class="ma-2"
            v-model="filter.active"
            @click="toggleActive(idx)"
            filter
          >
            {{ filter.key.toUpperCase() }}
          </v-chip>
        </v-row>
        <br />
        <v-divider />
        <section class="filter-container" ref="filters">
          <div v-for="filter in activeFilters" :key="filter.key">
            <InFilter
              key1="nodes"
              :key2="filter.key"
              :label="filter.label"
              v-if="filter.type === 'in'"
            />
            <RangeFilter
              v-if="filter.type === 'range'"
              key1="nodes"
              :key2="filter.key"
              :label="filter.label"
            />
          </div>
        </section>
      </v-col>
      <v-col cols="9">
        <v-data-table
          ref="table"
          :fixed-header="!!tableHeight"
          :height="tableHeight ? tableHeight + 'px' : undefined"
          :loading="$store.getters.loading"
          loading-text="Loading..."
          :headers="headers"
          :items="$store.getters.filtered_nodes"
          :items-per-page="10"
          class="elevation-1"
          align
          @click:row="openSheet"
        >
          <template v-slot:[`item.version`]="{ item }">
            v{{ item.version }}.0
          </template>
          <template v-slot:[`item.gridVersion`]="{ item }">
            v{{ item.version }}.0
          </template>
          <template v-slot:[`item.createdAt`]="{ item }">
            {{ item.createdAt | date }}
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <NodeDetails
      :open="!!activeNode"
      :node="activeNode"
      v-on:close-sheet="closeSheet"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NodeDetails from "@/components/NodeDetails.vue";
import { INode } from "@/graphql/api";
import InFilter from "@/components/InFilter.vue";
import RangeFilter from "@/components/RangeFilter.vue";

@Component({
  components: {
    NodeDetails,
    InFilter,
    RangeFilter,
  },
})
export default class Nodes extends Vue {
  headers = [
    { text: "ID", value: "nodeId" },
    { text: "VERSION", value: "version" },
    { text: "GRID VERSION", value: "gridVersion", align: "center" },
    { text: "HRU", value: "hru", align: "center" },
    { text: "SRU", value: "sru", align: "center" },
    { text: "CRU", value: "cru", align: "center" },
    { text: "MRU", value: "mru", align: "center" },
    { text: "CREATED AT", value: "createdAt", align: "center" },
  ];

  // activeFilters is exactly same as filters
  // the idea is to allow user to sort filter he wants
  activeFilters: any[] = [];
  filters = [
    {
      type: "in",
      active: false,
      key: "nodeId",
      label: "Filter by node id.",
    },
    {
      type: "in",
      active: false,
      key: "createdById",
      label: "Filter by createdby.",
    },
    {
      type: "in",
      active: false,
      key: "farmId",
      label: "Filter by farm id.",
    },
    {
      type: "in",
      active: false,
      key: "twinId",
      label: "Filter by twin id.",
    },
    {
      type: "in",
      active: false,
      key: "locationId",
      label: "Filter by location id.",
    },
    {
      type: "in",
      active: false,
      key: "farmingPolicyId",
      label: "Filter by farming policy id.",
    },
    {
      type: "range",
      active: false,
      key: "hru",
      label: "hru",
    },
    {
      type: "range",
      active: false,
      key: "mru",
      label: "mru",
    },
    {
      type: "range",
      active: false,
      key: "cru",
      label: "cru",
    },
    {
      type: "range",
      active: false,
      key: "sru",
      label: "sru",
    },
  ];

  toggleActive(idx: number) {
    const filter = this.filters[idx];

    if (filter.active) {
      this.activeFilters.splice(this.activeFilters.indexOf(filter), 1);
      filter.active = false;
    } else {
      filter.active = true;
      this.activeFilters.push(filter);
    }
  }

  activeNode: INode | null = null;

  openSheet(node: INode): void {
    this.activeNode = node;
  }

  closeSheet(): void {
    this.activeNode = null;
  }

  tableHeight: number | null = null;
  getTableHeight(): number {
    console.log("here");

    const tableComp = this.$refs.table as any;
    const table = tableComp.$el as HTMLDivElement;
    return table.offsetTop;
  }
  setHeight() {
    // filters panel
    const filtersPanel = this.$refs.filters as HTMLDivElement;
    filtersPanel.style.maxHeight =
      window.innerHeight - filtersPanel.offsetTop - 20 + "px";

    // table height
    this.tableHeight = window.innerHeight - this.getTableHeight() - 80;
  }

  mounted() {
    this.setHeight();
    window.addEventListener("resize", this.setHeight.bind(this));
  }

  destroyed() {
    window.removeEventListener("resize", this.setHeight);
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-right: 10px;
  max-height: 350px;
  overflow-x: hidden;
  overflow-y: auto;
  will-change: transform;
}
</style>
