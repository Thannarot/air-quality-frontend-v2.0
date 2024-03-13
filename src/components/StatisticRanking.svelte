<script>
    import { onMount, getContext } from 'svelte'
    import { contextKey } from '../Maps/mapbox'

    import { Drawer, Button, CloseButton, Toggle } from 'flowbite-svelte';
    import { InfoCircleSolid, ArrowRightOutline } from 'flowbite-svelte-icons';
    import { sineIn } from 'svelte/easing';
    import { ShowStatistic } from '../stores/app';




</script>

<div class="overlay-panel-right">
    <div class="flex items-center">
        <h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
            <i class="fas fa-map mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
             Asean PM 2.5 Ranking 
        </h5>
        <CloseButton on:click={() => ($ShowStatistic = false)} class="mb-4 dark:text-white" />
      </div>

      <div class="w-auto text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">

        <!-- // style: 'ckebgnyea0s8219ki3dfp8von',
        // style: 'ckb2mbm240t2s1itc1dtmk5pf',
        style: 'cltinohfj002101pc7cut13aj', 
        // style: 'cltiptdlg004y01ph1rm84xru',  -->
        

    </div>

</div>


<style>
.app-name {
     font-size: 18px;
     font-weight: 900; 
     margin-bottom: 10px;
     /* border-bottom: 1px solid #b2b2b2; */
 }
</style>