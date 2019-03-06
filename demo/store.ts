import { createStore } from 'redux';
import { counter } from './reducer';
const store = createStore(
  counter,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
