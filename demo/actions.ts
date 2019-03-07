import { isAsyncStateStale } from '../src/is-async-stale';

console.log(isAsyncStateStale);

export function increment() {
  return { type: 'INCREMENT' };
}

export function decrement() {
  return { type: 'DECREMENT' };
}

export function reset() {
  return { type: 'RESET' };
}
