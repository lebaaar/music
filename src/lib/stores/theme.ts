import { writable } from 'svelte/store';
import { Theme } from '$lib/enums/theme';

export const theme = writable<Theme>(Theme.Light);