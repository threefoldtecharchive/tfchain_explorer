<template>
  <v-card flat>
    <v-list-item>
      <v-list-item-icon>
        <v-icon size="40" class="mr-2">mdi-google-maps</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title style="font-size: 30px;">
          Location Details
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <Map v-on:map-ref="onGetMapRef" />
  </v-card>
</template>

<script lang="ts">
import { ICountry, ILocation } from "@/graphql/api";
import { Component, Prop, Vue } from "vue-property-decorator";
import iso3To2 from "country-iso-3-to-2";
import Map from "./Map.vue";

@Component({
  components: {
    Map,
  },
})
export default class LocationDetails extends Vue {
  @Prop({ required: true }) location!: ILocation;
  @Prop({ required: true }) country!: ICountry;

  onGetMapRef(map: SVGElement) {
    const country = map.querySelector(
      "[id=" + iso3To2(this.country.code) + "]"
    );
    if (country) {
      country.setAttribute("fill", "#ff5252");
    }
  }
}
</script>
