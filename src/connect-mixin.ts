import { Store, Unsubscribe } from 'redux';
import Vue from 'vue';
import { Mixin } from 'vue-mixin-decorator';
import { VueClass } from 'vue-class-component/lib/declarations';
import { bind } from './bind';
import { unbind } from './unbind';

export type Selector<T = any> = (state: any) => T;
export interface ConnectAddOn {
  uxlReduxWatchedProperties: { [key: string]: PropertyWatch };
  reduxDefaultStore: Store;
  watchProperty: (name: PropertyKey, watch: PropertyWatch) => void;
}

export interface PropertyWatch {
  selector: Selector;
  store: Store;
  name: string;
}

export declare type MixinFunction<
  T1 extends VueClass<any> = VueClass<any>,
  T2 extends VueClass<Vue> = VueClass<Vue>
> = (superClass: T2) => VueClass<T1 & T2>;

export interface ReduxMixin extends VueClass<Vue> {}
export interface ReduxMixinConstructor extends VueClass<Vue> {
  new (...args: any[]): ReduxMixin & VueClass<Vue>;
}
export type ReduxMixinFunction = MixinFunction<ReduxMixinConstructor>;

export const connect: (store: Store<any>) => ReduxMixinFunction = (store: Store<any, any>) => (
  superClass: VueClass<Vue>
) => {
  @Mixin
  class connectMixin extends superClass {
    __reduxStoreSubscriptions__!: Unsubscribe[];

    static get reduxDefaultStore(): Store | undefined {
      return store;
    }

    created() {
      bind(this);
      //@ts-ignore
      if (super.created) super.created();
    }

    destroyed() {
      unbind(this);
      //@ts-ignore
      if (super.destroyed) super.destroyed();
    }
  }

  return <any>connectMixin;
};
