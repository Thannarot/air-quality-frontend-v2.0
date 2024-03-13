
<script>
    export function closeDrawer(){
      document.getElementById("close-btn-info").click()
    }

    
 </script>
  <!-- information layers -->
  <div id="drawer-information" class="fixed top-0 md:ml-64 z-3 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white w-80 dark:bg-gray-800" tabindex="-1" aria-labelledby="drawer-information-label">
     <h5 id="drawer-information-label" class="inline-flex items-center mb-6 text-base font-semibold text-gray-900 uppercase dark:text-gray-400">
       <i class="fa fa-info-circle mr-2"/> 
       Information
    </h5>
     <button id="close-btn-info" type="button" data-drawer-hide="drawer-information" aria-controls="drawer-information" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white" >
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
           <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
        <span class="sr-only">Close menu</span>
     </button>
    
   <div class="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900" role="alert">
      <div class="flex items-center mb-3">
         <span class="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Disclaimer</span>
      </div>
      <p class="mb-3 text-xs text-blue-800 dark:text-blue-400">
         This platform serves as a valuable tool for Pembina, allowing them to assess and monitor their existing pipeline infrastructure, while also facilitating the ingestion of their own data, including planned projects or assets of competing companies.
      </p>
   </div>

   <div class="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900" role="alert">
      <div class="flex items-center mb-3">
         <span class="bg-orange-100 text-orange-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">Demo version</span>
      </div>
      <p class="mb-3 text-xs text-blue-800 dark:text-blue-400">
         This platform serves as a valuable tool for Pembina, allowing them to assess and monitor their existing pipeline infrastructure, while also facilitating the ingestion of their own data, including planned projects or assets of competing companies.
      </p>
   </div>

  </div>
  