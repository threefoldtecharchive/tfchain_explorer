<template>
  <v-container fluid>
    <h1>
      Farms
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
        <section class="filter-container">
          <div v-for="filter in activeFilters" :key="filter.key">
            <InFilter
              key1="farms"
              :key2="filter.key"
              :label="filter.label"
              :value="['Diy', 'Certified']"
            />
          </div>
        </section>
      </v-col>
      <v-col cols="9">
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
      </v-col>
    </v-row>
    <Details
      :open="!!farm"
      :farm="farm"
      :country="$store.getters.country(farm && farm.countryId)"
      :city="$store.getters.city(farm && farm.cityId)"
      :twin="$store.getters.twin(farm && farm.twinId)"
      v-on:close-sheet="closeSheet"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Details from "@/components/Details.vue";
import { IFarm } from "@/graphql/api";
import InFilter from "@/components/InFilter.vue";

@Component({
  components: {
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
  activeFilters: any[] = [];
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
    {
      active: false,
      key: "twinId",
      label: "Filter by twin id.",
    },
    {
      active: false,
      key: "certificationType",
      label: "Filter by certification type",
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

  farm: IFarm | null = null;

  openSheet(farm: IFarm): void {
    this.farm = farm;
  }

  closeSheet(): void {
    this.farm = null;
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-right: 10px;
  max-height: calc(100vh - 164px);
  overflow-x: hidden;
  overflow-y: auto;
  will-change: transform;
}
</style>
