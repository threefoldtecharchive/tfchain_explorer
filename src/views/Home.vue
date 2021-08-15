<template>
  <v-container fluid>
    <h1>
      Nodes
    </h1>
    <v-divider />
    <br />
    <v-row v-if="!initial">
      <v-col cols="3">
        <FilterPanel
          v-on:apply-filter="applyFilter"
          :filters="$store.getters.filters('nodes')"
        />
      </v-col>
      <v-col cols="9" v-if="!loading">
        <v-data-table
          :headers="headers"
          :items="nodes"
          :items-per-page="10"
          class="elevation-1"
          align
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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { nodesQuery, NodeModel } from "@/graphql/node";
import FilterPanel from "@/components/FilterPanel.vue";
import { generateWhereQuery } from "@/utils/filter";

@Component({
  components: {
    FilterPanel,
  },
})
export default class Home extends Vue {
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

  nodes: NodeModel[] = [];
  initial = true;
  loading = false;

  async created(): Promise<void> {
    const res = await this.$apollo.query<{ nodes: NodeModel[] }>({
      query: nodesQuery,
    });
    this.nodes = res.data.nodes;
    this.initial = false;
  }

  async applyFilter(): Promise<void> {
    const res = await this.$apollo.query<{ nodes: NodeModel[] }>({
      query: nodesQuery,
      variables: {
        where: generateWhereQuery(this.$store.state.nodes),
      },
    });
    this.nodes = res.data.nodes;
    this.loading = false;
  }
}
</script>

<style lang="scss" scoped>
.loader {
  height: 80vh;
}
</style>
