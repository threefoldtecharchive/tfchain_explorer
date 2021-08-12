<template>
  <v-container fluid>
    <h1>
      Nodes
    </h1>
    <v-divider />
    <br />
    <v-row v-if="!loading">
      <v-col cols="3">
        <FilterPanel />
      </v-col>
      <v-col cols="9">
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
    </v-row>
    <div class="d-flex justify-center align-center loader" v-if="loading">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { nodesQuery, NodeModel } from "@/graphql/node";
import FilterPanel from "@/components/FilterPanel.vue";

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
  loading = true;

  async created(): Promise<void> {
    const res = await this.$apollo.query<{ nodes: NodeModel[] }>(nodesQuery);
    // this.nodes = res.data.nodes;
    this.loading = false;

    // fake data
    const data = [];
    for (let i = 0; i < 1e2; i++) {
      const x = Math.random() > 0.5 ? res.data.nodes : res.data.nodes.reverse();
      data.push(
        ...x.map((y) => {
          y = { ...y };
          y.id += Math.random().toString();
          return y;
        })
      );
    }
    this.nodes = data;
  }
}
</script>

<style lang="scss" scoped>
.loader {
  height: 80vh;
}
</style>
