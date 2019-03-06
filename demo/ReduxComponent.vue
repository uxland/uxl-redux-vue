<template>
  <div>
    <h1>Counter using vuejs-redux</h1>
    <div>{{ counterValue }}</div>
    <button @click="increment()">increment</button>
    <button @click="decrement()">decrement</button>
    <button @click="reset()">reset</button>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { Prop, Component } from 'vue-property-decorator';
import {
  incrementAmount,
  decrementAmount,
  resetAmount,
  incrementCommand,
} from './commands';
import { Dispatch, Action } from 'redux';
import { watch } from '../src/watch';
import store from './store';
import { connect } from '../src/connect-mixin';

const counterSelector = (state: any) => state;

@Component
export default class ReduxComponent extends connect(store)(Vue) {
  @watch(counterSelector, { store })
  counterValue: number = 0;

  increment() {
    incrementAmount(0);
  }

  decrement() {
    decrementAmount(0);
  }

  reset() {
    resetAmount();
  }
}
</script>
