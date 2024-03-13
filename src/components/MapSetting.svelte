<script>

    import { CloseButton} from 'flowbite-svelte';
    import { baseMapStyle, ShowMapSetting } from '../stores/app';
    const ClassicBasemapImg = "/assets/img/classic-basemap.png";
    const LightBasemapImg = "/assets/img/light-basemap.png";
    const satelliteBasemapImg = "/assets/img/satellite-basemap.png";
    const DarkBasemapImg = "/assets/img/dark-basemap.png";
    const WindBasemapImg = "/assets/img/wind-basemap.png";
 
    function toggleWind(){
        console.log('toggle wind')
        const el = document.querySelector('.wind-map-container')
        el.style.display = el.style.display === 'none' ? 'block' : 'none'
    }

</script>

<div  id="mapsettingPanel" class="box__info-base-map p-2 rounded">
    <a on:click={() => ($ShowMapSetting = false)} class="btn-close border-0 d-flex align-items-center justify-content-center"><img class="d-block" src="assets/img/icon/close.svg" alt=""></a>

    <div class="head border-bottom border-green d-flex align-items-center mb-1 pb-1 w-100">
        <p class="icon me-15 mb-0"><img style="height: 25px;" src="assets/img/icon/base-map.svg" alt=""></p>
        <p class="text blue-600 text-2lg font-bold mb-0">Base Map</p>
    </div>

    <div class="box__description">
        <div class="box__overflow pe-1">
            <div class="list__info">
                <a class="d-block item mb-1 p-1" on:click={() => $baseMapStyle='cltinohfj002101pc7cut13aj'}>
                    <div class="row no-gutters align-items-center">
                        <div class="col-auto">
                            <p class="pic mb-0 me-1"><img class="d-block w-100" src="{LightBasemapImg}" alt=""></p>
                        </div>
                        <div class="col">
                            <p class="text-sm mb-0">Light</p>
                            <p class="text-xs">Displays a map in light theme</p>
                        </div>
                    </div>
                </a>
                <a class="d-block item mb-1 p-1" on:click={() => $baseMapStyle='cltiptdlg004y01ph1rm84xru'}>
                    <div class="row no-gutters align-items-center">
                        <div class="col-auto">
                            <p class="pic mb-0 me-1"><img class="d-block w-100" src="{DarkBasemapImg}" alt=""></p>
                        </div>
                        <div class="col">
                            <p class="text-sm mb-0">Dark</p>
                            <p class="text-xs">Displays a map in dark theme</p>
                        </div>
                    </div>
                </a>
                <a class="d-block item mb-1 p-1" on:click={() => $baseMapStyle='ckb2mbm240t2s1itc1dtmk5pf'}>
                    <div class="row no-gutters align-items-center">
                        <div class="col-auto">
                            <p class="pic mb-0 me-1"><img class="d-block w-100" src="{ClassicBasemapImg}" alt=""></p>
                        </div>
                        <div class="col">
                            <p class="text-sm mb-0">Classic</p>
                            <p class="text-xs">Displays the default road map view</p>
                        </div>
                    </div>
                </a>
                <a class="d-block item mb-1 p-1 active" on:click={toggleWind} >
                    <div class="row no-gutters align-items-center">
                        <div class="col-auto">
                            <p class="pic mb-0 me-1"><img class="d-block w-100" src="{WindBasemapImg}" alt=""></p>
                        </div>
                        <div class="col">
                            <p class="text-sm mb-0">Wind</p>
                            <p class="text-xs">wind forecast data (6 hourly from NOAA)</p>
                        </div>
                    </div>
                </a>

            </div>
        </div>
    </div>
</div>

