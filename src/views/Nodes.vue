<template>
  <v-container fluid>
    <h1>
      Nodes
    </h1>
    <v-divider />
    <br />
    <v-row>
      <v-col cols="3">
        <!-- <FilterPanel
          :name="'nodes'"
          v-on:apply-filter="applyFilter"
          :filters="$store.getters.filters('nodes')"
        /> -->
        <v-combobox
          v-model="ids"
          :items="$store.getters.nodes_id"
          chips
          clearable
          label="Filter by node id."
          multiple
          prefix="in:"
          solo
          type="text"
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              @click="select"
              @click:close="remove(item)"
            >
              <strong>{{ item }}</strong>
            </v-chip>
          </template>
        </v-combobox>
      </v-col>
      <v-col cols="9">
        <v-data-table
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
import { NodeModel } from "@/graphql/node";
import NodeDetails from "@/components/NodeDetails.vue";
import { MutationTypes } from "@/store/mutations";

@Component({
  components: {
    NodeDetails,
  },
})
export default class Nodes extends Vue {
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

  activeNode: NodeModel | null = null;

  openSheet(node: NodeModel): void {
    this.activeNode = node;
  }

  closeSheet(): void {
    this.activeNode = null;
  }

  get ids(): string[] {
    return this.$store.getters.node_filters("ids");
  }

  set ids(value: string[]) {
    console.log(value);

    this.$store.commit(MutationTypes.SET_NODE_FILTER, {
      key: "ids",
      value,
    });
  }

  remove(item: string): void {
    this.$store.commit(MutationTypes.UPDATE_NODE_FILTER, {
      key: "ids",
      value: item,
    });
  }

  // chips = [];

  // remove(item: any) {
  //   this.chips.splice(this.chips.indexOf(item), 1);
  //   this.chips = [...this.chips];
  // }
}
</script>

<style lang="scss" scoped>
.loader {
  height: 80vh;
}
</style>
