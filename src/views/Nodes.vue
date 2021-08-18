<template>
  <Layout pageName="Nodes">
    <template v-slot:filters>
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
    </template>

    <template v-slot:active-filters>
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
    </template>

    <template v-slot:table>
      <v-data-table
        ref="table"
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
    </template>

    <template v-slot:details>
      <Details
        :open="!!node"
        :node="node"
        :farm="$store.getters.farm(node && node.farmId)"
        :country="$store.getters.country(node && node.countryId)"
        :city="$store.getters.city(node && node.cityId)"
        :location="$store.getters.location(node && node.locationId)"
        :twin="$store.getters.twin(node && node.twinId)"
        :config="$store.getters.publicConfig(node && node.publicConfigId)"
        v-on:close-sheet="closeSheet"
      />
    </template>
  </Layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Details from "@/components/Details.vue";
import { INode } from "@/graphql/api";
import Layout from "@/components/Layout.vue";
import InFilter from "@/components/InFilter.vue";
import RangeFilter from "@/components/RangeFilter.vue";

@Component({
  components: {
    Layout,
    Details,
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

  node: INode | null = null;

  openSheet(node: INode): void {
    this.node = node;
  }

  closeSheet(): void {
    this.node = null;
  }
}
</script>
