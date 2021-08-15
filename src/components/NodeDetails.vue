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
        <h2>Node Details</h2>

        <p>ID: {{ node.id }}</p>
        <p>Version: {{ node.version }}</p>
        <p>GridVersion: {{ node.gridVersion }}</p>
        <p>NodeID: {{ node.nodeId }}</p>
        <p>FarmID: {{ node.farmId }}</p>
        <p>TwinID: {{ node.twinId }}</p>
        <p>CountryID: {{ node.countryId }}</p>
        <p>CityID: {{ node.cityId }}</p>
        <p>CreatedById: {{ node.createdById }}</p>
        <p>LocationId: {{ node.locationId }}</p>
        <p>PublicConfigId: {{ node.publicConfigId }}</p>
        <p>CreatedAt: {{ node.createdAt }}</p>
        <p>UpdatedAt: {{ node.updatedAt }}</p>
        <p>DeletedAt: {{ node.deletedAt }}</p>
        <p>HRU: {{ node.hru }}</p>
        <p>SRU: {{ node.sru }}</p>
        <p>CRU: {{ node.cru }}</p>
        <p>MRU: {{ node.mru }}</p>
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script lang="ts">
import { NodeModel } from "@/graphql/node";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class NodeDetails extends Vue {
  @Prop({ required: true }) open!: boolean;
  @Prop({ required: true }) node!: NodeModel;
}
</script>
<style lang="scss" scoped>
.content {
  text-align: left;
}
</style>
