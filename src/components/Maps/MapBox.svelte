<script type="ts">
  import { onMount, setContext } from "svelte";
  import {
    PUBLIC_BASE_WIND_URL,
    PUBLIC_BASE_WMS_URL,
    PUBLIC_BASE_FRIMS_WMS_URL,
    PUBLIC_MAPBOX_KEY,
  } from "$env/static/public";
  import mapboxgl from "mapbox-gl";
  import { contextKey } from "../Maps/mapbox";
  import {
    forecastedTime,
    forecastedDate,
    PollutantTileUrl,
    intializationDate,
  } from "../../stores/dateTimeStore";
  import {
    baseMapStyle,
    selectedProduct,
    selectedPollutant,
    selectedFire,
    ShowStation,
    ShowPollutant,
    ShowFire,
    drawCoords,
    drawType,
    selectedProductLayer,
  } from "../../stores/app";
  // helpers
  import {
    clearLayer,
    clearSource,
    resetWind,
    getEventObject,
  } from "../../helpers/MapFunctions.js";

  export let map;

  let mapContainer;
  let lng, lat, zoom;
  let popup;
  let windy;
  let timeout;
  let mapMarkers = [];
  let currentFire = "";

  setContext(contextKey, {
    getMap: () => map,
    getMapBoxDraw: () => Draw,
  });

  mapboxgl.accessToken = PUBLIC_MAPBOX_KEY;
  lng = 105.224518;
  lat = 11.113995;
  zoom = 4;

  function updateData() {
    zoom = map.getZoom();
    lng = map.getCenter().lng;
    lat = map.getCenter().lat;
  }

  function addFireTileMap(layername) {
    currentFire = layername;
    setTimeout(() => {
      // Always remove the layer first to avoid an error
      clearLayer(map, "fire-wms-layer");
      clearSource(map, "fire-wms-source");

      let firetileurl =
        PUBLIC_BASE_FRIMS_WMS_URL +
        `?REQUEST=GetMap&layers=fires_viirs_24&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;

      if (layername === "fires_viirs_24") {
        firetileurl =
          PUBLIC_BASE_FRIMS_WMS_URL +
          `?REQUEST=GetMap&layers=${layername}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;
      } else if (layername === "fires_viirs_48") {
        firetileurl =
          PUBLIC_BASE_FRIMS_WMS_URL +
          `?REQUEST=GetMap&layers=${layername}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;
      } else if (layername === "fires_viirs_time") {
        firetileurl =
          PUBLIC_BASE_FRIMS_WMS_URL +
          `?REQUEST=GetMap&layers=fires_viirs&TIME=${$forecastedDate}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;
      }
      map.addSource("fire-wms-source", {
        type: "raster",
        tiles: [firetileurl],
        tileSize: 512,
      });

      map.addLayer(
        {
          id: "fire-wms-layer",
          type: "raster",
          source: "fire-wms-source",
          paint: {},
        },
        "building" // Place layer under labels, roads and buildings.
      );
      map.setPaintProperty("fire-wms-layer", "raster-opacity", 0.8);
    }, 200);
  }

  function addTileMap(pollutant, prod) {
    setTimeout(() => {
      // Always remove the layer first to avoid an error
      clearLayer(map, "wms-layer");
      clearSource(map, "wms-source");
	  // lastest available date in YYYY-MM-dd format
	  let initDate =
          $intializationDate.substr(0, 4) +
          "-" +
          $intializationDate.substr(4, 2) +
          "-" +
          $intializationDate.substr(6, 2);

        // compare two date the lastest date and forecasting date
        let date1 = new Date(initDate);
        let date2 = new Date($forecastedDate);
        let ncFileName = "";


      if (pollutant === "pm25") {
        if (date1 > date2) {
          // checking if latest available date is greater than forecasting date; set ncFilename = forecasting date
          ncFileName = $forecastedDate.replace("-", "").replace("-", "");
        } else if (date1 < date2) {
          // checking if latest available date is less than forecasting date; set ncFilename = forecasting date
          ncFileName = $intializationDate;

          let next2DaysFromLatestDataDate = moment(date1).add(2, "days");

          // checking if the selected forecasting date is over 2 days from the latest date
          if (date2 > next2DaysFromLatestDataDate) {
            alert("No available data for " + $forecastedDate);
            ncFileName = "";
          }
        } else {
          // in case the latested date is the same as the selected forecasting date, getting data from the latest nc file
          ncFileName = $forecastedDate.replace("-", "").replace("-", "");
        }

        if (ncFileName !== "") {
          $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${ncFileName}.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image/png
					&transparent=true
					&version=1.3.0
					&time=${$forecastedDate}T${$forecastedTime.replace("h", "")}:30:00Z
					&colorscalerange=0%2C300
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`;
        }
      }

      if (pollutant === "no2") {
		ncFileName = "GEMS_NO2_20240228_0645_FC_SERVIRSEA" 
        $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${ncFileName}.nc?service=WMS
				&request=GetMap
				&layers=${$selectedProductLayer}
				&styles=default-scalar%2Fno2
				&format=image%2Fpng
				&transparent=true
				&version=1.3.0
				&colorscalerange=0%2C5
				&abovemaxcolor=extend
				&belowmincolor=extend
				&width=256
				&height=256
				&crs=EPSG:3857
				&bbox={bbox-epsg-3857}`;
      }

	  if(ncFileName !== "") {

	map.addSource("wms-source", {
        type: "raster",
        tiles: [$PollutantTileUrl],
        tileSize: 256,
      });

      map.addLayer(
        {
          id: "wms-layer",
          name: "wms-layer",
          type: "raster",
          source: "wms-source",
          paint: {
			'raster-fade-duration': 0,
			"raster-opacity": 0.7
		  },
        },
        "building" // Place layer under labels, roads and buildings.
      );


      let layers = map.getStyle().layers;
      let layerIds = layers.map((l) => l.id);

      // if there is fire layer showing on the map
      if (layerIds.includes("fire-wms-layer")) {
        console.log("fire layer active");
        // set map layer order by showing fire layer on top of pollutant map layer
        map.moveLayer("wms-layer", "fire-wms-layer");
      }
	  }
      
    }, 200);
  }


  function updateTiles(pollutant, prod) {
    setTimeout(() => {

	  // lastest available date in YYYY-MM-dd format
	  let initDate =
          $intializationDate.substr(0, 4) +
          "-" +
          $intializationDate.substr(4, 2) +
          "-" +
          $intializationDate.substr(6, 2);

        // compare two date the lastest date and forecasting date
        let date1 = new Date(initDate);
        let date2 = new Date($forecastedDate);
        let ncFileName = "";


      if (pollutant === "pm25") {
        if (date1 > date2) {
          // checking if latest available date is greater than forecasting date; set ncFilename = forecasting date
          ncFileName = $forecastedDate.replace("-", "").replace("-", "");
        } else if (date1 < date2) {
          // checking if latest available date is less than forecasting date; set ncFilename = forecasting date
          ncFileName = $intializationDate;

          let next2DaysFromLatestDataDate = moment(date1).add(2, "days");

          // checking if the selected forecasting date is over 2 days from the latest date
          if (date2 > next2DaysFromLatestDataDate) {
            alert("No available data for " + $forecastedDate);
            ncFileName = "";
          }
        } else {
          // in case the latested date is the same as the selected forecasting date, getting data from the latest nc file
          ncFileName = $forecastedDate.replace("-", "").replace("-", "");
        }

        if (ncFileName !== "") {
          $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${ncFileName}.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image/png
					&transparent=true
					&version=1.3.0
					&time=${$forecastedDate}T${$forecastedTime.replace("h", "")}:30:00Z
					&colorscalerange=0%2C300
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`;
        }
      }

      if (pollutant === "no2") {
		ncFileName = "GEMS_NO2_20240228_0645_FC_SERVIRSEA" 
        $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${ncFileName}.nc?service=WMS
				&request=GetMap
				&layers=${$selectedProductLayer}
				&styles=default-scalar%2Fno2
				&format=image%2Fpng
				&transparent=true
				&version=1.3.0
				&colorscalerange=0%2C5
				&abovemaxcolor=extend
				&belowmincolor=extend
				&width=256
				&height=256
				&crs=EPSG:3857
				&bbox={bbox-epsg-3857}`;
      }

	  	// map.getSource('wms-source').setTiles([$PollutantTileUrl]);
		map.getSource('wms-source').tiles = [ $PollutantTileUrl ]
		map.style._sourceCaches['other:wms-source'].clearTiles();
		map.style._sourceCaches['other:wms-source'].update(map.transform)


      let layers = map.getStyle().layers;
      let layerIds = layers.map((l) => l.id);

      // if there is fire layer showing on the map
      if (layerIds.includes("fire-wms-layer")) {
        console.log("fire layer active");
        // set map layer order by showing fire layer on top of pollutant map layer
        map.moveLayer("wms-layer", "fire-wms-layer");
      }
	  
	  
      
    }, 50);
  }


  function removeDrawFeature() {
    const data = Draw.getAll();
    var pids = [];
    const lid = data.features[data.features.length - 1].id;
    data.features.forEach((f) => {
      if (f.id !== lid) {
        pids.push(f.id);
      }
    });
    Draw.delete(pids);
  }

  onMount(() => {
    const initialState = { lng: lng, lat: lat, zoom: zoom };
    map = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/servirmekong/cltiptdlg004y01ph1rm84xru",
      zoom: initialState.zoom,
      center: [initialState.lng, initialState.lat],
      maxBounds: [
        [-180, -60], // Southwest coordinates
        [180, 70], // Northeast coordinates
      ],
    });
    // Add zoom and rotation controls to the map.
    const navigationControlOptions = {
      showCompass: false,
    };
    map.addControl(
      new mapboxgl.NavigationControl(navigationControlOptions),
      "bottom-right"
    );

    // map.on("click", "wms-layer", (e) => {
    //   if (mapMarkers.length > 0) {
    //     // removing
    //     mapMarkers.forEach((marker) => marker.remove());
    //     mapMarkers = [];
    //   } else {
    //     // removing
    //     mapMarkers.forEach((marker) => marker.remove());
    //     mapMarkers = [];

    //     let lngLat = e.lngLat;
    //     const monument = [lngLat.lng.toFixed(3), lngLat.lat.toFixed(3)];

    //     $drawCoords = monument.toString();
    //     $drawType = "Point";

    //     // create the popup
    //     popup = new mapboxgl.Popup({
    //       offset: 5,
    //       className: "mapboxgl-popup-close-button",
    //     }).setText(
    //       "Lat: " + lngLat.lat.toFixed(3) + " Lon: " + lngLat.lng.toFixed(3)
    //     );

    //     // create DOM element for the marker
    //     const el = document.createElement("div");
    //     el.id = "marker";

    //     // create the marker
    //     const marker = new mapboxgl.Marker(el)
    //       .setLngLat([lngLat.lng, lngLat.lat])
    //       .setPopup(popup) // sets a popup on this marker
    //       .addTo(map)
    //       .togglePopup();

    //     mapMarkers.push(marker);
    //   }

    //   let btnPopupClose = document.querySelectorAll(
    //     ".mapboxgl-popup-close-button"
    //   );
    //   let btnPopupRemove = Array.from(btnPopupClose)[0];
    //   btnPopupRemove.addEventListener("click", function (e) {
    //     popup.remove();
    //     mapMarkers.forEach((marker) => marker.remove());
    //     mapMarkers = [];
    //   });
    // });

    map.on("draw.modechange", (e) => {
      removeDrawFeature();
    });

    map.on("draw.update", function (e) {
      // Draw.deleteAll()
      // This will call once you edit drawn polygon
    });

    map.on("draw.delete", function (e) {
      console.log("delete");
    });

    map.on("move", () => {
      updateData();
      resetWind(map, windy, timeout);
    });

    map.on("resize", (e) => {
      resetWind(map, windy, timeout);
    });

    // get wind map
    fetch(PUBLIC_BASE_WIND_URL)
      .then((d) => d.json())
      .then((data) => {
        console.log(data);
        // Remember - dom elements with ID, are exposed globally, so mapcanvas element exists already
        windy = new Windy({ canvas: mapcanvas, data: data });
        resetWind(map, windy, timeout);
      });
  });

  $: if ($intializationDate !== "") {
    addTileMap($selectedPollutant, $selectedProduct);
  }

  // call tile map layer when date and time were selected
