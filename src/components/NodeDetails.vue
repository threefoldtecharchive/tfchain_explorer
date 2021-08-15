<template>
  <div class="text-center">
    <v-bottom-sheet
      v-model="open"
      inset
      persistent
      no-click-animation
      @click:outside="$emit('close-sheet')"
    >
      <v-sheet class="text-center" height="90vh">
        {{ node }}
      </v-sheet>
    </v-bottom-sheet>
  </div>
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
