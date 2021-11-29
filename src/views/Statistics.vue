<template>
  <Layout pageName="Statistics" v-if="statistics" :noFilter="true">
    <v-container>
      <section class="items">
        <div v-for="item of statistics" :key="item.id">
          <StatisticsCard :item="item" />
        </div>
      </section>
    </v-container>
  </Layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IStatistics } from "@/store/getters";
import Layout from "@/components/Layout.vue";
import StatisticsCard from "@/components/StatisticsCard.vue";

@Component({
  name: "Statistics",
  components: {
    Layout,
    StatisticsCard,
  },
})
export default class Statistics extends Vue {
  get statistics(): IStatistics[] {
    return this.$store.getters.statistics;
  }
}
</script>

<style lang="scss" scoped>
.items {
  display: flex;
  flex-wrap: wrap;

  > div {
    padding: 15px;
    width: 25%;

    @media (max-width: 1910px) {
      width: calc(100% / 3);
    }

    @media (max-width: 1270px) {
      width: 50%;
    }

    @media (max-width: 800px) {
      width: 100%;
    }
  }
}
</style>
