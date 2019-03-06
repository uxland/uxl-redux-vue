<template>
  <div>
    <redux-component></redux-component>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ReduxComponent from './ReduxComponent.vue';

@Component({
  components: { ReduxComponent },
})
export default class App extends Vue {
  @Prop()
  msg!: string;
}
</script>
