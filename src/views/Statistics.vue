<template>
  <Layout pageName="Statstics" v-if="statistics" :noFilter="true">
    <v-row>
      <!--Nodes-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#ffffff" max-width="400">
          <v-card-title class="justify-center">
            <div class="text-h2 font-weight-bold" style="color: #1976d2">
              {{ statistics.nodesNo }}
            </div>
          </v-card-title>
          <v-card-text
            class="text-h6 font-weight-bold text-center"
            style="color: black"
          >
            <span class="text-h6">Nodes</span>
          </v-card-text>
        </v-card>
      </v-col>

      <!--Farms-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#ffffff" max-width="400">
          <v-card-title class="justify-center">
            <div class="text-h2 font-weight-bold" style="color: #1976d2">
              {{ statistics.farmsNo }}
            </div>
          </v-card-title>
          <v-card-text
            class="text-h6 font-weight-bold text-center"
            style="color: black"
          >
            <span class="text-h6">Farms</span>
          </v-card-text>
        </v-card>
      </v-col>

      <!--Countries-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#ffffff" max-width="400">
          <v-card-title class="justify-center" style="color: #1976d2">
            <div class="text-h2 font-weight-bold">
              {{ statistics.countriesNo }}
            </div>
          </v-card-title>
          <v-card-text
            class="text-h6 font-weight-bold text-center"
            style="color: black"
          >
            <span class="text-h6">Countries</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!--CPUs-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#ffffff" max-width="400">
          <v-card-title class="justify-center">
            <div class="text-h2 font-weight-bold" style="color: #1976d2">
              {{ statistics.cru }}
            </div>
          </v-card-title>
          <v-card-text
            class="text-h6 font-weight-bold text-center"
            style="color: black"
          >
            <span class="text-h6">Total CPUs</span>
          </v-card-text>
        </v-card>
      </v-col>
      <!--SSD-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#ffffff" max-width="400">
          <v-card-title class="justify-center">
            <div class="text-h2 font-weight-bold" style="color: #1976d2">
              {{ statistics.sru | toTeraOrGiga }}
            </div>
          </v-card-title>
          <v-card-text
            class="text-h6 font-weight-bold text-center"
            style="color: black"
          >
            <span class="text-h6">Total SSD</span>
          </v-card-text>
        </v-card>
      </v-col>
      <!--HDD-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#ffffff" max-width="400">
          <v-card-title class="justify-center">
            <div class="text-h2 font-weight-bold" style="color: #1976d2">
              {{ statistics.hru | toTeraOrGiga }}
            </div>
          </v-card-title>
          <v-card-text
            class="text-h6 font-weight-bold text-center"
            style="color: black"
          >
            <span class="text-h6">Total HDD</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!--RAM-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#ffffff" max-width="400">
          <v-card-title class="justify-center">
            <div class="text-h2 font-weight-bold" style="color: #1976d2">
              {{ statistics.mru | toTeraOrGiga }}
            </div>
          </v-card-title>
          <v-card-text
            class="text-h6 font-weight-bold text-center"
            style="color: black"
          >
            <span class="text-h6">Total RAM</span>
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
