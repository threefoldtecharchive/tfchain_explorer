<template>
  <v-container>
    <v-list-item>
      <v-list-item-icon>
        <v-icon size="40" class="mr-2">mdi-map-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title style="font-size: 30px;">
          Country Details
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list width="300">
      <!-- Flag Item -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Flag
          </v-list-item-title>
        </v-list-item-content>
        <img :src="src" alt="flag" width="40" />
      </v-list-item>
      <v-divider />

      <!-- Name Item -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Name
          </v-list-item-title>
        </v-list-item-content>
        {{ country.name }}
      </v-list-item>
      <v-divider />

      <!-- Region Item -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Region
          </v-list-item-title>
        </v-list-item-content>
        {{ country.region }}
      </v-list-item>
      <v-divider />

      <!-- Subregion Item -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Subregion
          </v-list-item-title>
        </v-list-item-content>
        {{ country.subregion }}
      </v-list-item>
      <v-divider />

      <!-- CODE ISO 3 Item -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Code ISO 3
          </v-list-item-title>
        </v-list-item-content>
        {{ country.code }}
      </v-list-item>
      <v-divider />

      <!-- CODE ISO 3 Item -->
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Code ISO 2
          </v-list-item-title>
        </v-list-item-content>
        {{ iso2Code }}
      </v-list-item>

      <!-- City Item -->
      <template v-if="city">
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              City
            </v-list-item-title>
          </v-list-item-content>
          {{ city.name }}
        </v-list-item>
      </template>
      <!-- line -->
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ICity, ICountry } from "@/graphql/api";
import iso3To2 from "country-iso-3-to-2";

@Component({})
export default class CountryDetails extends Vue {
  @Prop({ required: true }) country!: ICountry;
  @Prop({ required: false }) city?: ICity;

  get iso2Code(): string {
    return iso3To2(this.country.code);
  }

  get src(): string {
    const code: string = this.iso2Code.toLocaleLowerCase();
    return `https://www.worldatlas.com/r/w425/img/flag/${code}-flag.jpg`;
  }
}
</script>
