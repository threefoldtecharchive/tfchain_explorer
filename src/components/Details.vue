<template>
  <v-bottom-sheet
    v-model="open"
    inset
    persistent
    no-click-animation
    @click:outside="$emit('close-sheet')"
  >
    <v-sheet class="text-center" height="90vh" v-if="node">
      <div class="content container">
        <template v-if="node">
          <NodeDetails :node="node" />

          <br />
          <br />
          <v-divider />
          <br />
        </template>

        <template v-if="farm || country || location">
          <v-row>
            <v-col cols="4" v-if="farm">
              <FarmDetails :farm="farm" />
            </v-col>
            <v-col cols="3" v-if="country">
              <CountryDetails :country="country" :city="city" />
            </v-col>
            <v-col cols="5" v-if="country && location">
              <LocationDetails :country="country" :location="location" />
            </v-col>
          </v-row>
          <br />
          <br />
          <v-divider />
        </template>

        <v-row v-if="twin || config">
          <v-col cols="6" v-if="twin">
            <TwinDetails :twin="twin" />
          </v-col>

          <v-col cols="6" v-if="config">
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
}
</script>
<style lang="scss" scoped>
.content {
  text-align: left;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  padding-top: 2rem;
  padding-bottom: 3rem;
}
</style>