//   $: if (
//     $forecastedDate !== "" &&
//     $forecastedTime !== "" &&
//     $intializationDate !== ""
//   ) {
// 	console.log('update 1')
//     updateTiles($selectedPollutant, $selectedProduct);
//   }

  // call tile map layer when product, date and time were selected
  $: if (
    $selectedProductLayer &&
    $intializationDate !== "" &&
	$forecastedDate !== "" &&
    $forecastedTime !== "" &&
    map.getLayer("wms-layer")
  ) {
    updateTiles($selectedPollutant, $selectedProduct);
  }

  $: if ($baseMapStyle !== "") {
    let layers = map.getStyle().layers;
    let layerIds = layers.map((l) => l.id);
    map.setStyle("mapbox://styles/servirmekong/" + $baseMapStyle);
    setTimeout(() => {
      if (layerIds.includes("wms-layer")) {
        updateTiles($selectedPollutant, $selectedProduct);
      }
      // if there is fire layer showing on the map
      if (layerIds.includes("fire-wms-layer")) {
        addFireTileMap($selectedFire);
      }
    }, 50);
  }

  $: if (map && $ShowFire == false && map.getLayer("fire-wms-layer")) {
    clearLayer(map, "fire-wms-layer");
    clearSource(map, "fire-wms-source");
    // map.setPaintProperty('fire-wms-layer', 'raster-opacity', 0);
  }
  $: if (map && $ShowFire == true && !map.getLayer("fire-wms-layer")) {
    addFireTileMap($selectedFire);
  }

  $: if ($selectedFire !== currentFire && map && $ShowFire == true) {
    addFireTileMap($selectedFire);
  }

  $: if (map && $ShowFire == true && map.getLayer("fire-wms-layer")) {
    map.setPaintProperty("fire-wms-layer", "raster-opacity", 0.9);
  }

  $: if (map && $ShowStation == false) {
    clearLayer(map, "station-point");
    clearLayer(map, "marker-text");
    clearSource(map, "station-data");
  }

  $: if (map && $ShowPollutant == false) {
    map.setPaintProperty("wms-layer", "raster-opacity", 0);
  }

  $: if (map && $ShowPollutant == true && map.getLayer("wms-layer")) {
    console.log("ShowPollutant ture", $selectedPollutant, $selectedProduct);
    map.setPaintProperty("wms-layer", "raster-opacity", 0.7);
  }

  export function getMap() {
    return map;
  }
</script>

<div class="wind-map-container">
  <canvas id="mapcanvas" class="relative w-full h-screen"></canvas>
</div>

<div
  id="map-container"
  class="relative w-full h-screen"
  bind:this={mapContainer}
></div>
