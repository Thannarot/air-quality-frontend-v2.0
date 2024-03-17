<script type="ts">
	// js components
	import mapboxgl from 'mapbox-gl';
	import axios from 'axios';
	import qs from 'qs';
	import Chart from 'chart.js/auto';

	// core components
	import MapExample from '../components/Maps/MapBox.svelte';
	import TimeSlider from '../components/TimeSlider.svelte';
	import Modal from '../components/Modal.svelte';
	import LayerToggle from '../components/LayerToggle.svelte';
	import AirPollutants from '../components/AirPollutants.svelte';
	import StationsLayerControl from '../components/StationsLayerControl.svelte';
	import FireLayerControl from '../components/FireLayerControl.svelte';
	import MapSetting from '../components/MapSetting.svelte';
	import AqiRanking from '../components/AQIRanking.svelte';
	import PollutantSelect from '../components/PollutantSelect.svelte';
	import BottomDrawer from '../components/BottomDrawer.svelte';

	// import store variables
	import { forecastedTime, forecastedDate, intializationDate } from '../stores/dateTimeStore';
	import { showChartModal } from '../stores/chartStore';
	import { pcdshow, drawCoords, drawType, ShowStation, ShowFire, ShowPollutant, selectedFire, ShowMapSetting, ShowStatistic, hiddenDrawerRanking, ShowPollutantSelect, hiddenBottomDrawer, locx, locy, locname } from '../stores/app';
	
	// helpers
	import { createMarker, createFeatureCollection } from '../helpers/MapFunctions.js';
	import { addData, removeData } from '../helpers/Charts.js';

	import { PUBLIC_BACKEND_AUTHENTICATION, PUBLIC_BASE_API_URL } from "$env/static/public";



	let map;
	let showModal = false;
	let ctx;
	let chartCanvas;
	let chart;

	$ShowPollutant = true;
	$ShowMapSetting = false;
	$hiddenDrawerRanking = false;
	$ShowPollutantSelect = false;
	$hiddenBottomDrawer = true; 
	$selectedFire = 'fires_viirs_24';

	setTimeout(() => {
		ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
			type: 'bar',
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false
					}
				},
				scales: {
					x: {
						ticks: {
							font: {
								size: 10
							},
							type: 'time',
							autoSkip: true,
							maxTicksLimit: 3,
							autoSkipPadding: 10
						},
						gridLines: {
							display: false
						}
					},
					y: {
						ticks: {
							font: {
								size: 10
							}
						},

						title: {
							display: true,
							text: 'PM 2.5',
							font: {
								size: 10
							}
						}
					}
				}
			},
			data: {
				labels: [],
				datasets: [
					{
						label: 'PM2.5',
						backgroundColor: 'rgb(126, 58, 242)',
						borderColor: 'rgb(126, 58, 242)',
						data: [],
						backgroundColor: [],
						lineTension: 0.3
					}
				]
			}
		});

		
	}, 200);

	/////////////////////////////////////  Change Map style    ///////////////////////////////////////

	async function getChartData(drawCoords, drawType) {
		const initDate = $intializationDate;

		let params = {
				action: 'get-chartData',
				freq_chart: '3dayrecent',
				geom_data: drawCoords,
				interaction: drawType,
				run_date_chart: initDate + '.nc',
				run_type_chart: 'geos',
				variable: 'BC_MLPM25'
    	};

		let res = await axios.get(PUBLIC_BASE_API_URL, { 
			params, 
			headers: { Authorization: PUBLIC_BACKEND_AUTHENTICATION } 
		})
			
		if (res) {
			let fetchData = res.data.data;
			let pm25Data = fetchData.plot;

			let lables = pm25Data.map((tuple) =>
				new Date(tuple[0]).toLocaleString('en-GB', {
					hour12: false
				})
			);

			let barColors = pm25Data.map(function (tuple) {
				if (tuple[1] < 20) {
					return '#8b81ba';
				} else if (tuple[1] < 40) {
					return '#6ca7cc';
				} else if (tuple[1] < 60) {
					return '#91d2bd';
				} else if (tuple[1] < 80) {
					return '#fbfbcf';
				} else if (tuple[1] < 100) {
					return '#b44674';
				} else {
					return '#ddd';
				}
			});

			let pm25val = pm25Data.map((tuple) => tuple[1]);
			removeData(chart);
			addData(chart, lables, pm25val, barColors);

			let pointContent = document.querySelector('.mapboxgl-popup-content');
			pointContent.innerHTML +=
				'<div class="point-popup-val">' +
				pm25val[0] +
				' µgm<sup>3</sup> ' +
				'<span id="open-statistic-button"  style="float: right; cursor: pointer;">' +
				'<i class="fa fa-signal mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent" aria-hidden="true"></i>' +
				'</span> </div>';

			// Get the element, add a click listener...
			document.getElementById('open-statistic-button').addEventListener('click', function (e) {
				showModal = true;
			});
		}
	}

	function mapZoomIn() {
		let currentZoom = map.getZoom();
		map.setZoom(currentZoom+1);
	}
	function mapZoomOut() {
		let currentZoom = map.getZoom();
		map.setZoom(currentZoom-1);
	}

	async function getStations() {
		// Getting PCD stations data
		let params = {
			action: 'get-stations',
			obs_date: $forecastedDate + ' '+ $forecastedTime + ':00:00'
		};

    	let res = await axios.get(PUBLIC_BASE_API_URL, { 
			params, 
			headers: { Authorization: PUBLIC_BACKEND_AUTHENTICATION } 
		})
    
		// create feature collection geojson format
		let geojsons = createFeatureCollection(res.data.data);
		// create station markers
		createMarker(map, mapboxgl, geojsons);
	}

	$: if ($pcdshow) {
		getStations();
	}

	$: if ($showChartModal) {
		showModal = true;
	}

	$: if ($drawCoords !== '') { 
		getChartData($drawCoords, $drawType)
	}


	$: if (!$hiddenDrawerRanking) {
		setTimeout(()=> {
			document.querySelectorAll('#right-component').forEach(
       		el => el.style.right = '330px'
  		 );
		   document.querySelectorAll('#timeslider').forEach(
       		el => el.style.justifyContent = 'center'
  		 );
		}, 50)
	}
	$: if ($hiddenDrawerRanking) {
		document.querySelectorAll('#right-component').forEach(
       		el => el.style.right = '30px',
		);
			   document.querySelectorAll('#timeslider').forEach(
       		el => el.style.justifyContent = 'center'
  		 );
	}
