import pipe from 'ramda/es/pipe';
import values from 'ramda/es/values';
import uniq from 'ramda/es/uniq';
import map from 'ramda/es/map';
import propEq from 'ramda/es/propEq';
import filter from 'ramda/es/filter';
import equals from 'ramda/es/equals';
import reject from 'ramda/es/reject';
import { Store, Unsubscribe } from 'redux';
import { PropertyWatch } from './connect-mixin';
import { getWatchedProperties } from './watched-redux-property';

const nop = () => {};

const mapWatches = (watchesMap: { [key: string]: PropertyWatch }) => values(watchesMap);
const getWatchesByStore: (store: Store) => (watches: PropertyWatch[]) => PropertyWatch[] = store =>
  filter<PropertyWatch>(propEq('store', store));
interface PropertyState {
  name: string;
  current: any;
  old?: any;
}
const getProperties = (state: any, element: any) =>
  map<PropertyWatch, PropertyState>((x: any) => ({
    name: x.name,
    old: element[x.name],
    current: x.selector.call(element, state)
  }));
const rejectUnchanged: (changes: PropertyState[]) => PropertyState[] = reject<PropertyState>((x: PropertyState) =>
  equals(x.old, x.current)
);
const updateProperties = (element: any) =>
  map<PropertyState, void>((change: any) => {
    element[change.name] = change.current;
    if (element.requestUpdate) element.requestUpdate(change.name, change.old).then(nop);
  });
const getStoreWatches = (element: any) => (store: Store<any, any>) =>
  pipe(
    getWatchedProperties,
    mapWatches,
    getWatchesByStore(store)
  )(element);
const listen = (element: any, store: Store) => {
  const watches = getStoreWatches(element)(store);
  return () =>
    pipe(
      getProperties(store.getState(), element),
      rejectUnchanged,
      updateProperties(element),
      nop
    )(watches);
};
const listener = (element: any) => (store: Store) => store.subscribe(listen(element, store));

const getAllStores = (watches: { [key: string]: PropertyWatch }) => uniq(map((x: any) => x.store, values(watches)));

const subscribe = (element: any) => map<Store, Unsubscribe>(listener(element));

const storeSubscriptions = (element: any) => (subscriptions: Unsubscribe[]) =>
  Object.defineProperty(element, '__reduxStoreSubscriptions__', {
    get(): Unsubscribe[] {
      return subscriptions;
    },
    configurable: true,
    enumerable: true
  });
const initializeValues = (element: any) => (stores: Store<any, any>[]) => {
  const storeWatches = map(getStoreWatches(element), stores);
  storeWatches.forEach((value: any) => {
    value.forEach((x: any) => (element[x.name] = x.selector.call(element, x.store.getState())));
  });
  return stores;
};
export const bind: (element: any) => void = element =>
  pipe(
    getWatchedProperties,
    getAllStores,
    initializeValues(element),
    subscribe(element),
    storeSubscriptions(element),
    nop
  )(element);
