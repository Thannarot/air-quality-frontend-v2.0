<script lang="ts">
	import 'bootstrap/dist/css/bootstrap.min.css';
    // import 'bootstrap/dist/js/bootstrap.min.js';
	import "../app.css";


    let visible = false;

    function toggleVissible() {
        visible = true;
        document.querySelectorAll('#lang-options').forEach(
              el =>  el.style.display = el.style.display === 'none' ? 'block' : 'none'
          );
    }

  </script>
 

<div id="header">
    <div class="banner-container">
        <div class="row no-gutters align-items-center justify-content-between">
            <div class="col-auto">
                <div class="row no-gutters align-items-center">
                    <div class="col-auto">
                        <a href="#"><img class="d-block usaid" src="assets/img/icon/logo__usaid.png" alt=""></a>
                    </div>
                    <div class="col-auto">
                        <a href="#"><img class="d-block nasa" src="assets/img/icon/logo__nasa.png" alt=""></a>
                    </div>
                    <div class="col-auto">
                        <a href="#"><img class="d-block adpc" src="assets/img/icon/logo__adpc.png" alt=""></a>
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <a href="#"><img class="d-block servir-mekong" src="assets/img/icon/logo__servir-mekong.png" alt=""></a>
            </div>
        </div>
    </div>

    <div class="nav-container">
        <p class="title-page">MEKONG AIR QUALITY EXPLORER</p>
        <div class="row no-gutters align-items-center justify-content-between h-100">
            <div class="col-auto">
                <div id="nav__main">
                    <ul class="list">
                        <li><a href="https://servir.adpc.net/tools/mekong-air-quality-explorer">Home</a></li>
                        <!-- <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSfdiwCI3WH7mknt2XSd9PVcjJiMzNW9dXKBcen3znIpn-y5XA/viewform?pli=1">Feedback</a></li> -->

                    </ul>
                </div>
            </div>
            <div class="col-auto">
                <div class="box__language" on:click={toggleVissible}>
                    <a id="lang-btn" class="btn-toggle d-flex">
                        <p class="text white text-xs font-light rounded-pill mb-0 px-15">LANGUAGE</p>
                        <p class="flag d-flex align-items-center justify-content-center rounded-pill mb-0">
                            <img src="assets/img/icon/lang-en.png" alt="">
                            <img style="display: none;" src="assets/img/icon/lang-th.png" alt="">
                        </p>
                    </a>
                    { #if visible }
                    <div id="lang-options" class="info py-15 px-1" style="display:block">
						<a href="#" class="d-block text-xs px-15 rounded-pill w-100 link mb-1 active">ENGLISH <img src="assets/img/icon/lang-en.png" alt=""></a>
                        <a href="#" class="d-block text-xs px-15 rounded-pill w-100 link">THAI <img src="assets/img/icon/lang-th.png" alt=""></a>
                    </div>
                    {/if}
                </div>  
            </div>
        </div>
    </div>
</div>
  
  <slot />
  