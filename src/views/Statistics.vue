<style scoped>
.text-white {
  color: #ffffff;
}
.icon-card-size {
  font-size: 60px;
}
</style>
<template>
  <Layout pageName="Statstics" v-if="statistics" :noFilter="true">
    <v-row>
      <!--Nodes-->
      <v-col
        v-for="item in statistics"
        :key="item.id"
        class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
      >
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="400" dark>
          <v-card-title class="justify-center">
            <div class="d-flex flex-no-wrap justify-space-between">
              <v-icon class="icon-card-size"> {{ item.icon }} </v-icon>
              <div class="px-4">
                <div class="text-h3 font-weight-bold">
                  {{ item.data }}
                </div>
                <div class="d-flex align-center">
                  <span class="text-h4 text-white">{{ item.title }}</span>
                </div>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </Layout>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Layout from "@/components/Layout.vue";
import { getStatistics, IStatistics } from "@/store/getters";

@Component({
  components: {
    Layout,
  },
})
export default class Statistics extends Vue {
  private _unsubscribe: any;
  statistics: IStatistics[] = [];
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
