import { combineReducers, Action, Reducer, applyMiddleware, Store, compose } from 'redux';
import { actionNameBuilder } from './action-name-builder';
import thunk from 'redux-thunk';

export const DISCONNECT_ACTION = actionNameBuilder('disconnect');

let reducersDictionary: ReducerDictionary = {};
export type ReducerDictionary = { [key: string]: Reducer };
export const createReducer = (reducers: ReducerDictionary = {}) => {
  const mainReducer = combineReducers(reducers);
  return (state: any, action: Action) => mainReducer(action.type === DISCONNECT_ACTION ? {} : state, action);
};

export const addMiddlewares = (middlewares: any[] = []) => {
  const middleware = [thunk, ...middlewares];
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const enhancer = composeEnhancers(applyMiddleware(...middleware));
  return enhancer;
};

export const disconnect = (store: Store<any, any>) => {
  store.replaceReducer(createReducer());
  store.dispatch({ type: DISCONNECT_ACTION });
};
export const injectReducer = (store: Store<any, any>, name: string, reducer: Reducer<any, any>) => {
  reducersDictionary[name] = reducer;
  store.replaceReducer(createReducer(reducersDictionary));
};
export const resetReducers = (store: Store<any, any>) => {
  reducersDictionary = {};
  store.replaceReducer(createReducer());
};
