<template>
  <v-container fluid>
    <h1>
      Farms
    </h1>
    <v-divider />
    <br />
    <v-row v-if="!initial">
      <v-col cols="3">
        <!-- <FilterPanel
          v-on:apply-filter="applyFilter"
          :name="'farms'"
          :filters="$store.getters.filters('farms')"
        /> -->
      </v-col>
      <v-col cols="9" v-if="!loading">
        <v-data-table
          :headers="headers"
          :items="farms"
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
      <v-col cols="9" v-if="loading">
        <div class="d-flex justify-center align-center loader">
          <v-progress-circular indeterminate color="primary" />
        </div>
      </v-col>
    </v-row>
    <div class="d-flex justify-center align-center loader" v-if="initial">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <NodeDetails
      :open="!!activefarm"
      :node="activefarm"
      v-on:close-sheet="closeSheet"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { farmsQuery, FarmModel } from "@/graphql/farm";
import { generateWhereQuery } from "@/utils/filter";
import NodeDetails from "@/components/NodeDetails.vue";

@Component({
  components: {
    NodeDetails,
  },
})
export default class Farms extends Vue {
  headers = [
    { text: "ID", value: "nodeId" },
    { text: "Farm ID", value: "farmId", align: "center" },
    { text: "Ver", value: "version" },
    { text: "GridVer", value: "gridVersion", align: "center" },
    { text: "hru", value: "hru", align: "center" },
    { text: "sru", value: "sru", align: "center" },
    { text: "cru", value: "cru", align: "center" },
    { text: "mru", value: "mru", align: "center" },
    { text: "CreatedAt", value: "createdAt", align: "center" },
  ];

  farms: FarmModel[] = [];
  initial = true;
  loading = false;
  activefarm: FarmModel | null = null;

  async created(): Promise<void> {
    const res = await this.$apollo.query<{ farms: FarmModel[] }>({
      query: farmsQuery,
    });
    this.farms = res.data.farms;
    this.initial = false;
  }

  async applyFilter(): Promise<void> {
    this.loading = true;
    const res = await this.$apollo.query<{ farms: FarmModel[] }>({
      query: farmsQuery,
      variables: {
        where: generateWhereQuery(this.$store.state.farms),
      },
    });
    this.farms = res.data.farms;
    this.loading = false;
  }

  openSheet(farm: FarmModel) {
    this.activefarm = farm;
  }

  closeSheet(): void {
    this.activefarm = null;
  }
}
</script>

<style lang="scss" scoped>
.loader {
  height: 80vh;
}
</style>
