<template>
  <v-bottom-sheet
    v-model="open"
    persistent
    no-click-animation
    @click:outside="$emit('close-sheet')"
  >
    <v-sheet class="text-center" height="90vh">
      <div class="content" v-if="!loading">
        <v-row>
          <!-- <v-col v-if="node">
            <NodeUsedResources :node="node" />
          </v-col>
        </v-row>
        <v-row>
          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="node"
          >
            <NodeDetails :node="node" />
          </v-col> -->

          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="data.farm"
          >
            <FarmDetails :farm="data.farm" />
          </v-col>

          <!-- <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="country && location"
          >
            <LocationDetails :country="country" :location="location" />
          </v-col> -->

          <!-- <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="config"
          >
            <PublicConfigDetails :config="config" />
          </v-col> -->

          <!-- <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="country"
          >
            <CountryDetails
              :country="country"
              :city="city"
              :location="location"
            />
          </v-col> -->

          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="data.twin"
          >
            <TwinDetails :twin="data.twin" />
          </v-col>

          <!-- <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="node && node.interfaces"
          >
            <InterfacesDetails :interfaces="node.interfaces" />
          </v-col> -->
        </v-row>
      </div>
      <div v-if="loading" class="pt-10">
        <v-progress-circular indeterminate color="primary" :size="100" />
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import CountryDetails from "./CountryDetails.vue";
import NodeDetails from "./NodeDetails.vue";
import FarmDetails from "./FarmDetails.vue";
import LocationDetails from "./LocationDetails.vue";
import TwinDetails from "./TwinDetails.vue";
import PublicConfigDetails from "./PublicConfigDetails.vue";
import InterfacesDetails from "./InterfacesDetails.vue";
import NodeUsedResources from "./NodeUsedResources.vue";
import mediaMatcher from "@/utils/mediaMatcher";
import { DocumentNode } from "graphql";

@Component({
  components: {
    CountryDetails,
    NodeDetails,
    FarmDetails,
    LocationDetails,
    TwinDetails,
    PublicConfigDetails,
    InterfacesDetails,
    NodeUsedResources,
  },
})
export default class Details extends Vue {
  @Prop({ required: true }) open!: boolean;
  @Prop({ required: true }) query!: DocumentNode;
  @Prop({ required: true }) variables!: { [key: string]: any };

  loading = false;

  data: any = {};

  screen_max_1200 = mediaMatcher("(max-width: 1200px)");
  screen_max_700 = mediaMatcher("(max-width: 700px)");

  @Watch("open", { immediate: true })
  onOpenChange() {
    if (!this.open) return;

    this.loading = true;

    const { query, variables } = this;
    console.log({ query, variables });

    this.$apollo
      .query({ query, variables })
      .then(({ data }) => {
        this.data = Object.keys(data).reduce((res, key) => {
          res[key] = res[key][0];
          return res;
        }, data);
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  destroyed() {
    this.screen_max_1200.destry();
    this.screen_max_700.destry();
  }
}
</script>
<style lang="scss" scoped>
.content {
  text-align: left;
  overflow-x: hidden;
  overflow-y: auto;
  will-change: transform;
  height: 100%;
  padding: 20px;
}
</style>
