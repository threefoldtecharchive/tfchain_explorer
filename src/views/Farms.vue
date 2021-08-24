<template>
  <Layout pageName="Farms">
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
          key1="farms"
          :key2="filter.key"
          :label="filter.label"
          :value="filter.value"
        />
      </div>
    </template>

    <template v-slot:table>
      <v-data-table
        :loading="$store.getters.loading"
        loading-text="Loading..."
        :headers="headers"
        :items="$store.getters.filtered_farm"
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

        <template v-slot:[`item.certificationType`]="{ item }">
          <v-chip :color="item.certificationType === 'Diy' ? 'red' : 'green'">
            {{ item.certificationType }}
          </v-chip>
        </template>

        <template v-slot:[`item.createdAt`]="{ item }">
          {{ item.createdAt | date }}
        </template>

        <template v-slot:[`item.updatedAt`]="{ item }">
          <v-icon :color="item.updatedAt ? 'green' : 'red'">
            {{ item.updatedAt ? "mdi-check" : "mdi-close" }}
          </v-icon>
        </template>

        <template v-slot:[`item.deletedAt`]="{ item }">
          <v-icon :color="item.deletedAt ? 'green' : 'red'">
            {{ item.deletedAt ? "mdi-check" : "mdi-close" }}
          </v-icon>
        </template>
      </v-data-table>
    </template>

    <template v-slot:details>
      <Details
        :open="!!farm"
        :farm="farm"
        :twin="$store.getters.twin(farm && farm.twinId)"
        v-on:close-sheet="closeSheet"
      />
    </template>
  </Layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Details from "@/components/Details.vue";
import { IFarm } from "@/graphql/api";
import Layout from "@/components/Layout.vue";
import InFilter from "@/components/InFilter.vue";

@Component({
  components: {
    Layout,
    Details,
    InFilter,
  },
})
export default class Farms extends Vue {
  headers = [
    { text: "ID", value: "farmId" },
    { text: "NAME", value: "name" },
    { text: "VERSION", value: "version" },
    { text: "GRID VERSION", value: "gridVersion", align: "center" },
    { text: "CERTIFICATION TYPE", value: "certificationType", align: "center" },
    { text: "PRICING POLICY ID", value: "pricingPolicyId" },
    { text: "CREATED AT", value: "createdAt", align: "center" },
    { text: "UPDATED", value: "updatedAt", align: "center" },
    { text: "DELETED", value: "deletedAt", align: "center" },
  ];

  // activeFilters is exactly same as filters
  // the idea is to allow user to sort filter he wants
  activeFilters = [
    {
      active: true,
      key: "name",
      label: "Filter by node name",
    },
    {
      active: true,
      key: "twinId",
      label: "Filter by twin id.",
    },
    {
      active: true,
      key: "certificationType",
      label: "Filter by certification type",
      value: ["Diy", "Certified"],
    },
  ];

  filters = [
    {
      active: false,
      key: "createdById",
      label: "Filter by createdby.",
    },
    {
      active: false,
      key: "farmId",
      label: "Filter by farm id.",
    },
    ...this.activeFilters,
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

  farm: IFarm | null = null;

  openSheet(farm: IFarm): void {
    this.farm = farm;
  }

  closeSheet(): void {
    this.farm = null;
  }
}
</script>
