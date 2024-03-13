<script>
    import { Drawer, Button, CloseButton, Toggle } from 'flowbite-svelte';
    import { InfoCircleSolid, ArrowRightOutline } from 'flowbite-svelte-icons';
    import { sineIn } from 'svelte/easing';

    export let hiddenDrawer = true;
    let activateClickOutside = false;
    let backdrop = false;
    
    let transitionParams = {
      x: -320,
      duration: 200,
      easing: sineIn
    };
  </script>


<Drawer {activateClickOutside} {backdrop} leftOffset="top-0 h-screen start-60" ransitionType="fly" {transitionParams} bind:hidden={hiddenDrawer} id="sidebar1" >
    <div class="ml-5">
        <div class="flex items-center">
            <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
              <i class="fa fa-border-none mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
              Carbon dioxide (NO<sub>2</sub>)
            </h5>
            <CloseButton on:click={() => (hiddenDrawer = true)} class="mb-4 dark:text-white" />
          </div>
          <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
            GEOS Air Quality Forecasts bias-corrected using machine learning algorithm.
          </p>
          
            <Toggle size="small" class="mb-2">GEOS</Toggle>
  
            <Toggle size="small" checked={true} class="mb-2">GEOS5</Toggle>
     
          <!-- <div class="grid grid-cols-2 gap-4">
            <Button color="light" href="/">Learn more</Button>
            <Button href="/" class="px-4">Get access <ArrowRightOutline class="w-3.5 h-3.5 ms-2" /></Button>
          </div> -->
    </div>
  </Drawer>
