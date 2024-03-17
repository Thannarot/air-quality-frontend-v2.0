<script>

    import { CloseButton } from 'flowbite-svelte';
    import { ShowPollutantSelect, selectedPollutant, selectedPollutantName } from '../stores/app';
    let options = [
		{ value: 'pm25', name: 'PM2.5' },
    // { value: 'pm10', name: 'PM10' },
		{ value: 'no2', name: 'Nitrogen dioxide (NO2)' }

	];

  // set select input with nice select style
  setTimeout(()=> {
		NiceSelect.bind(document.querySelector("#select-pollutant"))
	},50)

</script>


<div id="select_air_pollutant" class="box__info-air-quality p-2 rounded">
  <a on:click={()=> $ShowPollutantSelect = false} class="btn-close border-0 d-flex align-items-center justify-content-center"><img class="d-block" src="assets/img/icon/close.svg" alt=""></a>
  <div class="head border-bottom border-green d-flex align-items-center mb-1 pb-1 w-100">
      <p class="icon me-15 mb-0"><img style="height: 25px;" src="assets/img/icon/head-air-quality.svg" alt=""></p>
      <p class="text blue-600 text-2lg font-bold mb-0">Air Pollutant</p>
  </div>

  <div class="box__description">
      <p class="blue-600">Select air pollutant</p>
      <select class="nice-select wide selectize" id="select-pollutant" bind:value={$selectedPollutant}>
        {#each options as option}
          <option value={option.value}>{option.name}</option>
        {/each}
      </select>
  </div>
</div>

