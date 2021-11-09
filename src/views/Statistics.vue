<style scoped>
.text-white {
  color: #ffffff;
}
.icon-card-size {
  font-size: 80px;
}
</style>
<template>
  <Layout pageName="Statistics" v-if="statistics" :noFilter="true">
    <v-row>
      <v-col
        v-for="item in statistics"
        :key="item.id"
        class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12"
      >
        <v-card class="mx-auto ma-3" color="#2196f3" max-width="440" dark>
          <div>
            <v-row class="ml-6">
              <!--Icon-->
              <v-col
                class="d-flex col-xl-3 col-lg-3 col justify-center align-center"
              >
                <div class="">
                  <v-icon class="icon-card-size">
                    {{ item.icon }}
                  </v-icon>
                </div>
              </v-col>
              <!--Data-Title-->
              <v-col class="col-xl-9 col-lg-9">
                <div class="pl-6 ml-4">
                  <!--Data-->
                  <div class="text-h3 font-weight-bold">
                    {{ item.data }}
                  </div>
                  <!--Title-->
                  <div class="d-flex align-center">
                    <span class="text-h4 text-white">{{ item.title }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
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
