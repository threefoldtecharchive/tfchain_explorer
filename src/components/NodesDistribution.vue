<template>
  <v-card flat class="container">
    <v-divider />
    <h2>Nodes Distribution</h2>
    <div @mousemove="controllTooltip($event)">
      <Map v-on:map-ref="onGetMapRef" />

      <div ref="tooltip" :style="'display: ' + display">
        <v-card class="tooltip">
          <p>{{ country }}</p>
          <p><span>Value:</span> {{ value || 0 }}</p>
        </v-card>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts">
import { ICountry, INode } from "@/graphql/api";
import { IState } from "@/store/state";
import { Component, Vue } from "vue-property-decorator";
import Map from "./Map.vue";
import iso3To2 from "country-iso-3-to-2";
import { createPopper, Instance } from "@popperjs/core/lib/popper-lite";

function generateGetBoundingClientRect(x = 0, y = 0) {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x,
  });
}

@Component({
  components: {
    Map,
  },
})
export default class NodesDistribution extends Vue {
  display: "none" | "block" = "none";
  country = "";
  value = "";

  map?: SVGElement;
  onGetMapRef(map: SVGElement) {
    this.map = map;
  }

  mounted() {
    const nodes = this.$store.state.data?.nodes;
    if (nodes) {
      return this._colorizeMap(nodes);
    }

    // using subscribe so avoid un-initalized state
    const unsubscribe = this.$store.subscribe((_, state: IState) => {
      this._colorizeMap(state.data?.nodes ?? []);
      unsubscribe();
    });
  }

  controllTooltip(e: MouseEvent) {
    // hide/show tooltip
    if (
      !this.map ||
      !this._instance ||
      !this._virtualElement ||
      !(e.target instanceof SVGPathElement)
    ) {
      return (this.display = "none");
    }
    this.display = "block";

    // extract data
    const { clientX: x, clientY: y, target } = e;
    this.country = target.getAttribute("title")!;
    this.value = target.getAttribute("data-value")!;

    this._virtualElement.getBoundingClientRect = generateGetBoundingClientRect(
      x,
      y - 10
    );
    this._instance.update();
  }

  private _colorizeMap(nodes: INode[]) {
    if (!this.map) return;

    const ids = nodes
      .map<ICountry>((n) => this.$store.getters.country(n.countryId))
      .filter((c) => !!c)
      .map((c) => iso3To2(c.code));

    const counter = {} as { [key: string]: number };
    for (const id of ids) {
      if (!counter[id]) {
        counter[id] = 0;
      }

      counter[id]++;
    }

    const max = Math.max(...Object.values(counter));

    // Range: [0, 1]
    // value / max = opacity
    // color = rgb(255 82 82)

    for (const key in counter) {
      const path = this.map.querySelector(`path[id='${key}']`);
      if (!path) continue;
      path.setAttribute("fill", `rgba(255, 82, 82, ${counter[key] / max})`);
      path.setAttribute("data-value", `${counter[key]}`);
    }

    this._createTooltip();
  }

  // tooltip main configs
  // using popper
  private _virtualElement?: {
    getBoundingClientRect: ReturnType<typeof generateGetBoundingClientRect>;
  };

  private _instance?: Instance;
  private _createTooltip() {
    if (!this.map) return;

    this._virtualElement = {
      getBoundingClientRect: generateGetBoundingClientRect(),
    };

    this._instance = createPopper(
      this._virtualElement,
      this.$refs.tooltip as any,
      {
        placement: "top",
      }
    );
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 50px;

  h2 {
    margin-top: 20px;
  }

  path:hover {
    fill: red;
  }
}

.tooltip {
  padding: 15px;
  border-radius: 5px;

  p {
    margin: 0;
    font-size: 20px;

    &:first-of-type {
      font-weight: bold;
    }
  }
}
</style>
