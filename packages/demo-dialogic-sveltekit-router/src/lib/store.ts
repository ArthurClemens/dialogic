import { writable } from 'svelte/store';

export const email = writable('allan@company.com');
export const counter = writable(0);
export const increment = () => counter.update((n) => n + 1);
