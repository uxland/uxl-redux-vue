import lensPath from 'ramda/es/lensPath';
import view from 'ramda/es/view';
import when from 'ramda/es/when';
import is from 'ramda/es/is';
import isNil from 'ramda/es/isNil';
import { Store } from 'redux';
import always from 'ramda/es/always';
import { ConnectAddOn, Selector } from './connect-mixin';
import { createWatchedReduxProperty } from './watched-redux-property';
const toLensSelector = (path: string) => view(lensPath(path.split('.')));
const getSelector = (selector: Selector | string) => when<any, Selector>(is(String), toLensSelector)(selector);
const getStore = (store: Store, proto: any) =>
  when(isNil, always((proto.constructor as ConnectAddOn).reduxDefaultStore))(store);
export interface WatchOptions {
  name?: string;
  selector?: Selector | string;
  store?: Store<any, any>;
}

export const watch = <T = any>(selector: Selector<T> | string, options: WatchOptions = {}) => (
  proto: any,
  name: PropertyKey
) => {
  createWatchedReduxProperty(
    { name: String(name), selector: getSelector(selector), store: getStore(options.store as Store<any, any>, proto) },
    proto,
    String(name)
  );
};
