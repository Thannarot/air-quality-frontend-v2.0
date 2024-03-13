<script type="ts">

	import { ShowPollutant, ShowStation, ShowFire, ShowMapSetting, ShowStatistic, hiddenDrawer, ShowPollutantSelect, ShowWindCanvas } from '../stores/app';
  
  function showMapSettingPanel() {
    $ShowMapSetting= !$ShowMapSetting;
     if ($ShowMapSetting)  { 
        setTimeout(()=> {
          document.querySelectorAll('#mapsettingPanel').forEach(
              el => el.style.display = 'block'
          );
        },5)
      }
  }

  function showPollutantSelectPanel() {
    $ShowPollutantSelect= !$ShowPollutantSelect;
     if ($ShowPollutantSelect)  { 
        setTimeout(()=> {
          document.querySelectorAll('#select_air_pollutant').forEach(
              el => el.style.display = 'block'
          );
        },5)
      }
  }

  


</script>

<div class="detail">
  <div class="air-quality" on:click={showPollutantSelectPanel}  on:keydown={showPollutantSelectPanel}>
      <a class="btn-tool d-block">
          <p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-1.svg" alt=""></p>
          <p class="text d-block text-sm text-center mb-0"><span class="d-block">Air</span> Quality</p>
      </a>
  </div>
  <div class="ground-station" on:click={()=> $ShowStation=!$ShowStation } on:keydown={()=> $ShowStation=!$ShowStation  }>
      <a class="btn-tool d-block">
          <p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-2.svg" alt=""></p>
          <p class="text d-block text-sm text-center mb-0"><span class="d-block">Ground</span> Station</p>
      </a>
  </div>
  <div class="fire-product" on:click={()=> $ShowFire=!$ShowFire } on:keydown={()=> $ShowFire=!$ShowFire }>
      <a class="btn-tool d-block">
          <p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-3.svg" alt=""></p>
          <p class="text d-block text-sm text-center mb-0"><span class="d-block">Fire</span> Product</p>
      </a>
  </div>
  <div class="statistics-map" on:click={()=> $hiddenDrawer = !$hiddenDrawer } on:keydown={()=> $hiddenDrawer=!$hiddenDrawer }>
      <a class="btn-tool d-block">
          <p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-4.svg" alt=""></p>
          <p class="text d-block text-sm text-center mb-0"><span class="d-block">Statistics</span> Report</p>
      </a>
  </div>
  <div class="base-map" on:click={showMapSettingPanel}>
      <a class="btn-tool d-block">
          <p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-5.svg" alt=""></p>
          <p class="text d-block text-sm text-center mb-0"><span class="d-block">Base</span> Map</p>
      </a>
  </div>
</div>

<style>
    
.tool {
   font-size: 12px; 
   width: 70px;
   height: auto;
   position: absolute;
   right: 10px;
   top: 150px;
   z-index: 3;
   background-color: #fff;
   border-radius: 5px;

}
.tool div {
  cursor: pointer;
}
</style>
