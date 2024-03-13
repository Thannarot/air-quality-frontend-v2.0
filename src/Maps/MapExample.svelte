<script>
  import { onMount } from "svelte";
  export let map;

  // init google maps
  onMount(async () => {
    let google = window.google;
    map = document.getElementById("map-canvas");
    let lat = map.getAttribute("data-lat");
    let lng = map.getAttribute("data-lng");
    const myLatlng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
      zoom: 5,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
      scrollwheel: false,
      mapTypeControl: false,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(map, mapOptions);
  });

</script>

<div
  id="map-canvas"
  class="relative w-full h-screen"
  data-lat="13.607059939739344"
  data-lng="100.19595735763959"
></div>
