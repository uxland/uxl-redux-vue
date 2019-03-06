import store from './store';
import { Dispatch, Action } from 'redux';
import { increment } from './actions';
export const incrementCommand = (dispatch: Dispatch<Action>) => () => dispatch(increment());
export const incrementAmount = (amount: number) => store.dispatch({ type: 'INCREMENT' });
export const decrementAmount = (amount: number) => store.dispatch({ type: 'DECREMENT' });
export const resetAmount = () => store.dispatch({ type: 'RESET' });
