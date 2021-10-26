<template>
  <Layout pageName="Statstics" v-if="statistics" :noFilter="true">
    <v-row>
      <!--Nodes-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#26c6da" dark max-width="300">
          <v-card-title>
            <v-icon large center :size="50"> mdi-album </v-icon>
            <span class="text-h4 font-weight-light">Nodes</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold text-center">
            {{ statistics.nodesNo }}
          </v-card-text>
        </v-card>
      </v-col>

      <!--Farms-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#26c6da" dark max-width="300">
          <v-card-title>
            <v-icon large right> mdi-tractor </v-icon>
            <span class="text-h4 font-weight-light">Farms</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold text-center">
            {{ statistics.farmsNo }}
          </v-card-text>
        </v-card>
      </v-col>

      <!--Countries-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#26c6da" dark max-width="300">
          <v-card-title>
            <v-icon large right> mdi-earth </v-icon>
            <span class="text-h4 font-weight-light">Countries</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold text-center">
            {{ statistics.countriesNo }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!--CPUs-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#26c6da" dark max-width="300">
          <v-card-title>
            <v-icon large right> mdi-cpu-64-bit </v-icon>
            <span class="text-h4 font-weight-light">Total CPUs</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold text-center">
            {{ statistics.cru }}
          </v-card-text>
        </v-card>
      </v-col>
      <!--SSD-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#26c6da" dark max-width="300">
          <v-card-title>
            <v-icon large right> mdi-nas </v-icon>
            <span class="text-h4 font-weight-light">Total SSD</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold text-center">
            {{ statistics.sru | toTeraOrGiga }}
          </v-card-text>
        </v-card>
      </v-col>
      <!--HDD-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#26c6da" dark max-width="300">
          <v-card-title>
            <v-icon large right> mdi-harddisk </v-icon>
            <span class="text-h4 font-weight-light">Total HDD</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold text-center">
            {{ statistics.hru | toTeraOrGiga }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!--RAM-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#26c6da" dark max-width="300">
          <v-card-title>
            <v-icon large right> mdi-memory </v-icon>
            <span class="text-h4 font-weight-light">Total RAM</span>
          </v-card-title>

          <v-card-text class="text-h5 font-weight-bold text-center">
            {{ statistics.mru | toTeraOrGiga }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </Layout>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Layout from "@/components/Layout.vue";
import { getStatistics } from "@/store/getters";

@Component({
  components: {
    Layout,
  },
})
export default class Statistics extends Vue {
  private _unsubscribe: any;
  statistics: any = null;
  created() {
    this._unsubscribe = this.$store.subscribe((_, state) => {
      this.statistics = getStatistics(state);
    });
  }

  destroyed() {
    this._unsubscribe?.();
  }
}
</script>
