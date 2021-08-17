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
        <NodeDetails :node="node" />
        <br />
        <br />
        <v-divider />

        <FarmDetails :farm="$store.getters.farm(node.farmId)" />
        <br />
        <br />
        <v-divider />
        <CountryDetails
          :country="$store.getters.country(node.countryId)"
          :city="$store.getters.city(node.cityId)"
        />

        <!-- <h2>Node Details</h2>
        <p>node - {{ node.nodeId }}</p>
        {{ node }}
        <hr />
        <p>
          node.farmId - {{ node.farmId }} - {{ $store.getters.farms.length }}
        </p>
        {{ $store.getters.farm(node.farmId) }}
        <hr />
        <p>
          node.twinId - {{ node.twinId }} - {{ $store.getters.twins.length }}
        </p>
        {{ $store.getters.twin(node.twinId) }}
        <hr />
        <CountryDetails :country="$store.getters.country(node.countryId)" />
        <hr />
        <p>
          node.cityId - {{ node.cityId }} - {{ $store.getters.cities.length }}
        </p>
        {{ $store.getters.city(node.cityId) }}
        <hr />
        <p>
          node.locationId - {{ node.locationId }} -
          {{ $store.getters.locations.length }}
        </p>
        {{ $store.getters.location(node.locationId) }}
        <hr />
        <p>
          node.publicConfigId - {{ node.publicConfigId }} -
          {{ $store.getters.publicConfigs.length }}
        </p>
        {{ $store.getters.publicConfig(node.publicConfigId) }}
        <hr /> -->
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import { INode } from "@/graphql/api";
import { Component, Prop, Vue } from "vue-property-decorator";
import CountryDetails from "./CountryDetails.vue";
import NodeDetails from "./NodeDetails.vue";
import FarmDetails from "./FarmDetails.vue";

@Component({
  components: {
    CountryDetails,
    NodeDetails,
    FarmDetails,
  },
})
export default class Details extends Vue {
  @Prop({ required: true }) open!: boolean;
  @Prop({ required: true }) node!: INode;
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
