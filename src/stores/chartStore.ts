import { writable } from 'svelte/store';

export const showChartModal = writable<boolean>(false);

export default {
	subscribe: showChartModal.subscribe,
	set: showChartModal.set,
    update: showChartModal.update,
};
