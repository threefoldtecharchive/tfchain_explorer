<style scoped>
.text-white {
  color: #ffffff;
}
.icon-card-size {
  font-size: 40px;
}
</style>
<template>
  <Layout pageName="Statstics" v-if="statistics" :noFilter="true">
    <v-row>
      <!--Nodes-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold _text-blue">
              {{ statistics.nodesNo }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-album </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Nodes</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!--Farms-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.farmsNo }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-tractor </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Farms</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!--Countries-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.countriesNo }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-earth </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Countries</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!--CPUs-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.cru }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-cpu-64-bit </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Total CPUs</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!--SSD-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.sru | toTeraOrGiga }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-nas </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Total SSD</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!--HDD-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.hru | toTeraOrGiga }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-harddisk </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Total HDD</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!--RAM-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.mru | toTeraOrGiga }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-memory </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Total RAM</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!--GATEWAYS-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.onlineGateways }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size"> mdi-gate </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Gateways</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <!--TWINS-->
      <v-col>
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="text-h3 font-weight-bold">
              {{ statistics.twinsNo }}
            </div>
          </v-card-title>
          <v-card-text class="text-h6 font-weight-bold text-center">
            <div class="d-flex justify-center">
              <div>
                <v-icon class="icon-card-size">
                  mdi-chevron-up-circle-outline
                </v-icon>
              </div>
              <div class="d-flex align-center">
                <span class="text-h4 text-white">Twins</span>
              </div>
            </div>
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
