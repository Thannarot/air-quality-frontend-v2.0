<script>
	import { onMount, onDestroy, setContext } from "svelte";
	import mapboxgl from "mapbox-gl";
	import { contextKey } from "../Maps/mapbox";
	
	setContext(contextKey, {
		getMap: () => map
	}); 


	let map;
	let mapContainer;
	let lng, lat, zoom;

	

	mapboxgl.accessToken = "pk.eyJ1Ijoicm9iaW5rb2hycyIsImEiOiJjanU5am95bm4xZnZ6NDNrOTRyYTYwdzJzIn0.iMFQgQIlhz36wB3819Xftw";
	lng = 100.224518;
	lat = 14.213995;
	zoom = 4;

	function updateData() {
    	zoom = map.getZoom();
    	lng = map.getCenter().lng;
    	lat = map.getCenter().lat;
    }

	onMount(() => {
		const initialState = { lng: lng, lat: lat, zoom: zoom };

		map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/light-v11',
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
		});

		map.on('move', () => {
			updateData();
		})
	});

	onDestroy(() => {
		map.remove();
	});

export function getMap() {
    return map;
  }

</script>

<div class="relative w-full h-screen" bind:this={mapContainer} ></div>