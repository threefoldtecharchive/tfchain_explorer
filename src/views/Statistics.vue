<template>
  <Layout pageName="Statistics" v-if="statistics" :noFilter="true">
    <v-container>
      <section class="items" v-if="statistics.length > 0">
        <div v-for="item of statistics" :key="item.id">
          <StatisticsCard :item="item" />
        </div>
      </section>

      <section class="loader" v-if="statistics.length === 0">
        <v-progress-circular size="150" indeterminate />
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
  justify-content: center;
  > div {
    padding: 15px;
    width: 16.5%;

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

.loader {
  display: flex;
  justify-content: center;
  padding: 150px 0;
}
</style>
