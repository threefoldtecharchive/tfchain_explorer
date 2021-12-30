<template>
  <v-navigation-drawer fixed permanent app :mini-variant="mini">
    <v-list-item class="logo">
      <v-list-item-content class="logo__content">
        <img src="@/assets/logo.png" class="logo__image" />
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <v-list>
      <v-list-item
        link
        v-for="item in items"
        :key="item.title"
        :to="item.route"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider class="mt-10 mb-10" />
    <v-list v-if="!mini">
      <v-list-item
        v-for="version in versions"
        :key="version.name"
        style="min-height: 30px;"
      >
        <strong class="mr-2">{{ version.name }}</strong> {{ version.value }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ApiPromise, WsProvider } from '@polkadot/api';


interface IVersion {
  name: string;
  value: string;
}

@Component({})
export default class Sidebar extends Vue {
  @Prop({ required: true }) mini!: boolean;

  items = [
    { title: "Overview", icon: "mdi-monitor-dashboard", route: "/" },
    { title: "Nodes", icon: "mdi-resistor-nodes", route: "/nodes" },
    { title: "Farms", icon: "mdi-webpack", route: "/farms" },
  ];

  versions: IVersion[] = [
    {
      name: "Explorer",
      value: window.configs.version,
    },
  ];

  created() {
    // Construct
    const URL = window.configs.polkadot_url;
    
    const wsProvider = new WsProvider(URL);
    ApiPromise.create({ provider: wsProvider }).then((api) =>{
      api.query.system.lastRuntimeUpgrade().then(((result: any)=>{
       const {specName, specVersion} = (result?.toJSON() as {specName: string, specVersion: number})
       this.versions.push({name:"Chain", value:`${specName} v${specVersion}`})
      })).catch((err)=>
        console.log("something went wrong", err)
      );
    }
  );

    fetch(window.configs.proxy_url + "/version")
      .then<{ version: string }>((res) => res.json())
      .then(({ version: value }) => {
        this.versions.push({ name: "Grid Proxy", value });
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }
}
</script>

<style lang="scss" scoped>
.logo {
  min-height: 64px;

  &__content {
    justify-content: center;
    align-items: center;
  }

  &__image {
    flex: 0;
    width: 100%;
  }
}
</style>
