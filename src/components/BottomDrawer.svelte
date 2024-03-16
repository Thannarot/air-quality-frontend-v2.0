<script>
	import { onMount, getContext } from 'svelte';
	import { Drawer, Button, CloseButton, Badge } from 'flowbite-svelte';
	import { InfoCircleSolid, ArrowRightOutline } from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import { hiddenBottomDrawer, locx, locy, locname,  } from '../stores/app';
	import { forecastedTime, forecastedDate, intializationDate } from '../stores/dateTimeStore';

	import qs from 'qs';
	import Chart from 'chart.js/auto';
	import { addData, removeData } from '../helpers/Charts.js';
	import { PUBLIC_BACKEND_AUTHENTICATION ,PUBLIC_BASE_API_URL } from '$env/static/public';
	import axios from 'axios';

	let ctx2;
	let chartCanvasBottom;
	let chartBottom;
	let activateClickOutside = false;
	let backdrop = false;
	let hidden8 = true;
	let transitionParamsBottom = {
		y: 320,
		duration: 200,
		easing: sineIn
	};

	async function getTimeSeriesData(drawCoords, drawType) {
		const initDate = $intializationDate.replace('-', '').replace('-', '');
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

			ctx2 = chartCanvasBottom.getContext('2d');
			chartBottom = new Chart(ctx2, {
				type: 'line',
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false
						},
						filler: {
							propagate: false
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
							backgroundColor: 'rgb(255, 165, 0, 0.2)',
							borderColor: 'rgb(255, 165, 0, 0.2)',
							data: [],
							lineTension: 0.3,
							fill: {
								target: 'origin',
								above: 'rgba(255, 165, 0, 0.2)', // Area will be red above the origin
								below: 'rgba(255, 165, 0, 0.2)' // And blue below the origin
							}
						}
					]
				}
			});
			removeData(chartBottom);
			addData(chartBottom, lables, pm25val, []);
		}
	}

	$: if ($hiddenBottomDrawer === false) {
		let coor = $locy.toString() + ',' + $locx.toString();
		getTimeSeriesData(coor, 'Point');
	}
</script>

<Drawer
	{activateClickOutside}
	{backdrop}
	placement="bottom"
	width="w-full"
	transitionType="fly"
	transitionParams={transitionParamsBottom}
	bind:hidden={$hiddenBottomDrawer}
	id="sidebar8"
	class="shadow-lg"
>
	<div class="flex items-center">
		<h5
			id="drawer-label"
			class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
		>
			<InfoCircleSolid class="w-4 h-4 me-2.5" />PM 2.5 forecast of Thailand, Bangkok
		</h5>
		<CloseButton on:click={() => ($hiddenBottomDrawer = true)} class="mb-4 dark:text-white" />
	</div>
	<div class="flex justify-between">
		<div>
			<p class="max-w-lg mb-6 text-sm text-gray-500 dark:text-gray-400">
				GEOS Air Quality Forecasts bias-corrected using machine learning algorithm
			</p>
		</div>
		<div class="float-right">
			<div class="flex">
				<div class="mr-2">
					<span class="badge rounded-pill bg-success"
						>Min 234
						<p>2024-01-01 01:00:00</p>
					</span>
				</div>
				<div class="">
					<span class="badge rounded-pill bg-warning"
						>Max 234
						<p>2024-01-01 01:00:00</p>
					</span>
				</div>
			</div>
		</div>
	</div>
	<div class="chart-container" style="position: relative; height:15vh; width:90vw">
		<canvas bind:this={chartCanvasBottom} id="myChart2"></canvas>
	</div>
</Drawer>

<style>
	.badge {
		width: auto;
	}
	.badge p {
		font-size: 8px;
	}

	.width10 {
		width: 10%;
	}
	.width70 {
		width: 70%;
	}
	.width20 {
		width: 10%;
	}
</style>
