<template>
  <v-card class="item">
    <h4 class="display-1">{{ item.title }}</h4>
    <div class="item__img">
      <v-icon size="100">
        {{ item.icon }}
      </v-icon>
    </div>
    <v-divider />
    <p class="display-2 item__data">
      {{ item.data }}
    </p>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IStatistics } from "@/store/getters";

@Component({
  name: "StatisticsCard",
})
export default class StatisticsCard extends Vue {
  @Prop({ required: true }) item!: IStatistics;
}
</script>

<style lang="scss" scoped>
.item {
  text-align: center;
  padding: 15px;

  &__img {
    padding: 15px;
  }

  &__data {
    font-weight: bold;
    margin-top: 15px;
  }
}
</style>
