<script type="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { PUBLIC_BASE_API_URL, PUBLIC_BASE_WIND_URL, PUBLIC_BASE_WMS_URL, PUBLIC_BASE_FRIMS_WMS_URL } from '$env/static/public'
	import mapboxgl from 'mapbox-gl';
	import MapboxDraw from '@mapbox/mapbox-gl-draw';
	import { contextKey } from '../Maps/mapbox';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import '../../../node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
	import axios from 'axios';

	import {
		forecastedTime,
		forecastedDate,
		PollutantTileUrl,
		intializationDate
	} from '../../stores/dateTimeStore';
	import {
		baseMapStyle,
		selectedProduct,
		selectedPollutant,
		selectedFire,
		ShowStation,
		ShowPollutant,
		ShowFire,
		drawCoords,
		drawType,
		selectedProductLayer
	} from '../../stores/app';

	// helpers
	import { clearLayer, clearSource } from '../../helpers/MapFunctions.js';

	export let map;
	export let Draw;
	let mapContainer;
	let lng, lat, zoom;
	let popup;

	let windy;
	let timeout;
	let mapMarkers = [];
	let currentFire = '';
	let pollutantMap;

	setContext(contextKey, {
		getMap: () => map,
		getMapBoxDraw: () => Draw
	});

	mapboxgl.accessToken = 'pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g'; 
	lng = 105.224518;
	lat = 11.113995;
	zoom = 4;

	
	function updateData() {
		zoom = map.getZoom();
		lng = map.getCenter().lng;
		lat = map.getCenter().lat;
	}

	function addTileMap(pollutant, prod) {
		console.log('addTileMap')
		console.log($selectedPollutant)
		console.log($selectedProduct)
		console.log($selectedProductLayer)
		setTimeout(() => {
			// Always remove the layer first to avoid an error
			clearLayer(map, 'wms-layer');
			clearSource(map, 'wms-source');

			const initDate = $intializationDate.replace('-', '').replace('-', '');
			console.log('Initialization Date', initDate);

			if (pollutant === 'pm25') {
				if (prod === 'geos') {
					// console.log('geos ', $selectedProductLayer)
					// $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/geos/${initDate}.nc?service=WMS&request=GetMap&layers=BC_MLPM25&styles=default-scalar%2Fdiv-Spectral-inv&format=image%2Fpng&transparent=true&version=1.3.0&time=${$forecastedDate}T${$forecastedTime.replace('h', '')}:30:00Z&colorscalerange=0%2C100&abovemaxcolor=extend&belowmincolor=extend&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`;
					$PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${initDate}.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image%2Fpng
					&transparent=true
					&version=1.3.0
					&time=${$forecastedDate}T${$forecastedTime.replace('h', '')}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`

				} else if (prod === 'geos5') {
					$PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/20230507.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image/png;mode=32bit
					&transparent=true
					&version=1.3.0
					&time=2023-05-7T${$forecastedTime.replace('h', '')}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`;
				}
			}
			if (pollutant === 'no2') {
				$PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/GEMS_NO2_20240228_0645_FC_SERVIRSEA.nc?service=WMS
				&request=GetMap
				&layers=${$selectedPollutant}
				&styles=default-scalar%2Fno2
				&format=image%2Fpng
				&transparent=true
				&version=1.3.0
				&colorscalerange=0%2C5
				&abovemaxcolor=extend
				&belowmincolor=extend
				&width=256&height=256
				&crs=EPSG:3857
				&bbox={bbox-epsg-3857}`;
			}

			map.addSource('wms-source', {
				type: 'raster',
				tiles: [$PollutantTileUrl],
				tileSize: 256
			});
				map.addLayer(
					{
						id: 'wms-layer',
						name: 'wms-layer',
						type: 'raster',
						source: 'wms-source',
						paint: {}
					},
					'building' // Place layer under labels, roads and buildings.
				);


			map.setPaintProperty('wms-layer', 'raster-opacity', 0.7);

			let layers = map.getStyle().layers;
			let layerIds = layers.map((l) => l.id);
			
			// if there is fire layer showing on the map
			if(layerIds.includes('fire-wms-layer')){
				console.log('fire layer active')
				// set map layer order by showing fire layer on top of pollutant map layer
				map.moveLayer('wms-layer', 'fire-wms-layer');
			}


			}, 200);
	}

	function addFireTileMap(layername) {
		currentFire = layername;
		setTimeout(() => {
			// Always remove the layer first to avoid an error
			clearLayer(map, 'fire-wms-layer');
			clearSource(map, 'fire-wms-source');

			const initDate = $intializationDate.replace('-', '').replace('-', '');
			console.log('Initialization Date', initDate);

			let firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserve/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=fires_viirs_24&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;

			if (layername === 'fires_viirs_24') {
				firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=${layername}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;

			}
			else if ( layername === 'fires_viirs_48') {
				firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=${layername}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;

			}
			else if (layername === 'fires_viirs_time'){
				
				firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=fires_viirs&TIME=${$forecastedDate}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;

			}
			map.addSource('fire-wms-source', {
				type: 'raster',
				tiles: [firetileurl],
				tileSize: 512
			});

			map.addLayer(
				{
					id: 'fire-wms-layer',
					type: 'raster',
					source: 'fire-wms-source',
					paint: {}
				},
				'building' // Place layer under labels, roads and buildings.
			);
			map.setPaintProperty('fire-wms-layer', 'raster-opacity', 0.8);
		}, 200);
	}

	function updateTileMap(pollutant, prod) {
		console.log('updateTileMap')
		setTimeout(() => {
			const initDate = $intializationDate.replace('-', '').replace('-', '');
			if (pollutant === 'pm25') {
				if (prod === 'geos') {
					// console.log('geos ', $selectedProductLayer)
					// $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/geos/${initDate}.nc?service=WMS&request=GetMap&layers=BC_MLPM25&styles=default-scalar%2Fdiv-Spectral-inv&format=image%2Fpng&transparent=true&version=1.3.0&time=${$forecastedDate}T${$forecastedTime.replace('h', '')}:30:00Z&colorscalerange=0%2C100&abovemaxcolor=extend&belowmincolor=extend&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}`;
					$PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${initDate}.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image%2Fpng
					&transparent=true
					&version=1.3.0
					&time=${$forecastedDate}T${$forecastedTime.replace('h', '')}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`

				} else if (prod === 'geos5') {
					$PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/20230507.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image/png;mode=32bit
					&transparent=true
					&version=1.3.0
					&time=2023-05-7T${$forecastedTime.replace('h', '')}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`;

				}
			}
			if (pollutant === 'no2') {
				$PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/GEMS_NO2_20240228_0645_FC_SERVIRSEA.nc?service=WMS
				&request=GetMap
				&layers=${$selectedProductLayer}
				&styles=default-scalar%2Fno2
				&format=image%2Fpng
				&transparent=true
				&version=1.3.0
				&colorscalerange=0%2C5
				&abovemaxcolor=extend
				&belowmincolor=extend
				&width=256&height=256
				&crs=EPSG:3857
				&bbox={bbox-epsg-3857}`;
			}
			map.getSource('wms-source').setTiles([$PollutantTileUrl]);
		}, 200);
	}

	function removeDrawFeature() {
		const data = Draw.getAll();
		var pids = [];
		const lid = data.features[data.features.length - 1].id;
		data.features.forEach((f) => {
			if (f.id !== lid) {
				pids.push(f.id);
			}
		});
		Draw.delete(pids);
	}

	function resetWind(map) {
		const obj = getEventObject(map);
		const { zoomLevel, north, south, west, east, width, height } = obj;
		mapcanvas.style.display = 'none';

		if (windy) {
			windy.stop();
		}

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(function () {
			let particleWidth = 3;
			if (zoomLevel > 2) {
				particleWidth = 4;
			}
			if (zoomLevel > 3) {
				particleWidth = 4.5;
			}
			if (zoomLevel > 4) {
				particleWidth = 4.7;
			}
			if (zoomLevel > 5) {
				particleWidth = 4.8;
			}
			if (zoomLevel > 6) {
				particleWidth = 5;
			}
			mapcanvas.style.display = 'initial';
			mapcanvas.width = width;
			mapcanvas.height = height;
			windy.start(
				[
					[0, 0],
					[width, height]
				],
				width,
				height,
				[
					[west, south],
					[east, north]
				],
				{ particleLineWidth: particleWidth, zoomLevel: zoomLevel}
			);
		}, 500);
	}

	function getEventObject(map) {
		const canvas = map.getCanvas();
		const dimensions = map.getBounds();

		const result = {
			width: canvas.width,
			height: canvas.height,
			north: dimensions.getNorth(),
			south: dimensions.getSouth(),
			west: dimensions.getWest(),
			east: dimensions.getEast(),
			zoomLevel: map.getZoom()
		};
		return result;
	}
			
	onMount(() => {
		const initialState = { lng: lng, lat: lat, zoom: zoom };
		map = new mapboxgl.Map({
			container: mapContainer,
			// style: 'mapbox://styles/servirmekong/ckebgnyea0s8219ki3dfp8von',
			// style: 'mapbox://styles/servirmekong/ckb2mbm240t2s1itc1dtmk5pf',
			// style: 'mapbox://styles/servirmekong/cltinohfj002101pc7cut13aj', 
			style: 'mapbox://styles/servirmekong/cltiptdlg004y01ph1rm84xru', 
			zoom: initialState.zoom,
			center: [initialState.lng, initialState.lat],
			maxBounds: [
				[-180, -60], // Southwest coordinates
				[180, 70] // Northeast coordinates
			]
		});
		 // Add zoom and rotation controls to the map.
		 const navigationControlOptions = {
			showCompass: false,
			};
		map.addControl(new mapboxgl.NavigationControl(navigationControlOptions), 'bottom-right');

		// Draw = new MapboxDraw();
		// map.addControl(Draw, 'top-right');

		// map.on('draw.create', function (e) {
		// 	// removeDrawFeature();
		// 	const coords = e.features[0].geometry.coordinates;
		// 	if (coords.length === 2) {
		// 		$drawCoords = coords.toString();
		// 		$drawType = 'Point';
		// 	} else {
		// 		$drawCoords = JSON.stringify(coords[0]);
		// 		$drawType = 'Polygon';
		// 	}
		// });


		map.on('click', 'wms-layer',  (e) => {

			if(mapMarkers.length > 0){
				// removing
				mapMarkers.forEach((marker) => marker.remove())
				mapMarkers = []
			}else {
			// removing
			mapMarkers.forEach((marker) => marker.remove())
			mapMarkers = []

			let lngLat = e.lngLat;
			const monument = [lngLat.lng.toFixed(3), lngLat.lat.toFixed(3)];

			$drawCoords = monument.toString();
			$drawType = 'Point';

			// create the popup
			popup = new mapboxgl.Popup({ offset: 5, className: 'mapboxgl-popup-close-button' }).setText(
				'Lat: '+ lngLat.lat.toFixed(3) + ' Lon: '+ lngLat.lng.toFixed(3)
			);

			// create DOM element for the marker
			const el = document.createElement('div');
			el.id = 'marker';

			// create the marker
			const marker = new mapboxgl.Marker(el)
				.setLngLat([lngLat.lng, lngLat.lat])
				.setPopup(popup) // sets a popup on this marker
				.addTo(map).togglePopup();

			mapMarkers.push(marker);	
			}

			let btnPopupClose = document.querySelectorAll('.mapboxgl-popup-close-button');
			let btnPopupRemove = Array.from(btnPopupClose)[0]
			btnPopupRemove.addEventListener('click', function (e) {
				popup.remove();
				mapMarkers.forEach((marker) => marker.remove());
				mapMarkers = [];
			});
			

		});

		map.on('draw.modechange', (e) => {
			removeDrawFeature();
		});

		map.on('draw.update', function (e) {
			// Draw.deleteAll()
			// This will call once you edit drawn polygon
		});

		map.on('draw.delete', function (e) {
			console.log('delete');
		});

		map.on('move', () => {
			updateData();
			resetWind(map);
		});

		map.on('resize', (e) => {
			resetWind(map);
		});

		// get wind map
		fetch(PUBLIC_BASE_WIND_URL)
			.then((d) => d.json())
			.then((data) => {
				console.log(data);
				// Remember - dom elements with ID, are exposed globally, so mapcanvas element exists already
				windy = new Windy({ canvas: mapcanvas, data: data });
				resetWind(map);
			});
	});

	$: if ($intializationDate !== '') {
		addTileMap($selectedPollutant, $selectedProduct);
	}

	// call tile map layer when date and time were selected
	$: if ($forecastedDate !== '' && $forecastedTime !== '' && $intializationDate !== '' && map.getLayer('wms-layer')) {
		updateTileMap($selectedPollutant, $selectedProduct);
	}

	// call tile map layer when products is changed
	$: if ($selectedProductLayer && $intializationDate !== '' && map.getLayer('wms-layer')) {
		updateTileMap($selectedPollutant, $selectedProduct);
	}


	$: if ($baseMapStyle !== '') {
		let layers = map.getStyle().layers;
		let layerIds = layers.map((l) => l.id);
		map.setStyle('mapbox://styles/servirmekong/' + $baseMapStyle);
		setTimeout(()=>{
			if(layerIds.includes('wms-layer')){
				addTileMap($selectedPollutant, $selectedProduct);
			}
			// if there is fire layer showing on the map
			if(layerIds.includes('fire-wms-layer')){
				addFireTileMap($selectedFire);
			}
		},50)
	}

	$: if (map && $ShowFire == false && map.getLayer('fire-wms-layer')) {
		clearLayer(map, 'fire-wms-layer');
		clearSource(map, 'fire-wms-source');
		// map.setPaintProperty('fire-wms-layer', 'raster-opacity', 0);
	}
	$: if (map && $ShowFire == true && !map.getLayer('fire-wms-layer')) {
		addFireTileMap($selectedFire);
	}

	$: if ($selectedFire !== currentFire && map && $ShowFire == true) {
		addFireTileMap($selectedFire);
	}

	$: if (map && $ShowFire == true && map.getLayer('fire-wms-layer')) {
		map.setPaintProperty('fire-wms-layer', 'raster-opacity', 0.9);
	}

	
	$: if (map && $ShowStation == false) {
		clearLayer(map, 'station-point');
		clearLayer(map, 'marker-text');
		clearSource(map, 'station-data');
	}

	$: if (map && $ShowPollutant == false) {
		// clearLayer(map, 'wms-layer');
		// clearSource(map, 'wms-source');
		map.setPaintProperty('wms-layer', 'raster-opacity', 0);
	}

	$: if (map && $ShowPollutant == true && map.getLayer('wms-layer')) {
		console.log('ShowPollutant ture', $selectedPollutant, $selectedProduct)
		map.setPaintProperty('wms-layer', 'raster-opacity', 0.7);
	}
	
	export function getMap() {
		return map;
	}
	
</script>

<div class="wind-map-container">
	<canvas id="mapcanvas" class="relative w-full h-screen"></canvas>
</div>

<div id="map-container" class="relative w-full h-screen" bind:this={mapContainer}></div>


<style>
	
</style>