</script>

<div id="box__home">
    <div class="box__info-ugm">
        <div class="slider">
            {#if $ShowPollutant}
				<AirPollutants></AirPollutants>
			{/if}

			{#if $ShowStation}
				<StationsLayerControl></StationsLayerControl>
			{/if}

			{#if $ShowFire}
				<FireLayerControl></FireLayerControl>
			{/if}
        </div>
    </div>

    <div id="right-component" class="box__tool bg-white py-2 rounded">
    
		<LayerToggle></LayerToggle>

		{#if $ShowPollutantSelect}
			<PollutantSelect></PollutantSelect>
		{/if}

        {#if $ShowMapSetting}
			<MapSetting></MapSetting>
		{/if}
    </div>

    <div class="box__zoom-map">
        <a on:click={mapZoomIn} class="btn-plus d-flex align-items-center justify-content-center mb-1"><img src="assets/img/icon/icon-plus.svg" alt=""></a>
        <a on:click={mapZoomOut} class="btn-minus d-flex align-items-center justify-content-center"><img src="assets/img/icon/icon-minus.svg" alt=""></a>
    </div>

    <div class="map overflow-hidden">
		<MapExample bind:map></MapExample>
	</div>

	<div class="absolute dateTime-position w-full flex justify-center items-stretch">
		<TimeSlider></TimeSlider>
	</div>

	<AqiRanking></AqiRanking>

	<BottomDrawer></BottomDrawer>
	
	
	<Modal bind:showModal>
		<h2 slot="header" class="font-meduim text-lg text-slate-700 mb-0">
			Air quality monitoring
		</h2>
		<p class="mt-0 font-light text-xs text-slate-500">Location: {$drawCoords}</p>
		<div class="chart-container" style="position: relative; height:15vh; width:40vw">
			<canvas bind:this={chartCanvas} id="myChart"></canvas>
		</div>
	</Modal>
</div>

<style>
	.dateTime-position {
		bottom: 20px;
		z-index: 1;
	}
	.layer-control-panel {
		font-size: 12px;
		width: 250px;
		height: auto;
		position: absolute;
		left: 10px;
		top: 60px;
		z-index: 999;
	}
</style>
