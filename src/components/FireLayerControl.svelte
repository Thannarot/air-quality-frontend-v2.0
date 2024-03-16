<script>
	import { onMount } from 'svelte';

	import { selectedFire, ShowFire } from '../stores/app';

	let fire_options = [
		{ value: 'fires_viirs_24', name: 'VIIRS active fire last 24 hours' },
		{ value: 'fires_viirs_48', name: 'VIIRS active fire last 48 hours' },
    	{ value: 'fires_viirs_time', name: 'VIIRS active fire for a single day' },
		{ value: 'vfei', name: 'VIIRS-based Fire Emission Inventory' },
	];
  
  setTimeout(()=> {
		NiceSelect.bind(document.querySelector("#select2-fire"))
	},100)

</script>

<div class="item">
	<div class="info bg-white mb-2 p-15 rounded">
		<div class="head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100">
			<p class="text blue-600 text-sm mb-0">Fire Product</p>
			<p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="assets/img/icon/head-information.svg" alt=""></p>
		</div>
		<div class="box__description">
	
			<div class="row no-gutters align-items-center">
				<div class="col-2">
					<p class="icon mb-0"><img class="d-block w-100" src="assets/img/icon/icon-ugm-1.svg" alt=""></p>
				</div>
				<div class="col">
				  <select  id="select2-fire" class="nice-select wide selectize" bind:value={$selectedFire}>
					{#each fire_options as option}
						<option value={option.value}>{option.name}</option>
					{/each}
					</select>
				</div>
			</div>
		</div>
	</div>
  </div>