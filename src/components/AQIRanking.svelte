<script>
  import { Drawer, CloseButton } from 'flowbite-svelte';
  import { sineIn } from 'svelte/easing';
  import { hiddenDrawer, hiddenBottomDrawer, locx, locy, locname } from '../stores/app';
  import { selectedDate_str, selectedTime_str } from '../stores/dateTimeStore';

  import * as Icon from 'svelte-flag-icons';

    let activateClickOutside = false;
    let backdrop = false;

  let hidden6 = true;
  let transitionParamsRight = {
    x: 320,
    duration: 200,
    easing: sineIn
  };

  function getStatictisChart(x, y, loc) {
    $hiddenBottomDrawer = false;
    $locx = x;
    $locy = y;
    $locname = loc;
  }

  
</script>


<Drawer {activateClickOutside} {backdrop} rightOffset="top-14 h-screen end-0" placement="right" transitionType="fly" transitionParams={transitionParamsRight} bind:hidden={$hiddenDrawer} id="sidebar6">
  <div class="flex items-center">
    <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-800 dark:text-gray-400">
      <!-- <InfoCircleSolid class="w-4 h-4 me-2.5" /> -->
      Mekong PM2.5 Ranking
    </h5>
    <CloseButton on:click={() => ($hiddenDrawer = true)} class="mb-4 dark:text-white" />
  </div>
  <p class="text-sm text-gray-500 dark:text-gray-400 float-right">
    {$selectedTime_str}:00:00
  </p>
  <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
    {$selectedDate_str} 
  </p>

  <ul class="list-group text-sm">
    <li class="list-group-item">
        <div class="d-flex justify-content-start">
            <div class="p-2 width10 ">#</div>
            <div class="p-2 width70">Major city</div>
            <div class="p-2 width20"> </div>
          </div>
    </li>
    <li class="list-group-item text-xs" on:click={() => getStatictisChart(11.2, 100.2, 'Thailand, Bangkok')} >
        <div class="d-flex justify-content-start" >
            <div class="p-2 width10">1</div>
            <div class="p-2 width70 flex">
                <div class="mr-1"><Icon.Th size="20" /></div>
                <div>Thailand, Bangkok</div>
            </div>
            <div class="p-2 width20">
                <span class="badge rounded-pill bg-success">234</span>
            </div>
          </div>
    </li>
    <li class="list-group-item text-xs" on:click={() => getStatictisChart(11.2, 100.2, 'Thailand, Bangkok')}>
        <div class="d-flex justify-content-start">
            <div class="p-2 width10">1</div>
            <div class="p-2 width70 flex">
                <div class="mr-1"><Icon.La size="20" /></div>
                <div>Thailand, Bangkok</div>
            </div>
            <div class="p-2 width20">
                <span class="badge rounded-pill bg-success">12</span>
            </div>
          </div>
    </li>
    <li class="list-group-item text-xs" on:click={() => getStatictisChart(11.2, 100.2, 'Thailand, Bangkok')}>
        <div class="d-flex justify-content-start">
            <div class="p-2 width10">1</div>
            <div class="p-2 flex width70">
                <div class="mr-1"><Icon.Vn size="20" /></div>
                <div>Laos, Bangkok</div>
            </div>
            <div class="p-2 width20">
                <span class="badge rounded-pill bg-success">32</span>
            </div>
          </div>
    </li>
    <li class="list-group-item text-xs" on:click={() => getStatictisChart(11.2, 100.2, 'Thailand, Bangkok')}>
        <div class="d-flex justify-content-start">
            <div class="p-2 width10">1</div>
            <div class="p-2 width70 flex">
                <div class="mr-1"><Icon.Kh size="20" /></div>
                <div>Thailand, Bangkok</div>
            </div>
            <div class="p-2 width20">
                <span class="badge rounded-pill bg-success">234</span>
            </div>
          </div>
    </li>
    <li class="list-group-item text-xs" on:click={() => getStatictisChart(11.2, 100.2, 'Thailand, Bangkok')}>
        <div class="d-flex justify-content-start">
            <div class="p-2 width10">1</div>
            <div class="p-2 width70 flex">
                <div class="mr-1"><Icon.Mm size="20" /></div>
                <div>Thailand, Bangkok</div>
            </div>
            <div class="p-2 width20">
                <span class="badge rounded-pill bg-success">64</span>
            </div>
          </div>
    </li>
  </ul>
</Drawer>

<style>
    .badge { 
        width: 40px;
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