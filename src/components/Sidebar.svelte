<script>
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';
    import { GridSolid, MailBoxSolid, UserSolid, ArrowRightToBracketSolid, FireSolid, BookSolid } from 'flowbite-svelte-icons';

    import { Drawer, Button, CloseButton } from 'flowbite-svelte';
    import { InfoCircleSolid, ArrowRightOutline } from 'flowbite-svelte-icons';
    import { sineIn } from 'svelte/easing';

    import GEOSDrawer from '../components/Drawers/GEOSDrawer.svelte'
    import Pm10Drawer from './Drawers/PM10Drawer.svelte';
    import FireDrawer from './Drawers/FireDrawer.svelte';
    import Co2Drawer from './Drawers/CO2Drawer.svelte';
    import No2Drawer from './Drawers/NO2Drawer.svelte';
    import MapSettingDrawer from './Drawers/MapSettingDrawer.svelte';


    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    let hiddenGEOSDrawer = true;
    let hiddenPm10Drawer = true;
    let hiddenFireDrawer = true;
    let hiddenCo2Drawer = true;
    let hiddenNo2Drawer = true;
    let hiddenMapSettingDrawer = true;

    /////////  Close all drawers   //////////
    function closeAllDrawers() {
        hiddenGEOSDrawer = true;
        hiddenPm10Drawer = true;
        hiddenFireDrawer = true;
        hiddenCo2Drawer = true;
        hiddenNo2Drawer = true;
        hiddenMapSettingDrawer = true;
    }
    

    let activateClickOutside = false;
    let backdrop = false;
    let transitionParams = {
      x: -320,
      duration: 200,
      easing: sineIn
    };


  </script>
  
  <nav class="relative md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-gray-50 flex flex-wrap items-center justify-between relative " style="z-index:999;">
    <div class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto ">
        <Sidebar>
            <SidebarWrapper>
              <SidebarGroup>
                <h6 class="md:min-w-full text-blueGray-900 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
                    Air Quality
                </h6>

                <SidebarItem label="Air Quality" on:click={() => { closeAllDrawers(); hiddenGEOSDrawer=false;}}>
                  <svelte:fragment slot="icon">
                    <i class="fas fa-stream mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"> </i>
                  </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Ground Stations" on:click={() => { closeAllDrawers(); hiddenPm10Drawer=false;}}>
                <svelte:fragment slot="icon">
                    <i class="fa fa-border-none mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
                </svelte:fragment>
                </SidebarItem>

                <!-- <SidebarItem label="Fire" on:click={() => { closeAllDrawers(); hiddenFireDrawer=false;}}>
                    <svelte:fragment slot="icon">
                        <i class="fas fa-fire mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
                    </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Carbon dioxide" on:click={() => { closeAllDrawers(); hiddenCo2Drawer=false;}}>
                <svelte:fragment slot="icon">
                    <i class="fas fa-fire mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
                </svelte:fragment>
                </SidebarItem>

                <SidebarItem label="Nitrogen dioxide" on:click={() => { closeAllDrawers(); hiddenNo2Drawer=false;}}>
                    <svelte:fragment slot="icon">
                        <i class="fas fa-fire mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
                    </svelte:fragment>
                    </SidebarItem> -->
                
              </SidebarGroup>

              <SidebarGroup border>
                <h6 class="md:min-w-full text-blueGray-900 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
                    Map Settings
                </h6>

                <SidebarItem label="Map Style" on:click={() => { closeAllDrawers(); hiddenMapSettingDrawer=false;}}>
                  <svelte:fragment slot="icon">
                    <i class="fas fa-map mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
                  </svelte:fragment>
                </SidebarItem>
              </SidebarGroup>

              <SidebarGroup border>
                <h6 class="md:min-w-full text-blueGray-900 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
                    Information
                </h6>

                <SidebarItem label="Information">
                  <svelte:fragment slot="icon">
                    <i class="fas fa-info-circle mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
                  </svelte:fragment>
                </SidebarItem>
              </SidebarGroup>
            </SidebarWrapper>
          </Sidebar>

    </div>
    
  </nav>

<GEOSDrawer bind:hiddenDrawer={hiddenGEOSDrawer} />
<Pm10Drawer bind:hiddenDrawer={hiddenPm10Drawer} />
<FireDrawer bind:hiddenDrawer={hiddenFireDrawer} />
<Co2Drawer bind:hiddenDrawer={hiddenCo2Drawer} />
<No2Drawer bind:hiddenDrawer={hiddenNo2Drawer} />
<MapSettingDrawer bind:hiddenDrawer={hiddenMapSettingDrawer} />  
