<template>
  <v-expansion-panel>
    <v-expansion-panel-header disabled disable-icon-rotate>
      Item - {{ opened }}
      <template v-slot:actions>
        <v-checkbox
          class="shrink mr-0 mt-0"
          hide-details
          :value="open"
          @click="toggleOpen"
        />
      </template>
    </v-expansion-panel-header>
    <v-divider />
    <v-expansion-panel-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>
