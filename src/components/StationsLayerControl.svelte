<script>
    import { pcdshow, selectedStation, ShowStation } from '../stores/app';

    $selectedStation = 'pcd'
    $ShowStation = true
    let station_options = [
		{ value: 'pcd', name: 'Pollution Control Department' },
		{ value: 'aeronet', name: 'Aeronet' },
		{ value: 'embassy', name: 'Embassy' }
	];

  $: if($selectedStation === 'pcd') {
		$pcdshow = true
	}

  setTimeout(()=> {
		NiceSelect.bind(document.querySelector("#select2-station"))
	},100)

  </script>


<div class="item">
  <div class="info bg-white mb-2 p-15 rounded">
      <div class="head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100">
          <p class="text blue-600 text-sm mb-0">Ground Stations</p>
          <p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="assets/img/icon/head-information.svg" alt=""></p>
      </div>
      <div class="box__description">
  
          <div class="row no-gutters align-items-center">
              <div class="col-2">
                  <p class="icon mb-0"><img class="d-block w-100" src="assets/img/icon/icon-ugm-3.svg" alt=""></p>
              </div>
              <div class="col">
                <select  id="select2-station" class="nice-select wide selectize" bind:value={$selectedStation}>
                  <option value="pcd">Pollution Control Department</option>
                  <option value="aeronet">Aeronet</option>
                  <option value="embassy">Embassy</option>
                  </select>
              </div>
          </div>
      </div>
  </div>
</div>


  