<script>
  import { link } from "svelte-routing";

  export let closePipelineDrawer;
  export let closeBiodiversityDrawer;
  export let closeReclamationDrawer;
  export let closeUrbanDrawer;
  export let closeInformationDrawer;
  export let closeMapStyleDrawer;
  export let closeWildfireDrawer;
  let collapseShow = "hidden";

  function toggleCollapseShow(classes) {
    collapseShow = classes;
  }

  /////////////////////////////////////  Close all drawers   ////////////////////////////////////////
  function setClosetoDrawer() {
    closePipelineDrawer = false;
    closeBiodiversityDrawer = false;
    closeReclamationDrawer = false;
    closeUrbanDrawer = false;
    closeInformationDrawer = false;
    closeMapStyleDrawer = false;
    closeWildfireDrawer = false;
  }
</script>

<nav class="relative md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
  <div class="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
    <!-- Toggler -->
    <button
      class="cursor-pointer text-black opacity-50 md:hidden text-xl leading-none bg-transparent rounded border border-solid border-transparent"
      type="button"
      on:click={() => toggleCollapseShow('bg-white m-2 py-3 px-6')}
    >
      <i class="fas fa-bars"></i>
    </button>

    <!-- Brand -->
    <a use:link class="md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-medium uppercase font-bold from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent" href="/">
      <!-- <img src="/assets/img/pembina-logo.png" alt="" width="100px"> -->
      <!-- Pembina  -->
      Air Quality Version2.0
    </a>

    <!-- Collapse -->
    <div class="md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-2 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded {collapseShow}">
      <!-- Collapse header -->
      <div
        class="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200"
      >
        <div class="flex flex-wrap">
          <div class="w-6/12">
            <a
              use:link
              class="md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-medium uppercase font-bold from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"
              href="/"
            >
            Air Quality Version2.0
            </a>
          </div>
          <div class="w-6/12 flex justify-end">
            <button
              type="button"
              class="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
              on:click={() => toggleCollapseShow('hidden')}
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <hr class="my-2 md:min-w-full" />
      <!-- Heading -->
      <h6
        class="md:min-w-full text-blueGray-900 text-sm uppercase font-bold block pt-1 pb-4 no-underline"
      >
        Layers
      </h6>
      <!-- Navigation -->

      <ul class="md:flex-col md:min-w-full flex flex-col list-none text-blueGray-500">
        <li class="items-center text-xs uppercase py-3 font-bold block cursor-pointer" 
            type="button" 
            data-drawer-target="drawer-pipeline" 
            data-drawer-show="drawer-pipeline" 
            aria-controls="drawer-pipeline" 
            data-drawer-backdrop="false"
            on:click={() => {setClosetoDrawer(); closePipelineDrawer=true;}}> 
            <i class="fas fa-stream mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"> </i>
            GEOS
        </li>

        <li class="items-center text-xs uppercase py-3 font-bold block cursor-pointer" 
            type="button" 
            data-drawer-target="drawer-reclamation" 
            data-drawer-show="drawer-reclamation" 
            aria-controls="drawer-reclamation" 
            data-drawer-backdrop="false"
            on:click={() => {setClosetoDrawer(); closeReclamationDrawer=true;}}>
            <i class="fa fa-border-none mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
            Sentinel 5
        </li>

        <li class="items-center text-xs uppercase py-3 font-bold block cursor-pointer" 
            type="button" 
            data-drawer-target="drawer-biodiversity" 
            data-drawer-show="drawer-biodiversity" 
            aria-controls="drawer-biodiversity" 
            data-drawer-backdrop="false"
            on:click={() => {setClosetoDrawer(); closeBiodiversityDrawer=true;}}>
            <i class="fas fa-seedling mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
            Fire
        </li>

        <li class="items-center text-xs uppercase py-3 font-bold block cursor-pointer" 
            type="button" 
            data-drawer-target="drawer-urban" 
            data-drawer-show="drawer-urban" 
            aria-controls="drawer-urban" 
            data-drawer-backdrop="false"
            on:click={() => {setClosetoDrawer(); closeUrbanDrawer=true;}}>
            <i class="fas fa-city mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
            Urban Expansion
        </li>

        <li class="items-center text-xs uppercase py-3 font-bold block cursor-pointer" 
            type="button" 
            data-drawer-target="drawer-wlidfire" 
            data-drawer-show="drawer-wlidfire" 
            aria-controls="drawer-wlidfire" 
            data-drawer-backdrop="false"
            on:click={() => {setClosetoDrawer(); closeWildfireDrawer=true;}}> 
            <i class="fas fa-fire mr-2 text-sm bg-gradient-to-r from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
            Wlidfire Risk
        </li>
      </ul>

      <!-- Divider -->
      <hr class="my-4 md:min-w-full" />
      <!-- Heading -->
      <h6
        class="md:min-w-full text-blueGray-900 text-sm uppercase font-bold block pt-1 pb-4 no-underline"
      >
      Map Settings
      </h6>
      <!-- Navigation -->
  
      <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4 text-blueGray-500">
        <li class="items-center text-xs uppercase py-3 font-bold block cursor-pointer" 
            type="button" 
            data-drawer-target="drawer-mapstyle" 
            data-drawer-show="drawer-mapstyle" 
            aria-controls="drawer-mapstyle" 
            data-drawer-backdrop="false"
            on:click={() => {setClosetoDrawer(); closeMapStyleDrawer=true;}}> 
            <i class="fas fa-map mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
            Basemap Style
        </li>

      </ul>

      <!-- Divider -->
      <hr class="my-4 md:min-w-full" />
      <!-- Heading -->
      <h6 class="md:min-w-full text-blueGray-900 text-sm uppercase font-bold block pt-1 pb-4 no-underline">
        Information
      </h6>
      <!-- Navigation -->
      <ul class="md:flex-col md:min-w-full flex flex-col list-none md:mb-4 text-blueGray-500">
        <li class="items-center text-xs uppercase py-3 font-bold block cursor-pointer" 
            type="button" 
            data-drawer-target="drawer-information" 
            data-drawer-show="drawer-information" 
            aria-controls="drawer-information" 
            data-drawer-backdrop="false"
            on:click={() => {setClosetoDrawer(); closeInformationDrawer=true;}}> 
            <i class="fas fa-info-circle mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent"/>
            Information
        </li>
      </ul>

    </div>
  </div>
</nav>

