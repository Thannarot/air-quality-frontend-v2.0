import { writable } from 'svelte/store';
export const baseMapStyle = writable('');
export const pcdshow = writable<boolean>(false);
export const selectedProduct = writable('');
export const selectedPollutant = writable('');
export const selectedProductLayer = writable('');

export const selectedStation = writable('');
export const selectedFire = writable('');
export const ShowStation = writable<boolean>(false);
export const ShowPollutant = writable<boolean>(false);
export const ShowFire = writable<boolean>(false);
export const ShowMapSetting = writable<boolean>(false);
export const ShowPollutantSelect = writable<boolean>(false);
export const ShowBottomDrawer = writable<boolean>(false);
export const ShowWindCanvas = writable<boolean>(false);
// export const ShowStatistic = writable<boolean>(false);
export const drawCoords = writable('');
export const drawType = writable('');

export const ShowStatistic =  writable('');
export const hiddenDrawer = writable<boolean>(false);
export const hiddenBottomDrawer = writable<boolean>(false);

export const locx = writable('');
export const locy = writable('');
export const locname = writable('');
export const selectOptions = writable([{
	value: 'BC_DNN_PM25',
	name: 'PM2.5'
}])








