<template>
  <v-container>
    <v-list-item>
      <v-list-item-icon>
        <v-icon size="40" class="mr-2">mdi-webpack</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title style="font-size: 30px;">
          Farm Details
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            ID
          </v-list-item-title>
        </v-list-item-content>
        {{ farm.id }}
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Name
          </v-list-item-title>
        </v-list-item-content>
        {{ farm.name }}
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Version
          </v-list-item-title>
        </v-list-item-content>
        {{ farm.version }}
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Grid Version
          </v-list-item-title>
        </v-list-item-content>
        {{ farm.gridVersion }}
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Certification Type
          </v-list-item-title>
        </v-list-item-content>
        {{ farm.certificationType }}
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Created At
          </v-list-item-title>
        </v-list-item-content>
        {{ farm.createdAt | date }}
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Updated {{ farm.updatedAt ? "At" : "" }}
          </v-list-item-title>
        </v-list-item-content>
        <template v-if="farm.updatedAt">
          {{ farm.updatedAt | date }}
        </template>
        <template v-if="!farm.updatedAt">
          <v-icon color="red">
            mdi-close
          </v-icon>
        </template>
      </v-list-item>
      <v-divider />

      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Deleted {{ farm.deletedAt ? "At" : "" }}
          </v-list-item-title>
        </v-list-item-content>
        <template v-if="farm.deletedAt">
          {{ farm.deletedAt | date }}
        </template>
        <template v-if="!farm.deletedAt">
          <v-icon color="red">
            mdi-close
          </v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IFarm } from "@/graphql/api";

@Component({})
export default class FarmDetails extends Vue {
  @Prop({ required: true }) farm!: IFarm;
}
</script>
