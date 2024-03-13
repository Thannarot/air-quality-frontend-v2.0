<script type="ts">
    import { onMount, getContext } from 'svelte'
    import { contextKey } from '../Maps/mapbox'

    import { Drawer, Button, CloseButton, Toggle } from 'flowbite-svelte';
    import { InfoCircleSolid, ArrowRightOutline } from 'flowbite-svelte-icons';
    import { sineIn } from 'svelte/easing';
    import { baseMapStyle } from '../../stores/app';

    export let hiddenDrawer = true;
    let activateClickOutside = false;
    let backdrop = false;
    
    let transitionParams = {
      x: -320,
      duration: 200,
      easing: sineIn
    };

    const streetBasemapImg = "/assets/img/street-basemap.png";
    const hybridBasemapImg = "/assets/img/hybrid-basemap.png";
    const satelliteBasemapImg = "/assets/img/satellite-basemap.png";
    const terrainBasemapImg = "/assets/img/terrain-basemap.png";
    let chosenOptionBasemap = "";

    // mapbox://styles/mapbox/standard
    // mapbox://styles/mapbox/streets-v11
    // mapbox://styles/mapbox/outdoors-v11
    // mapbox://styles/mapbox/light-v10
    // mapbox://styles/mapbox/dark-v10
    // mapbox://styles/mapbox/satellite-v9
    // mapbox://styles/mapbox/satellite-streets-v11
    // mapbox://styles/mapbox/navigation-day-v1
    // mapbox://styles/mapbox/navigation-night-v1

  </script>


<Drawer {activateClickOutside} {backdrop} leftOffset="top-0 h-screen start-60" ransitionType="fly" {transitionParams} bind:hidden={hiddenDrawer} id="sidebar1" >
    <div class="ml-5">
        <div class="flex items-center">
            <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
                <i class="fas fa-map mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
                 Map Style
            </h5>
            <CloseButton on:click={() => (hiddenDrawer = true)} class="mb-4 dark:text-white" />
          </div>

          <div class="w-auto text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    
            <button 
                disabled={$baseMapStyle==="light-v10"}
                type="button" 
                class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                on:click={() => $baseMapStyle="light-v10"}
                >
                <img src="{hybridBasemapImg}" alt="" class="w-14 mr-5">
                <div class="text-left text-xs">
                    Light
                    <p class="text-xs text-gray-600">Displays a map in light theme</p>
                </div>
            </button>
            <button 
                disabled={$baseMapStyle==="dark-v10"}
                type="button" 
                class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                on:click={() => $baseMapStyle="dark-v10"}>
                <img src="{terrainBasemapImg}" alt="" class="w-14 mr-5">
                <div class="text-left">
                    Dark
                    <p class="text-xs text-gray-600">Displays a map in dark theme</p>
                </div>
                
            </button>
            <button 
                disabled={$baseMapStyle==="outdoors-v11"}
                type="button" 
                class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium rounded-b-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                on:click={() => $baseMapStyle="outdoors-v11"}>
                <img src="{streetBasemapImg}" alt="" class="w-14 mr-5">
                <div class="text-left text-xs">
                    Classic Map
                    <p class="text-xs text-gray-600">Displays the default road map view</p>
                </div>
            </button>

            <button 
                disabled={$baseMapStyle === "satellite-streets-v11"}
                type="button" 
                class="relative inline-flex items-center w-full px-4 py-2 text-sm font-medium border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white"
                on:click={() => $baseMapStyle="satellite-streets-v11"}
                >
                <img src="{satelliteBasemapImg}" alt="" class="w-14 mr-5">
                <div class="text-left text-xs">
                    Satellite
                    <p class="text-xs text-gray-600">Displays satellite images</p>
                </div>
            </button>
        </div>
    </div>
  </Drawer>
