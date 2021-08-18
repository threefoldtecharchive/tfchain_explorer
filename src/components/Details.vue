<template>
  <v-bottom-sheet
    v-model="open"
    persistent
    no-click-animation
    @click:outside="$emit('close-sheet')"
  >
    <v-sheet class="text-center" height="90vh">
      <div class="content ">
        <v-row>
          <v-col cols="12" v-if="node">
            <NodeDetails :node="node" />
          </v-col>

          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="farm"
          >
            <FarmDetails :farm="farm" />
          </v-col>
          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="country"
          >
            <CountryDetails :country="country" :city="city" />
          </v-col>
          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="country && location"
          >
            <LocationDetails :country="country" :location="location" />
          </v-col>

          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="twin"
          >
            <TwinDetails :twin="twin" />
          </v-col>

          <v-col
            :cols="
              screen_max_700.matches ? 12 : screen_max_1200.matches ? 6 : 4
            "
            v-if="config"
          >
            <PublicConfigDetails :config="config" />
          </v-col>
        </v-row>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import {
  ICity,
  ICountry,
  IFarm,
  ILocation,
  INode,
  IPublicConfig,
  ITwin,
} from "@/graphql/api";
import { Component, Prop, Vue } from "vue-property-decorator";
import CountryDetails from "./CountryDetails.vue";
import NodeDetails from "./NodeDetails.vue";
import FarmDetails from "./FarmDetails.vue";
import LocationDetails from "./LocationDetails.vue";
import TwinDetails from "./TwinDetails.vue";
import PublicConfigDetails from "./PublicConfigDetails.vue";
import mediaMatcher from "@/utils/mediaMatcher";

@Component({
  components: {
    CountryDetails,
    NodeDetails,
    FarmDetails,
    LocationDetails,
    TwinDetails,
    PublicConfigDetails,
  },
})
export default class Details extends Vue {
  @Prop({ required: true }) open!: boolean;
  @Prop() node?: INode;
  @Prop() farm?: IFarm;
  @Prop() country?: ICountry;
  @Prop() city?: ICity;
  @Prop() location?: ILocation;
  @Prop() twin?: ITwin;
  @Prop() config?: IPublicConfig;

  screen_max_1200 = mediaMatcher("(max-width: 1200px)");
  screen_max_700 = mediaMatcher("(max-width: 700px)");

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
