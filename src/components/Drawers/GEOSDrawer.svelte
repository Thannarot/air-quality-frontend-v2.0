<script>
	import { Drawer, Button, CloseButton, Toggle, Label, Select, Input } from 'flowbite-svelte';
	import { InfoCircleSolid, ArrowRightOutline } from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import Range from '../../components/Range/Range.svelte';
	import { selectedProduct, selectedPollutant } from '../../stores/app';


	// set selected product, pm2.5 geos is a default
	selectedProduct.set('geos5');
	selectedPollutant.set('pm25');

	let range_value = 100;
	let theme = 'default';

	export let hiddenDrawer = true;
	let activateClickOutside = false;
	let backdrop = false;
	let selected_style = 'rainbow';

	let satellite_options = [];
	let air_parameter_options = [
		{ value: 'pm25', name: 'PM 2.5' },
		{ value: 'no2', name: 'Nitrogen dioxide' },
		{ value: 'co2', name: 'Carbon dioxide' }
	];

	if($selectedPollutant === 'no2') {
		console.log('no2')
		satellite_options = [
			{ value: 'gems', name: 'GEMS' }
		];		
	}
	if($selectedPollutant === 'pm25') {
		satellite_options = [
			{ value: 'geos', name: 'GEOS' },
			{ value: 'geos5', name: 'GEOS5' },
		];
		console.log('pm25')		
	}


	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};

	let customize_show = false;
	const expand = () => {
		customize_show = !customize_show;
	};

</script>

<Drawer
	{activateClickOutside}
	{backdrop}
	leftOffset="top-0 h-screen start-60"
	ransitionType="fly"
	{transitionParams}
	bind:hidden={hiddenDrawer}
	id="sidebar1"
>
	<div class="ml-5">
		<div class="flex items-center">
			<h5
				id="drawer-label"
				class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
			>
				<i
					class="fa fa-border-none mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"
				/>
				Air Quality Forecast
			</h5>
			<CloseButton on:click={() => (hiddenDrawer = true)} class="mb-4 dark:text-white" />
		</div>
		<p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
			GEOS Air Quality Forecasts bias-corrected using machine learning algorithm.
		</p>
		<Label>
			Select an air parameter
			<Select bind:value={$selectedPollutant}>
				{#each air_parameter_options as option}
					<option value={option.value}>{option.name}</option>
				{/each}
			</Select>
		</Label>

		<br />

		<Label>
			Select a sensor or a model
			<Select class="mt-2" bind:items={satellite_options} bind:value={$selectedProduct} />
		</Label>

		<br />

		<div class="accordion">
			<!-- <p on:click={() => expand() }> Layer customization </p> -->
			<div class="mb-6">
				<button
					on:click={() => expand()}
					class="from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"
					>customization</button
				>
			</div>

			{#if customize_show}
				<div class="slider" transition:slide>
					<div class="flex gap-4">
						<div class="mb-6">
							<Label for="small-input" class="block mb-2">Range Min</Label>
							<Input id="small-input" size="sm" placeholder="0" />
						</div>
						<div class="mb-6">
							<Label for="small-input" class="block mb-2">Range Max</Label>
							<Input id="small-input" size="sm" placeholder="100" />
						</div>
					</div>

					<div class="flex">
						<div class="mb-6">
							<Label for="small-select" class="block mb-2">Select style</Label>
							<!-- <Input id="small-input" size="sm" placeholder="0" /> -->
							<Select id="small-select" bind:value={selected_style}>
								<!-- {#each style_options as option}
									<option value={option.value}>{option.name}</option>
								{/each} -->
							</Select>
						</div>
					</div>

					<div class="flex" class:purple-theme={theme === 'purple'}>
						<div class="mb-6 w-full">
							<Label for="small-input" class="block mb-2">Range Max</Label>
							<Range
								on:change={(e) => (range_value = e.detail.value)}
								id="basic-slider"
								initialValue="100"
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</Drawer>

<style>
	.accordion {
		margin-bottom: 10px;
	}

	.slider {
		/* border: 1px solid #eee;
		padding: 4px 20px; */

		/* Added some color to illustrate the issue */
		background-color: none;
		color: white;
	}

	button {
		font-size: 14px;
	}

	.purple-theme {
		--track-focus: #c368ff;
		--track-highlight-bgcolor: #c368ff;
		--track-highlight-bg: linear-gradient(90deg, #c368ff, #c965ff);
		--thumb-holding-outline: rgba(191, 102, 251, 0.3);
		--tooltip-bgcolor: #c368ff;
		--tooltip-bg: linear-gradient(45deg, #c368ff, #c965ff);
	}

	.theme-buttons {
		display: flex;
		justify-content: center;
	}

	h3 {
		text-align: center;
	}

	label {
		margin: 8px;
		font-size: 16px;
		font-weight: 600;
	}

	select {
		font-size: 12px;
	}

	.text-sm {
		line-height: 1rem;
	}
</style>
