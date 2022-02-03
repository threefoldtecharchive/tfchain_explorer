<template>
    <div class="text-center mt-2">
        <v-pagination
          v-model="page"
          :length="length"
          :total-visible="7"
          :disabled="disabled"
          @input="$emit('next', page)"
          @next="$emit('next', page)"
          @previous="$emit('next', page)"
        ></v-pagination>
      </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'Paginator'
})
export default class Paginator extends Vue {
    @Prop({ required: true }) length!: number;
    @Prop({ required: false, default: false }) disabled!: boolean;
    page = 1;
}
</script>