import { K as writable, S as SvelteComponent, i as init, s as safe_not_equal, e as element, a as space, b as claim_element, g as get_svelte_dataset, f as claim_space, d as children, h as detach, j as attr, k as insert_hydration, L as noop, M as component_subscribe, N as setContext, O as mapboxgl, w as onMount, P as set_store_value, C as binding_callbacks, Q as DateInput, R as bind, T as RangeSlider, y as text, F as create_component, z as claim_text, G as claim_component, x as set_style, l as append_hydration, H as mount_component, A as set_data, U as add_flush_callback, t as transition_in, p as transition_out, I as destroy_component, V as axios, c as create_slot, m as listen, W as stop_propagation, X as self, u as update_slot_base, n as get_all_dirty_from_scope, o as get_slot_changes, Y as run_all, Z as onDestroy, $ as bubble, a0 as linear, a1 as select, a2 as axisBottom, a3 as ensure_array_like, a4 as add_render_callback, a5 as select_option, a6 as destroy_each, a7 as set_input_value, a8 as select_value, a9 as src_url_equal, aa as Drawer, ab as CloseButton, ac as sineIn, ad as Chart, r as check_outros, B as group_outros, ae as qs } from "../chunks/vendor.CUpO6_gn.js";
const ssr = false;
const csr = true;
const prerender = true;
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  csr,
  prerender,
  ssr
}, Symbol.toStringTag, { value: "Module" }));
const PUBLIC_BASE_API_URL = "http://localhost:8080/api/";
const PUBLIC_BASE_WMS_URL = "http://216.218.240.247:8080/thredds/wms/";
const PUBLIC_BASE_WIND_URL = "https://wind-data-servir.adpc.net/latest";
const contextKey = {};
const forecastedDate = writable("");
const forecastedTime = writable("");
const intializationDate = writable("");
const PollutantTileUrl = writable("");
const selectedDate_str = writable("");
const selectedTime_str = writable("");
const baseMapStyle = writable("");
const pcdshow = writable(false);
const selectedProduct = writable("");
const selectedPollutant = writable("");
const selectedProductLayer = writable("");
const selectedStation = writable("");
const selectedFire = writable("");
const ShowStation = writable(false);
const ShowPollutant = writable(false);
const ShowFire = writable(false);
const ShowMapSetting = writable(false);
const ShowPollutantSelect = writable(false);
const drawCoords = writable("");
const drawType = writable("");
const hiddenDrawer = writable(false);
const hiddenBottomDrawer = writable(false);
const locx = writable("");
const locy = writable("");
const locname = writable("");
const selectOptions = writable([{
  value: "BC_DNN_PM25",
  name: "PM2.5"
}]);
function clearLayer(map, id) {
  if (map.getLayer(id)) {
    map.removeLayer(id);
  }
}
function clearSource(map, id) {
  if (map.getSource(id)) {
    map.removeSource(id);
  }
}
function createMarker(map, mapboxgl2, data) {
  clearLayer(map, "station-point");
  clearLayer(map, "marker-text");
  clearSource(map, "station-data");
  map.addSource("station-data", {
    type: "geojson",
    data,
    cluster: false
  });
  map.addLayer({
    id: "station-point",
    type: "circle",
    source: "station-data",
    paint: {
      "circle-color": ["get", "color_class"],
      "circle-radius": 10,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff"
    }
  });
  map.addLayer({
    id: "marker-text",
    type: "symbol",
    source: "station-data",
    layout: {
      "text-field": ["get", "pm25"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12
    }
  });
  map.setLayerZoomRange("station-point", 2, 22);
  map.setLayerZoomRange("marker-text", 2, 22);
  map.on("click", "station-point", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    console.log(
      e.features[0].properties.name
    );
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new mapboxgl2.Popup().setLngLat(coordinates).setHTML(
      '<div class="point-popup-val">' + e.features[0].properties.name + // '<span id="open-statistic-button"  style="float: right; cursor: pointer;">' +
      // '<i class="fa fa-signal mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent" aria-hidden="true"></i>' +
      // '</span>'+ 
      "</div>"
    ).addTo(map);
  });
  map.on("mouseenter", "clusters", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "clusters", () => {
    map.getCanvas().style.cursor = "";
  });
}
function createFeatureCollection(data) {
  var geojson = {
    "type": "FeatureCollection",
    "features": []
  };
  for (var i = 0; i < data.length; i++) {
    var id = data[i]["rid"];
    let stationsID = data[i]["station_id"];
    let latest_data = data[i]["latest_data"];
    let lon = data[i]["lon"];
    let lat = data[i]["lat"];
    let pm25 = data[i]["pm25"];
    let name = data[i]["name"];
    let aqi = data[i]["aqi"];
    let aqi_level = data[i]["aqi_level"];
    let color_class = "#000000";
    if (pm25 > 80) {
      color_class = "#DE544D";
    } else if (pm25 <= 80 && pm25 > 60) {
      color_class = "#F2A63B";
    } else if (pm25 <= 60 && pm25 > 40) {
      color_class = "#FFFF54";
    } else if (pm25 <= 40 && pm25 > 20) {
      color_class = "#9FCE62";
    } else if (pm25 <= 20) {
      color_class = "#6ACAFA";
    }
    let properties = {
      "id": id,
      "stationsID": stationsID,
      "latest_data": latest_data,
      "lon": lon,
      "lat": lat,
      "pm25": pm25,
      "name": name,
      "aqi": aqi,
      "aqi_level": aqi_level,
      "color_class": color_class
    };
    geojson.features.push({
      "type": "Feature",
      "properties": properties,
      "geometry": {
        "type": "Point",
        "coordinates": [lon, lat]
      }
    });
  }
  return geojson;
}
function create_fragment$b(ctx) {
  let div0;
  let textContent = `<canvas id="mapcanvas" class="relative w-full h-screen"></canvas>`;
  let t;
  let div1;
  return {
    c() {
      div0 = element("div");
      div0.innerHTML = textContent;
      t = space();
      div1 = element("div");
      this.h();
    },
    l(nodes) {
      div0 = claim_element(nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-lapt2t")
        div0.innerHTML = textContent;
      t = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", { id: true, class: true });
      children(div1).forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "wind-map-container");
      attr(div1, "id", "map-container");
      attr(div1, "class", "relative w-full h-screen");
    },
    m(target, anchor) {
      insert_hydration(target, div0, anchor);
      insert_hydration(target, t, anchor);
      insert_hydration(target, div1, anchor);
      ctx[16](div1);
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div0);
        detach(t);
        detach(div1);
      }
      ctx[16](null);
    }
  };
}
function getEventObject(map) {
  const canvas = map.getCanvas();
  const dimensions = map.getBounds();
  const result = {
    width: canvas.width,
    height: canvas.height,
    north: dimensions.getNorth(),
    south: dimensions.getSouth(),
    west: dimensions.getWest(),
    east: dimensions.getEast(),
    zoomLevel: map.getZoom()
  };
  return result;
}
function instance$b($$self, $$props, $$invalidate) {
  let $selectedProduct;
  let $selectedPollutant;
  let $ShowPollutant;
  let $ShowStation;
  let $ShowFire;
  let $selectedFire;
  let $baseMapStyle;
  let $intializationDate;
  let $selectedProductLayer;
  let $forecastedTime;
  let $forecastedDate;
  let $drawType;
  let $drawCoords;
  let $PollutantTileUrl;
  component_subscribe($$self, selectedProduct, ($$value) => $$invalidate(5, $selectedProduct = $$value));
  component_subscribe($$self, selectedPollutant, ($$value) => $$invalidate(6, $selectedPollutant = $$value));
  component_subscribe($$self, ShowPollutant, ($$value) => $$invalidate(7, $ShowPollutant = $$value));
  component_subscribe($$self, ShowStation, ($$value) => $$invalidate(8, $ShowStation = $$value));
  component_subscribe($$self, ShowFire, ($$value) => $$invalidate(9, $ShowFire = $$value));
  component_subscribe($$self, selectedFire, ($$value) => $$invalidate(10, $selectedFire = $$value));
  component_subscribe($$self, baseMapStyle, ($$value) => $$invalidate(11, $baseMapStyle = $$value));
  component_subscribe($$self, intializationDate, ($$value) => $$invalidate(12, $intializationDate = $$value));
  component_subscribe($$self, selectedProductLayer, ($$value) => $$invalidate(13, $selectedProductLayer = $$value));
  component_subscribe($$self, forecastedTime, ($$value) => $$invalidate(14, $forecastedTime = $$value));
  component_subscribe($$self, forecastedDate, ($$value) => $$invalidate(15, $forecastedDate = $$value));
  component_subscribe($$self, drawType, ($$value) => $$invalidate(25, $drawType = $$value));
  component_subscribe($$self, drawCoords, ($$value) => $$invalidate(26, $drawCoords = $$value));
  component_subscribe($$self, PollutantTileUrl, ($$value) => $$invalidate(27, $PollutantTileUrl = $$value));
  let { map } = $$props;
  let { Draw } = $$props;
  let mapContainer;
  let lng, lat, zoom;
  let popup;
  let windy;
  let timeout;
  let mapMarkers = [];
  let currentFire = "";
  setContext(contextKey, {
    getMap: () => map,
    getMapBoxDraw: () => Draw
  });
  mapboxgl.accessToken = "pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g";
  lng = 105.224518;
  lat = 11.113995;
  zoom = 4;
  function updateData() {
    zoom = map.getZoom();
    lng = map.getCenter().lng;
    lat = map.getCenter().lat;
  }
  function addTileMap(pollutant, prod) {
    console.log("addTileMap");
    console.log($selectedPollutant);
    console.log($selectedProduct);
    console.log($selectedProductLayer);
    setTimeout(
      () => {
        clearLayer(map, "wms-layer");
        clearSource(map, "wms-source");
        const initDate = $intializationDate.replace("-", "").replace("-", "");
        console.log("Initialization Date", initDate);
        if (pollutant === "pm25") {
          if (prod === "geos") {
            set_store_value(
              PollutantTileUrl,
              $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${initDate}.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image%2Fpng
					&transparent=true
					&version=1.3.0
					&time=${$forecastedDate}T${$forecastedTime.replace("h", "")}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`,
              $PollutantTileUrl
            );
          } else if (prod === "geos5") {
            set_store_value(
              PollutantTileUrl,
              $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/20230507.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image/png;mode=32bit
					&transparent=true
					&version=1.3.0
					&time=2023-05-7T${$forecastedTime.replace("h", "")}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`,
              $PollutantTileUrl
            );
          }
        }
        if (pollutant === "no2") {
          set_store_value(
            PollutantTileUrl,
            $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/GEMS_NO2_20240228_0645_FC_SERVIRSEA.nc?service=WMS
				&request=GetMap
				&layers=${$selectedPollutant}
				&styles=default-scalar%2Fno2
				&format=image%2Fpng
				&transparent=true
				&version=1.3.0
				&colorscalerange=0%2C5
				&abovemaxcolor=extend
				&belowmincolor=extend
				&width=256&height=256
				&crs=EPSG:3857
				&bbox={bbox-epsg-3857}`,
            $PollutantTileUrl
          );
        }
        map.addSource("wms-source", {
          type: "raster",
          tiles: [$PollutantTileUrl],
          tileSize: 256
        });
        map.addLayer(
          {
            id: "wms-layer",
            // Place layer under labels, roads and buildings.
            name: "wms-layer",
            type: "raster",
            source: "wms-source",
            paint: {}
          },
          "building"
          // Place layer under labels, roads and buildings.
        );
        map.setPaintProperty("wms-layer", "raster-opacity", 0.7);
        let layers = map.getStyle().layers;
        let layerIds = layers.map((l) => l.id);
        if (layerIds.includes("fire-wms-layer")) {
          console.log("fire layer active");
          map.moveLayer("wms-layer", "fire-wms-layer");
        }
      },
      200
    );
  }
  function addFireTileMap(layername) {
    $$invalidate(4, currentFire = layername);
    setTimeout(
      () => {
        clearLayer(map, "fire-wms-layer");
        clearSource(map, "fire-wms-source");
        const initDate = $intializationDate.replace("-", "").replace("-", "");
        console.log("Initialization Date", initDate);
        let firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserve/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=fires_viirs_24&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;
        if (layername === "fires_viirs_24") {
          firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=${layername}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;
        } else if (layername === "fires_viirs_48") {
          firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=${layername}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;
        } else if (layername === "fires_viirs_time") {
          firetileurl = `https://firms.modaps.eosdis.nasa.gov/mapserver/wms/fires/37601af187a7c4054759a42043b19adc/?REQUEST=GetMap&layers=fires_viirs&TIME=${$forecastedDate}&WIDTH=512&HEIGHT=512&bbox={bbox-epsg-3857}0&SRS=EPSG:3857`;
        }
        map.addSource("fire-wms-source", {
          type: "raster",
          tiles: [firetileurl],
          tileSize: 512
        });
        map.addLayer(
          {
            id: "fire-wms-layer",
            // Place layer under labels, roads and buildings.
            type: "raster",
            source: "fire-wms-source",
            paint: {}
          },
          "building"
          // Place layer under labels, roads and buildings.
        );
        map.setPaintProperty("fire-wms-layer", "raster-opacity", 0.8);
      },
      200
    );
  }
  function updateTileMap(pollutant, prod) {
    console.log("updateTileMap");
    setTimeout(
      () => {
        const initDate = $intializationDate.replace("-", "").replace("-", "");
        if (pollutant === "pm25") {
          if (prod === "geos") {
            set_store_value(
              PollutantTileUrl,
              $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/${initDate}.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image%2Fpng
					&transparent=true
					&version=1.3.0
					&time=${$forecastedDate}T${$forecastedTime.replace("h", "")}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`,
              $PollutantTileUrl
            );
          } else if (prod === "geos5") {
            set_store_value(
              PollutantTileUrl,
              $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/20230507.nc?service=WMS
					&request=GetMap
					&layers=${$selectedProductLayer}
					&styles=default-scalar%2Fpm25
					&format=image/png;mode=32bit
					&transparent=true
					&version=1.3.0
					&time=2023-05-7T${$forecastedTime.replace("h", "")}:30:00Z
					&colorscalerange=0%2C200
					&abovemaxcolor=extend
					&belowmincolor=extend
					&width=256
					&height=256
					&crs=EPSG:3857
					&bbox={bbox-epsg-3857}`,
              $PollutantTileUrl
            );
          }
        }
        if (pollutant === "no2") {
          set_store_value(
            PollutantTileUrl,
            $PollutantTileUrl = `${PUBLIC_BASE_WMS_URL}/ServirData/${$selectedProduct}/GEMS_NO2_20240228_0645_FC_SERVIRSEA.nc?service=WMS
				&request=GetMap
				&layers=${$selectedProductLayer}
				&styles=default-scalar%2Fno2
				&format=image%2Fpng
				&transparent=true
				&version=1.3.0
				&colorscalerange=0%2C5
				&abovemaxcolor=extend
				&belowmincolor=extend
				&width=256&height=256
				&crs=EPSG:3857
				&bbox={bbox-epsg-3857}`,
            $PollutantTileUrl
          );
        }
        map.getSource("wms-source").setTiles([$PollutantTileUrl]);
      },
      200
    );
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
  function resetWind(map2) {
    const obj = getEventObject(map2);
    const { zoomLevel, north, south, west, east, width, height } = obj;
    mapcanvas.style.display = "none";
    if (windy) {
      windy.stop();
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(
      function() {
        let particleWidth = 3;
        if (zoomLevel > 2) {
          particleWidth = 4;
        }
        if (zoomLevel > 3) {
          particleWidth = 4.5;
        }
        if (zoomLevel > 4) {
          particleWidth = 4.7;
        }
        if (zoomLevel > 5) {
          particleWidth = 4.8;
        }
        if (zoomLevel > 6) {
          particleWidth = 5;
        }
        mapcanvas.style.display = "initial";
        mapcanvas.width = width;
        mapcanvas.height = height;
        windy.start([[0, 0], [width, height]], width, height, [[west, south], [east, north]], {
          particleLineWidth: particleWidth,
          zoomLevel
        });
      },
      500
    );
  }
  onMount(() => {
    const initialState = { lng, lat, zoom };
    $$invalidate(1, map = new mapboxgl.Map({
      container: mapContainer,
      // style: 'mapbox://styles/servirmekong/ckebgnyea0s8219ki3dfp8von',
      // style: 'mapbox://styles/servirmekong/ckb2mbm240t2s1itc1dtmk5pf',
      // style: 'mapbox://styles/servirmekong/cltinohfj002101pc7cut13aj', 
      style: "mapbox://styles/servirmekong/cltiptdlg004y01ph1rm84xru",
      zoom: initialState.zoom,
      center: [initialState.lng, initialState.lat],
      maxBounds: [[-180, -60], [180, 70]]
      // Southwest coordinates
      // Northeast coordinates
    }));
    const navigationControlOptions = { showCompass: false };
    map.addControl(new mapboxgl.NavigationControl(navigationControlOptions), "bottom-right");
    map.on("click", "wms-layer", (e) => {
      if (mapMarkers.length > 0) {
        mapMarkers.forEach((marker) => marker.remove());
        mapMarkers = [];
      } else {
        mapMarkers.forEach((marker2) => marker2.remove());
        mapMarkers = [];
        let lngLat = e.lngLat;
        const monument = [lngLat.lng.toFixed(3), lngLat.lat.toFixed(3)];
        set_store_value(drawCoords, $drawCoords = monument.toString(), $drawCoords);
        set_store_value(drawType, $drawType = "Point", $drawType);
        popup = new mapboxgl.Popup({
          offset: 5,
          className: "mapboxgl-popup-close-button"
        }).setText("Lat: " + lngLat.lat.toFixed(3) + " Lon: " + lngLat.lng.toFixed(3));
        const el = document.createElement("div");
        el.id = "marker";
        const marker = new mapboxgl.Marker(el).setLngLat([lngLat.lng, lngLat.lat]).setPopup(popup).addTo(
          map
        ).togglePopup();
        mapMarkers.push(marker);
      }
      let btnPopupClose = document.querySelectorAll(".mapboxgl-popup-close-button");
      let btnPopupRemove = Array.from(btnPopupClose)[0];
      btnPopupRemove.addEventListener("click", function(e2) {
        popup.remove();
        mapMarkers.forEach((marker) => marker.remove());
        mapMarkers = [];
      });
    });
    map.on("draw.modechange", (e) => {
      removeDrawFeature();
    });
    map.on("draw.update", function(e) {
    });
    map.on("draw.delete", function(e) {
      console.log("delete");
    });
    map.on("move", () => {
      updateData();
      resetWind(map);
    });
    map.on("resize", (e) => {
      resetWind(map);
    });
    fetch(PUBLIC_BASE_WIND_URL).then((d) => d.json()).then((data) => {
      console.log(data);
      windy = new Windy({ canvas: mapcanvas, data });
      resetWind(map);
    });
  });
  function getMap() {
    return map;
  }
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      mapContainer = $$value;
      $$invalidate(0, mapContainer);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("map" in $$props2)
      $$invalidate(1, map = $$props2.map);
    if ("Draw" in $$props2)
      $$invalidate(2, Draw = $$props2.Draw);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*$intializationDate, $selectedPollutant, $selectedProduct*/
    4192) {
      if ($intializationDate !== "") {
        addTileMap($selectedPollutant, $selectedProduct);
      }
    }
    if ($$self.$$.dirty[0] & /*$forecastedDate, $forecastedTime, $intializationDate, map, $selectedPollutant, $selectedProduct*/
    53346) {
      if ($forecastedDate !== "" && $forecastedTime !== "" && $intializationDate !== "" && map.getLayer("wms-layer")) {
        updateTileMap($selectedPollutant, $selectedProduct);
      }
    }
    if ($$self.$$.dirty[0] & /*$selectedProductLayer, $intializationDate, map, $selectedPollutant, $selectedProduct*/
    12386) {
      if ($selectedProductLayer && $intializationDate !== "" && map.getLayer("wms-layer")) {
        updateTileMap($selectedPollutant, $selectedProduct);
      }
    }
    if ($$self.$$.dirty[0] & /*$baseMapStyle, map, $selectedPollutant, $selectedProduct, $selectedFire*/
    3170) {
      if ($baseMapStyle !== "") {
        let layers = map.getStyle().layers;
        let layerIds = layers.map((l) => l.id);
        map.setStyle("mapbox://styles/servirmekong/" + $baseMapStyle);
        setTimeout(
          () => {
            if (layerIds.includes("wms-layer")) {
              addTileMap($selectedPollutant, $selectedProduct);
            }
            if (layerIds.includes("fire-wms-layer")) {
              addFireTileMap($selectedFire);
            }
          },
          50
        );
      }
    }
    if ($$self.$$.dirty[0] & /*map, $ShowFire*/
    514) {
      if (map && $ShowFire == false && map.getLayer("fire-wms-layer")) {
        clearLayer(map, "fire-wms-layer");
        clearSource(map, "fire-wms-source");
      }
    }
    if ($$self.$$.dirty[0] & /*map, $ShowFire, $selectedFire*/
    1538) {
      if (map && $ShowFire == true && !map.getLayer("fire-wms-layer")) {
        addFireTileMap($selectedFire);
      }
    }
    if ($$self.$$.dirty[0] & /*$selectedFire, currentFire, map, $ShowFire*/
    1554) {
      if ($selectedFire !== currentFire && map && $ShowFire == true) {
        addFireTileMap($selectedFire);
      }
    }
    if ($$self.$$.dirty[0] & /*map, $ShowFire*/
    514) {
      if (map && $ShowFire == true && map.getLayer("fire-wms-layer")) {
        map.setPaintProperty("fire-wms-layer", "raster-opacity", 0.9);
      }
    }
    if ($$self.$$.dirty[0] & /*map, $ShowStation*/
    258) {
      if (map && $ShowStation == false) {
        clearLayer(map, "station-point");
        clearLayer(map, "marker-text");
        clearSource(map, "station-data");
      }
    }
    if ($$self.$$.dirty[0] & /*map, $ShowPollutant*/
    130) {
      if (map && $ShowPollutant == false) {
        map.setPaintProperty("wms-layer", "raster-opacity", 0);
      }
    }
    if ($$self.$$.dirty[0] & /*map, $ShowPollutant, $selectedPollutant, $selectedProduct*/
    226) {
      if (map && $ShowPollutant == true && map.getLayer("wms-layer")) {
        console.log("ShowPollutant ture", $selectedPollutant, $selectedProduct);
        map.setPaintProperty("wms-layer", "raster-opacity", 0.7);
      }
    }
  };
  return [
    mapContainer,
    map,
    Draw,
    getMap,
    currentFire,
    $selectedProduct,
    $selectedPollutant,
    $ShowPollutant,
    $ShowStation,
    $ShowFire,
    $selectedFire,
    $baseMapStyle,
    $intializationDate,
    $selectedProductLayer,
    $forecastedTime,
    $forecastedDate,
    div1_binding
  ];
}
class MapBox extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, { map: 1, Draw: 2, getMap: 3 }, null, [-1, -1]);
  }
  get getMap() {
    return this.$$.ctx[3];
  }
}
function create_fragment$a(ctx) {
  let div10;
  let div9;
  let div1;
  let div0;
  let p0;
  let t0;
  let t1;
  let p1;
  let t2;
  let t3;
  let t4;
  let div3;
  let div2;
  let dateinput;
  let updating_value;
  let t5;
  let div5;
  let div4;
  let rangeslider;
  let updating_pipstep;
  let updating_values;
  let t6;
  let div8;
  let textContent = `<div class=""><div id="timeslider-btn" class="flex"></div></div>`;
  let current;
  function dateinput_value_binding(value) {
    ctx[7](value);
  }
  let dateinput_props = {
    dynamicPositioning: "true",
    closeOnSelection: true,
    format: "yyyy-MM-dd",
    placeholder: ""
  };
  if (
    /*picker_date*/
    ctx[0] !== void 0
  ) {
    dateinput_props.value = /*picker_date*/
    ctx[0];
  }
  dateinput = new DateInput({ props: dateinput_props });
  binding_callbacks.push(() => bind(dateinput, "value", dateinput_value_binding));
  function rangeslider_pipstep_binding(value) {
    ctx[9](value);
  }
  function rangeslider_values_binding(value) {
    ctx[10](value);
  }
  let rangeslider_props = {
    id: "time-range",
    formatter: (
      /*func*/
      ctx[8]
    ),
    max: (
      /*timeListSlider*/
      ctx[5].length - 1
    ),
    range: "min",
    suffix: "h",
    pushy: true,
    pips: true,
    all: "label",
    float: true
  };
  if (
    /*pipstep*/
    ctx[2] !== void 0
  ) {
    rangeslider_props.pipstep = /*pipstep*/
    ctx[2];
  }
  if (
    /*values*/
    ctx[1] !== void 0
  ) {
    rangeslider_props.values = /*values*/
    ctx[1];
  }
  rangeslider = new RangeSlider({ props: rangeslider_props });
  binding_callbacks.push(() => bind(rangeslider, "pipstep", rangeslider_pipstep_binding));
  binding_callbacks.push(() => bind(rangeslider, "values", rangeslider_values_binding));
  rangeslider.$on(
    "change",
    /*change_handler*/
    ctx[11]
  );
  return {
    c() {
      div10 = element("div");
      div9 = element("div");
      div1 = element("div");
      div0 = element("div");
      p0 = element("p");
      t0 = text(
        /*$selectedDate_str*/
        ctx[4]
      );
      t1 = space();
      p1 = element("p");
      t2 = text(
        /*$selectedTime_str*/
        ctx[3]
      );
      t3 = text(":00:00");
      t4 = space();
      div3 = element("div");
      div2 = element("div");
      create_component(dateinput.$$.fragment);
      t5 = space();
      div5 = element("div");
      div4 = element("div");
      create_component(rangeslider.$$.fragment);
      t6 = space();
      div8 = element("div");
      div8.innerHTML = textContent;
      this.h();
    },
    l(nodes) {
      div10 = claim_element(nodes, "DIV", { class: true });
      var div10_nodes = children(div10);
      div9 = claim_element(div10_nodes, "DIV", { id: true, class: true });
      var div9_nodes = children(div9);
      div1 = claim_element(div9_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      p0 = claim_element(div0_nodes, "P", { class: true });
      var p0_nodes = children(p0);
      t0 = claim_text(
        p0_nodes,
        /*$selectedDate_str*/
        ctx[4]
      );
      p0_nodes.forEach(detach);
      t1 = claim_space(div0_nodes);
      p1 = claim_element(div0_nodes, "P", { class: true });
      var p1_nodes = children(p1);
      t2 = claim_text(
        p1_nodes,
        /*$selectedTime_str*/
        ctx[3]
      );
      t3 = claim_text(p1_nodes, ":00:00");
      p1_nodes.forEach(detach);
      div0_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      t4 = claim_space(div9_nodes);
      div3 = claim_element(div9_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      claim_component(dateinput.$$.fragment, div2_nodes);
      div2_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      t5 = claim_space(div9_nodes);
      div5 = claim_element(div9_nodes, "DIV", { class: true, style: true });
      var div5_nodes = children(div5);
      div4 = claim_element(div5_nodes, "DIV", { class: true, style: true });
      var div4_nodes = children(div4);
      claim_component(rangeslider.$$.fragment, div4_nodes);
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      t6 = claim_space(div9_nodes);
      div8 = claim_element(div9_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div8) !== "svelte-3gz9hj")
        div8.innerHTML = textContent;
      div9_nodes.forEach(detach);
      div10_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(p0, "class", "font-bold text-purple-900 mb-0");
      attr(p1, "class", "mb-0");
      attr(div0, "class", "text-center");
      attr(div1, "class", "flex p-2 border-end border-start svelte-qkqnwo");
      attr(div2, "class", "");
      attr(div3, "class", "flex p-2 border-end svelte-qkqnwo");
      attr(div4, "class", "p-2");
      set_style(div4, "width", "-webkit-fill-available");
      attr(div5, "class", "basis-1/2");
      set_style(div5, "width", "-webkit-fill-available");
      attr(div8, "class", "flex p-2 border-end border-start svelte-qkqnwo");
      attr(div9, "id", "timeslider");
      attr(div9, "class", "flex justify-center items-center svelte-qkqnwo");
      attr(div10, "class", "timeslider-class svelte-qkqnwo");
    },
    m(target, anchor) {
      insert_hydration(target, div10, anchor);
      append_hydration(div10, div9);
      append_hydration(div9, div1);
      append_hydration(div1, div0);
      append_hydration(div0, p0);
      append_hydration(p0, t0);
      append_hydration(div0, t1);
      append_hydration(div0, p1);
      append_hydration(p1, t2);
      append_hydration(p1, t3);
      append_hydration(div9, t4);
      append_hydration(div9, div3);
      append_hydration(div3, div2);
      mount_component(dateinput, div2, null);
      append_hydration(div9, t5);
      append_hydration(div9, div5);
      append_hydration(div5, div4);
      mount_component(rangeslider, div4, null);
      append_hydration(div9, t6);
      append_hydration(div9, div8);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & /*$selectedDate_str*/
      16)
        set_data(
          t0,
          /*$selectedDate_str*/
          ctx2[4]
        );
      if (!current || dirty & /*$selectedTime_str*/
      8)
        set_data(
          t2,
          /*$selectedTime_str*/
          ctx2[3]
        );
      const dateinput_changes = {};
      if (!updating_value && dirty & /*picker_date*/
      1) {
        updating_value = true;
        dateinput_changes.value = /*picker_date*/
        ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      dateinput.$set(dateinput_changes);
      const rangeslider_changes = {};
      if (!updating_pipstep && dirty & /*pipstep*/
      4) {
        updating_pipstep = true;
        rangeslider_changes.pipstep = /*pipstep*/
        ctx2[2];
        add_flush_callback(() => updating_pipstep = false);
      }
      if (!updating_values && dirty & /*values*/
      2) {
        updating_values = true;
        rangeslider_changes.values = /*values*/
        ctx2[1];
        add_flush_callback(() => updating_values = false);
      }
      rangeslider.$set(rangeslider_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(dateinput.$$.fragment, local);
      transition_in(rangeslider.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(dateinput.$$.fragment, local);
      transition_out(rangeslider.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div10);
      }
      destroy_component(dateinput);
      destroy_component(rangeslider);
    }
  };
}
function DatetoStringFormat(d) {
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  let year = d.getFullYear();
  if (month.length < 2)
    month = "0" + month;
  if (day.length < 2)
    day = "0" + day;
  return [year, month, day].join("-");
}
function instance$a($$self, $$props, $$invalidate) {
  let $selectedTime_str;
  let $selectedDate_str;
  component_subscribe($$self, selectedTime_str, ($$value) => $$invalidate(3, $selectedTime_str = $$value));
  component_subscribe($$self, selectedDate_str, ($$value) => $$invalidate(4, $selectedDate_str = $$value));
  let date = /* @__PURE__ */ new Date();
  let picker_date = /* @__PURE__ */ new Date();
  let values = [10];
  let pipstep = 1;
  let hourOptions = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let nowDateString = DatetoStringFormat(/* @__PURE__ */ new Date());
  function timesList(start, end, minutes_step) {
    let dateStart = moment(`2017-08-30T${start}:00`);
    let dateEnd = moment(`2017-08-30T${end}:00`).subtract(minutes_step, "hours");
    let times = [];
    times.push(dateStart.format("HH"));
    hourOptions.push(dateStart.format("H"));
    while (times[times.length - 1] < dateEnd.format("HH")) {
      times.push(dateStart.add(minutes_step, "hours").format("HH"));
      hourOptions.push(dateStart.format("H"));
    }
    return times;
  }
  let timeListSlider = timesList("01:00", "24:00", 3);
  pipstep = 1;
  async function getInitDate(forecastTime, nowDateString2) {
    let dataUrl = "/api/mapclient/";
    let params = {
      action: "get-latest-date",
      dataset: "geos"
    };
    await axios.get(dataUrl, {
      params,
      headers: {
        Authorization: `admin.KRg06uWinwXAL5SRRCBSmH2HON4tZKdpCItHpbZh7HghJFFH6mIizlNM01`
      }
    }).then((result) => {
      let initDate = result.data.slice(0, 4) + "-" + result.data.substr(4, 2) + "-" + result.data.substr(6, 2);
      intializationDate.set(initDate);
      forecastedTime.set(forecastTime);
      forecastedDate.set(nowDateString2);
    }).catch((error) => {
      console.error(error);
      throw error;
    });
  }
  function setforecastedTime(event) {
    forecastedTime.set(timeListSlider[event.detail.value]);
    set_store_value(selectedTime_str, $selectedTime_str = timeListSlider[event.detail.value], $selectedTime_str);
  }
  onMount(async () => {
    let now_hour = date.getHours();
    let closestHourOption = hourOptions.reduce(function(prev, curr) {
      return Math.abs(curr - now_hour) < Math.abs(prev - now_hour) ? curr : prev;
    });
    let TimeIndexOption = hourOptions.findIndex((x) => x === closestHourOption);
    $$invalidate(1, values = [TimeIndexOption]);
    set_store_value(selectedTime_str, $selectedTime_str = timeListSlider[TimeIndexOption], $selectedTime_str);
    getInitDate(timeListSlider[TimeIndexOption], nowDateString);
  });
  function dateinput_value_binding(value) {
    picker_date = value;
    $$invalidate(0, picker_date);
  }
  const func = (v) => timeListSlider[v];
  function rangeslider_pipstep_binding(value) {
    pipstep = value;
    $$invalidate(2, pipstep);
  }
  function rangeslider_values_binding(value) {
    values = value;
    $$invalidate(1, values);
  }
  const change_handler = (e) => setforecastedTime(e);
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*picker_date*/
    1) {
      if (picker_date) {
        let picker_year = picker_date.getFullYear();
        let picker_month = picker_date.getMonth();
        let picker_getdate = picker_date.getDate();
        let picker_day = picker_date.getDay();
        set_store_value(selectedDate_str, $selectedDate_str = days[picker_day] + " " + months[picker_month] + " " + picker_getdate + " " + picker_year, $selectedDate_str);
        forecastedDate.set(DatetoStringFormat(picker_date));
      }
    }
  };
  return [
    picker_date,
    values,
    pipstep,
    $selectedTime_str,
    $selectedDate_str,
    timeListSlider,
    setforecastedTime,
    dateinput_value_binding,
    func,
    rangeslider_pipstep_binding,
    rangeslider_values_binding,
    change_handler
  ];
}
class TimeSlider extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {});
  }
}
const get_header_slot_changes = (dirty) => ({});
const get_header_slot_context = (ctx) => ({});
function create_fragment$9(ctx) {
  let dialog_1;
  let div;
  let button;
  let textContent = "x";
  let t1;
  let t2;
  let t3;
  let br;
  let current;
  let mounted;
  let dispose;
  const header_slot_template = (
    /*#slots*/
    ctx[3].header
  );
  const header_slot = create_slot(
    header_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    get_header_slot_context
  );
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      dialog_1 = element("dialog");
      div = element("div");
      button = element("button");
      button.textContent = textContent;
      t1 = space();
      if (header_slot)
        header_slot.c();
      t2 = space();
      if (default_slot)
        default_slot.c();
      t3 = space();
      br = element("br");
      this.h();
    },
    l(nodes) {
      dialog_1 = claim_element(nodes, "DIALOG", { class: true });
      var dialog_1_nodes = children(dialog_1);
      div = claim_element(dialog_1_nodes, "DIV", { class: true });
      var div_nodes = children(div);
      button = claim_element(div_nodes, "BUTTON", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(button) !== "svelte-vbf0fn")
        button.textContent = textContent;
      t1 = claim_space(div_nodes);
      if (header_slot)
        header_slot.l(div_nodes);
      t2 = claim_space(div_nodes);
      if (default_slot)
        default_slot.l(div_nodes);
      t3 = claim_space(div_nodes);
      br = claim_element(div_nodes, "BR", {});
      div_nodes.forEach(detach);
      dialog_1_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(button, "class", "modal-close-button svelte-1ao7csy");
      attr(div, "class", "svelte-1ao7csy");
      attr(dialog_1, "class", "svelte-1ao7csy");
    },
    m(target, anchor) {
      insert_hydration(target, dialog_1, anchor);
      append_hydration(dialog_1, div);
      append_hydration(div, button);
      append_hydration(div, t1);
      if (header_slot) {
        header_slot.m(div, null);
      }
      append_hydration(div, t2);
      if (default_slot) {
        default_slot.m(div, null);
      }
      append_hydration(div, t3);
      append_hydration(div, br);
      ctx[6](dialog_1);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button,
            "click",
            /*click_handler_1*/
            ctx[5]
          ),
          listen(div, "click", stop_propagation(
            /*click_handler*/
            ctx[4]
          )),
          listen(
            dialog_1,
            "close",
            /*close_handler*/
            ctx[7]
          ),
          listen(dialog_1, "click", self(
            /*click_handler_2*/
            ctx[8]
          ))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (header_slot) {
        if (header_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            header_slot,
            header_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              header_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              get_header_slot_changes
            ),
            get_header_slot_context
          );
        }
      }
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(header_slot, local);
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(header_slot, local);
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(dialog_1);
      }
      if (header_slot)
        header_slot.d(detaching);
      if (default_slot)
        default_slot.d(detaching);
      ctx[6](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { showModal } = $$props;
  let dialog;
  onDestroy(() => console.log("modal was destroyed!"));
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  const click_handler_1 = () => dialog.close();
  function dialog_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      dialog = $$value;
      $$invalidate(1, dialog);
    });
  }
  const close_handler = () => $$invalidate(0, showModal = false);
  const click_handler_2 = () => dialog.close();
  $$self.$$set = ($$props2) => {
    if ("showModal" in $$props2)
      $$invalidate(0, showModal = $$props2.showModal);
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*dialog, showModal*/
    3) {
      if (dialog && showModal)
        dialog.showModal();
    }
  };
  return [
    showModal,
    dialog,
    $$scope,
    slots,
    click_handler,
    click_handler_1,
    dialog_1_binding,
    close_handler,
    click_handler_2
  ];
}
class Modal extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, { showModal: 0 });
  }
}
function create_fragment$8(ctx) {
  let div5;
  let div0;
  let textContent = `<a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-1.svg" alt=""/></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Air</span> Quality</p></a>`;
  let t3;
  let div1;
  let textContent_1 = `<a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-2.svg" alt=""/></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Ground</span> Station</p></a>`;
  let t7;
  let div2;
  let textContent_2 = `<a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-3.svg" alt=""/></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Fire</span> Product</p></a>`;
  let t11;
  let div3;
  let textContent_3 = `<a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-4.svg" alt=""/></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Statistics</span> Report</p></a>`;
  let t15;
  let div4;
  let textContent_4 = `<a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-5.svg" alt=""/></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Base</span> Map</p></a>`;
  let mounted;
  let dispose;
  return {
    c() {
      div5 = element("div");
      div0 = element("div");
      div0.innerHTML = textContent;
      t3 = space();
      div1 = element("div");
      div1.innerHTML = textContent_1;
      t7 = space();
      div2 = element("div");
      div2.innerHTML = textContent_2;
      t11 = space();
      div3 = element("div");
      div3.innerHTML = textContent_3;
      t15 = space();
      div4 = element("div");
      div4.innerHTML = textContent_4;
      this.h();
    },
    l(nodes) {
      div5 = claim_element(nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      div0 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-1lqf13n")
        div0.innerHTML = textContent;
      t3 = claim_space(div5_nodes);
      div1 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div1) !== "svelte-j6j13u")
        div1.innerHTML = textContent_1;
      t7 = claim_space(div5_nodes);
      div2 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div2) !== "svelte-1ph61d1")
        div2.innerHTML = textContent_2;
      t11 = claim_space(div5_nodes);
      div3 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div3) !== "svelte-9oc9vu")
        div3.innerHTML = textContent_3;
      t15 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div4) !== "svelte-191qql3")
        div4.innerHTML = textContent_4;
      div5_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "air-quality");
      attr(div1, "class", "ground-station");
      attr(div2, "class", "fire-product");
      attr(div3, "class", "statistics-map");
      attr(div4, "class", "base-map");
      attr(div5, "class", "detail");
    },
    m(target, anchor) {
      insert_hydration(target, div5, anchor);
      append_hydration(div5, div0);
      append_hydration(div5, t3);
      append_hydration(div5, div1);
      append_hydration(div5, t7);
      append_hydration(div5, div2);
      append_hydration(div5, t11);
      append_hydration(div5, div3);
      append_hydration(div5, t15);
      append_hydration(div5, div4);
      if (!mounted) {
        dispose = [
          listen(
            div0,
            "click",
            /*showPollutantSelectPanel*/
            ctx[4]
          ),
          listen(
            div0,
            "keydown",
            /*showPollutantSelectPanel*/
            ctx[4]
          ),
          listen(
            div1,
            "click",
            /*click_handler*/
            ctx[5]
          ),
          listen(
            div1,
            "keydown",
            /*keydown_handler*/
            ctx[6]
          ),
          listen(
            div2,
            "click",
            /*click_handler_1*/
            ctx[7]
          ),
          listen(
            div2,
            "keydown",
            /*keydown_handler_1*/
            ctx[8]
          ),
          listen(
            div3,
            "click",
            /*click_handler_2*/
            ctx[9]
          ),
          listen(
            div3,
            "keydown",
            /*keydown_handler_2*/
            ctx[10]
          ),
          listen(
            div4,
            "click",
            /*showMapSettingPanel*/
            ctx[3]
          )
        ];
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div5);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let $ShowPollutantSelect;
  let $ShowMapSetting;
  let $ShowStation;
  let $ShowFire;
  let $hiddenDrawer;
  component_subscribe($$self, ShowPollutantSelect, ($$value) => $$invalidate(11, $ShowPollutantSelect = $$value));
  component_subscribe($$self, ShowMapSetting, ($$value) => $$invalidate(12, $ShowMapSetting = $$value));
  component_subscribe($$self, ShowStation, ($$value) => $$invalidate(0, $ShowStation = $$value));
  component_subscribe($$self, ShowFire, ($$value) => $$invalidate(1, $ShowFire = $$value));
  component_subscribe($$self, hiddenDrawer, ($$value) => $$invalidate(2, $hiddenDrawer = $$value));
  function showMapSettingPanel() {
    set_store_value(ShowMapSetting, $ShowMapSetting = !$ShowMapSetting, $ShowMapSetting);
    if ($ShowMapSetting) {
      setTimeout(
        () => {
          document.querySelectorAll("#mapsettingPanel").forEach((el) => el.style.display = "block");
        },
        5
      );
    }
  }
  function showPollutantSelectPanel() {
    set_store_value(ShowPollutantSelect, $ShowPollutantSelect = !$ShowPollutantSelect, $ShowPollutantSelect);
    if ($ShowPollutantSelect) {
      setTimeout(
        () => {
          document.querySelectorAll("#select_air_pollutant").forEach((el) => el.style.display = "block");
        },
        5
      );
    }
  }
  const click_handler = () => set_store_value(ShowStation, $ShowStation = !$ShowStation, $ShowStation);
  const keydown_handler = () => set_store_value(ShowStation, $ShowStation = !$ShowStation, $ShowStation);
  const click_handler_1 = () => set_store_value(ShowFire, $ShowFire = !$ShowFire, $ShowFire);
  const keydown_handler_1 = () => set_store_value(ShowFire, $ShowFire = !$ShowFire, $ShowFire);
  const click_handler_2 = () => set_store_value(hiddenDrawer, $hiddenDrawer = !$hiddenDrawer, $hiddenDrawer);
  const keydown_handler_2 = () => set_store_value(hiddenDrawer, $hiddenDrawer = !$hiddenDrawer, $hiddenDrawer);
  return [
    $ShowStation,
    $ShowFire,
    $hiddenDrawer,
    showMapSettingPanel,
    showPollutantSelectPanel,
    click_handler,
    keydown_handler,
    click_handler_1,
    keydown_handler_1,
    click_handler_2,
    keydown_handler_2
  ];
}
class LayerToggle extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {});
  }
}
function getLegend(colorPalettes, trickValues, valueRange, parentId) {
  let colorScale = linear().domain(trickValues).range(colorPalettes);
  let svgLegend = select(parentId).append("svg").attr("width", 270);
  let defs = svgLegend.append("defs");
  let linearGradient = defs.append("linearGradient").attr("id", "linear-gradient");
  linearGradient.attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
  linearGradient.selectAll("stop").data([
    { offset: "0%", color: colorPalettes[0] },
    { offset: "10%", color: colorPalettes[1] },
    { offset: "20%", color: colorPalettes[2] },
    { offset: "30%", color: colorPalettes[3] },
    { offset: "40%", color: colorPalettes[4] },
    { offset: "50%", color: colorPalettes[5] },
    { offset: "60%", color: colorPalettes[6] },
    { offset: "70%", color: colorPalettes[7] },
    { offset: "80%", color: colorPalettes[8] },
    { offset: "90%", color: colorPalettes[9] },
    { offset: "100%", color: colorPalettes[10] }
  ]).enter().append("stop").attr("offset", function(d) {
    return d.offset;
  }).attr("stop-color", function(d) {
    return d.color;
  });
  svgLegend.append("rect").attr("x", 10).attr("y", 10).attr("width", 250).attr("height", 10).style("fill", "url(#linear-gradient)");
  let xLeg = linear().domain(valueRange).range([10, 250]);
  let axisLeg = axisBottom(xLeg).tickValues(colorScale.domain());
  svgLegend.attr("class", "axis").append("g").attr("transform", "translate(0, 15)").call(axisLeg);
}
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[11] = list[i];
  return child_ctx;
}
function create_each_block$2(ctx) {
  let option_1;
  let t_value = (
    /*option*/
    ctx[11].name + ""
  );
  let t;
  let option_1_value_value;
  return {
    c() {
      option_1 = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option_1 = claim_element(nodes, "OPTION", {});
      var option_1_nodes = children(option_1);
      t = claim_text(option_1_nodes, t_value);
      option_1_nodes.forEach(detach);
      this.h();
    },
    h() {
      option_1.__value = option_1_value_value = /*option*/
      ctx[11].value;
      set_input_value(option_1, option_1.__value);
    },
    m(target, anchor) {
      insert_hydration(target, option_1, anchor);
      append_hydration(option_1, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*$selectOptions*/
      2 && t_value !== (t_value = /*option*/
      ctx2[11].name + ""))
        set_data(t, t_value);
      if (dirty & /*$selectOptions*/
      2 && option_1_value_value !== (option_1_value_value = /*option*/
      ctx2[11].value)) {
        option_1.__value = option_1_value_value;
        set_input_value(option_1, option_1.__value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(option_1);
      }
    }
  };
}
function create_fragment$7(ctx) {
  let div8;
  let div7;
  let div0;
  let textContent = `<p class="text blue-600 text-sm mb-0">Surface PM 2.5 (ugm-3)</p> <p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="/assets/img/icon/head-information.svg" alt=""/></p>`;
  let t2;
  let div6;
  let div2;
  let textContent_1 = `<div id="legend" class="map-legend"></div>`;
  let t3;
  let div5;
  let div3;
  let textContent_2 = `<p class="icon mb-0"><img class="d-block w-100" src="/assets/img/icon/icon-ugm-2.svg" alt=""/></p>`;
  let t4;
  let div4;
  let select2;
  let mounted;
  let dispose;
  let each_value = ensure_array_like(
    /*$selectOptions*/
    ctx[1]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }
  return {
    c() {
      div8 = element("div");
      div7 = element("div");
      div0 = element("div");
      div0.innerHTML = textContent;
      t2 = space();
      div6 = element("div");
      div2 = element("div");
      div2.innerHTML = textContent_1;
      t3 = space();
      div5 = element("div");
      div3 = element("div");
      div3.innerHTML = textContent_2;
      t4 = space();
      div4 = element("div");
      select2 = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div8 = claim_element(nodes, "DIV", { class: true });
      var div8_nodes = children(div8);
      div7 = claim_element(div8_nodes, "DIV", { class: true });
      var div7_nodes = children(div7);
      div0 = claim_element(div7_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-12x23ds")
        div0.innerHTML = textContent;
      t2 = claim_space(div7_nodes);
      div6 = claim_element(div7_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div2 = claim_element(div6_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div2) !== "svelte-a75pea")
        div2.innerHTML = textContent_1;
      t3 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      div3 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div3) !== "svelte-1al5iwn")
        div3.innerHTML = textContent_2;
      t4 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      select2 = claim_element(div4_nodes, "SELECT", { id: true, class: true });
      var select_nodes = children(select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(select_nodes);
      }
      select_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      div6_nodes.forEach(detach);
      div7_nodes.forEach(detach);
      div8_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100");
      attr(div2, "class", "box__color mb-05");
      attr(div3, "class", "col-2");
      attr(select2, "id", "select2_satellite");
      attr(select2, "class", "nice-select wide selectize");
      if (
        /*$selectedProduct*/
        ctx[0] === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[5].call(select2)
        ));
      attr(div4, "class", "col");
      attr(div5, "class", "row no-gutters align-items-center");
      attr(div6, "class", "box__description");
      attr(div7, "class", "info bg-white mb-2 p-15 rounded");
      attr(div8, "class", "item svelte-1lbf8na");
    },
    m(target, anchor) {
      insert_hydration(target, div8, anchor);
      append_hydration(div8, div7);
      append_hydration(div7, div0);
      append_hydration(div7, t2);
      append_hydration(div7, div6);
      append_hydration(div6, div2);
      append_hydration(div6, t3);
      append_hydration(div6, div5);
      append_hydration(div5, div3);
      append_hydration(div5, t4);
      append_hydration(div5, div4);
      append_hydration(div4, select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select2, null);
        }
      }
      select_option(
        select2,
        /*$selectedProduct*/
        ctx[0],
        true
      );
      if (!mounted) {
        dispose = listen(
          select2,
          "change",
          /*select_change_handler*/
          ctx[5]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*$selectOptions*/
      2) {
        each_value = ensure_array_like(
          /*$selectOptions*/
          ctx2[1]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select2, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*$selectedProduct, $selectOptions*/
      3) {
        select_option(
          select2,
          /*$selectedProduct*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div8);
      }
      destroy_each(each_blocks, detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let $selectedProduct;
  let $selectedPollutant;
  let $selectedProductLayer;
  let $ShowPollutant;
  let $selectOptions;
  component_subscribe($$self, selectedProduct, ($$value) => $$invalidate(0, $selectedProduct = $$value));
  component_subscribe($$self, selectedPollutant, ($$value) => $$invalidate(4, $selectedPollutant = $$value));
  component_subscribe($$self, selectedProductLayer, ($$value) => $$invalidate(6, $selectedProductLayer = $$value));
  component_subscribe($$self, ShowPollutant, ($$value) => $$invalidate(7, $ShowPollutant = $$value));
  component_subscribe($$self, selectOptions, ($$value) => $$invalidate(1, $selectOptions = $$value));
  selectedProduct.set("geos5");
  selectedPollutant.set("pm25");
  selectedProductLayer.set("BC_DNN_PM25");
  let { hiddenDrawer: hiddenDrawer2 = true } = $$props;
  set_store_value(ShowPollutant, $ShowPollutant = true, $ShowPollutant);
  let satellite_options = [];
  let listProductLayers = {
    "pm25": {
      "geos": "BC_MLPM25",
      "geos5": "BC_DNN_PM25"
    },
    "no2": { "gems": "ColumnAmountNO2Trop" }
  };
  onMount(() => {
    let colorPalettes = [
      "#FFFFFF",
      "#E0EFF4",
      "#84A8CB",
      "#7985BB",
      "#8B6EA4",
      "#B47C9E",
      "#EA9394",
      "#FCC495",
      "#F8D19C",
      "#FBEAC2",
      "#FDECC7"
    ];
    let trickValues = [0, 50, 100, 150, 200];
    let valueRange = [0, 200];
    getLegend(colorPalettes, trickValues, valueRange, "#legend");
  });
  function select_change_handler() {
    $selectedProduct = select_value(this);
    selectedProduct.set($selectedProduct);
  }
  $$self.$$set = ($$props2) => {
    if ("hiddenDrawer" in $$props2)
      $$invalidate(2, hiddenDrawer2 = $$props2.hiddenDrawer);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$selectedPollutant, satellite_options*/
    24) {
      if ($selectedPollutant === "no2") {
        $$invalidate(3, satellite_options = [
          { value: "gems", name: "GEMS" },
          { value: "sentinel5p", name: "Sentinel 5P" }
        ]);
        set_store_value(selectOptions, $selectOptions = satellite_options, $selectOptions);
        set_store_value(selectedProduct, $selectedProduct = "gems", $selectedProduct);
      }
    }
    if ($$self.$$.dirty & /*$selectedPollutant, satellite_options*/
    24) {
      if ($selectedPollutant === "pm25") {
        $$invalidate(3, satellite_options = [
          { value: "geos", name: "GEOS-ML 25x25km" },
          { value: "geos5", name: "GEOS-ML 5x5km" }
        ]);
        set_store_value(selectOptions, $selectOptions = satellite_options, $selectOptions);
        set_store_value(selectedProduct, $selectedProduct = "geos5", $selectedProduct);
      }
    }
    if ($$self.$$.dirty & /*$selectedPollutant, satellite_options*/
    24) {
      if ($selectedPollutant === "pm10") {
        $$invalidate(3, satellite_options = [{ value: "geos", name: "GEOS-ML 25x25km" }]);
        set_store_value(selectOptions, $selectOptions = satellite_options, $selectOptions);
        set_store_value(selectedProduct, $selectedProduct = "geos", $selectedProduct);
      }
    }
    if ($$self.$$.dirty & /*$selectedProduct, $selectedPollutant*/
    17) {
      if ($selectedProduct !== "") {
        set_store_value(selectedProductLayer, $selectedProductLayer = listProductLayers[$selectedPollutant][$selectedProduct], $selectedProductLayer);
      }
    }
  };
  return [
    $selectedProduct,
    $selectOptions,
    hiddenDrawer2,
    satellite_options,
    $selectedPollutant,
    select_change_handler
  ];
}
class AirPollutants extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, { hiddenDrawer: 2 });
  }
}
function create_fragment$6(ctx) {
  let div6;
  let div5;
  let div0;
  let textContent = `<p class="text blue-600 text-sm mb-0">Ground Stations</p> <p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="assets/img/icon/head-information.svg" alt=""/></p>`;
  let t2;
  let div4;
  let div3;
  let div1;
  let textContent_1 = `<p class="icon mb-0"><img class="d-block w-100" src="assets/img/icon/icon-ugm-3.svg" alt=""/></p>`;
  let t3;
  let div2;
  let select2;
  let option0;
  let textContent_2 = "Pollution Control Department";
  let option1;
  let textContent_3 = "Aeronet";
  let option2;
  let textContent_4 = "Embassy";
  let mounted;
  let dispose;
  return {
    c() {
      div6 = element("div");
      div5 = element("div");
      div0 = element("div");
      div0.innerHTML = textContent;
      t2 = space();
      div4 = element("div");
      div3 = element("div");
      div1 = element("div");
      div1.innerHTML = textContent_1;
      t3 = space();
      div2 = element("div");
      select2 = element("select");
      option0 = element("option");
      option0.textContent = textContent_2;
      option1 = element("option");
      option1.textContent = textContent_3;
      option2 = element("option");
      option2.textContent = textContent_4;
      this.h();
    },
    l(nodes) {
      div6 = claim_element(nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div5 = claim_element(div6_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      div0 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-17pg3bs")
        div0.innerHTML = textContent;
      t2 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div1 = claim_element(div3_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div1) !== "svelte-glq2g4")
        div1.innerHTML = textContent_1;
      t3 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      select2 = claim_element(div2_nodes, "SELECT", { id: true, class: true });
      var select_nodes = children(select2);
      option0 = claim_element(select_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option0) !== "svelte-19fdb44")
        option0.textContent = textContent_2;
      option1 = claim_element(select_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option1) !== "svelte-usgr3e")
        option1.textContent = textContent_3;
      option2 = claim_element(select_nodes, "OPTION", { ["data-svelte-h"]: true });
      if (get_svelte_dataset(option2) !== "svelte-tzjcwq")
        option2.textContent = textContent_4;
      select_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      div6_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100");
      attr(div1, "class", "col-2");
      option0.__value = "pcd";
      set_input_value(option0, option0.__value);
      option1.__value = "aeronet";
      set_input_value(option1, option1.__value);
      option2.__value = "embassy";
      set_input_value(option2, option2.__value);
      attr(select2, "id", "select2-station");
      attr(select2, "class", "nice-select wide selectize");
      if (
        /*$selectedStation*/
        ctx[0] === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[1].call(select2)
        ));
      attr(div2, "class", "col");
      attr(div3, "class", "row no-gutters align-items-center");
      attr(div4, "class", "box__description");
      attr(div5, "class", "info bg-white mb-2 p-15 rounded");
      attr(div6, "class", "item");
    },
    m(target, anchor) {
      insert_hydration(target, div6, anchor);
      append_hydration(div6, div5);
      append_hydration(div5, div0);
      append_hydration(div5, t2);
      append_hydration(div5, div4);
      append_hydration(div4, div3);
      append_hydration(div3, div1);
      append_hydration(div3, t3);
      append_hydration(div3, div2);
      append_hydration(div2, select2);
      append_hydration(select2, option0);
      append_hydration(select2, option1);
      append_hydration(select2, option2);
      select_option(
        select2,
        /*$selectedStation*/
        ctx[0],
        true
      );
      if (!mounted) {
        dispose = listen(
          select2,
          "change",
          /*select_change_handler*/
          ctx[1]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*$selectedStation*/
      1) {
        select_option(
          select2,
          /*$selectedStation*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div6);
      }
      mounted = false;
      dispose();
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let $pcdshow;
  let $selectedStation;
  let $ShowStation;
  component_subscribe($$self, pcdshow, ($$value) => $$invalidate(2, $pcdshow = $$value));
  component_subscribe($$self, selectedStation, ($$value) => $$invalidate(0, $selectedStation = $$value));
  component_subscribe($$self, ShowStation, ($$value) => $$invalidate(3, $ShowStation = $$value));
  set_store_value(selectedStation, $selectedStation = "pcd", $selectedStation);
  set_store_value(ShowStation, $ShowStation = true, $ShowStation);
  setTimeout(
    () => {
      NiceSelect.bind(document.querySelector("#select2-station"));
    },
    100
  );
  function select_change_handler() {
    $selectedStation = select_value(this);
    selectedStation.set($selectedStation);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$selectedStation*/
    1) {
      if ($selectedStation === "pcd") {
        set_store_value(pcdshow, $pcdshow = true, $pcdshow);
      }
    }
  };
  return [$selectedStation, select_change_handler];
}
class StationsLayerControl extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {});
  }
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[3] = list[i];
  return child_ctx;
}
function create_each_block$1(ctx) {
  let option_1;
  let t_value = (
    /*option*/
    ctx[3].name + ""
  );
  let t;
  return {
    c() {
      option_1 = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option_1 = claim_element(nodes, "OPTION", {});
      var option_1_nodes = children(option_1);
      t = claim_text(option_1_nodes, t_value);
      option_1_nodes.forEach(detach);
      this.h();
    },
    h() {
      option_1.__value = /*option*/
      ctx[3].value;
      set_input_value(option_1, option_1.__value);
    },
    m(target, anchor) {
      insert_hydration(target, option_1, anchor);
      append_hydration(option_1, t);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(option_1);
      }
    }
  };
}
function create_fragment$5(ctx) {
  let div6;
  let div5;
  let div0;
  let textContent = `<p class="text blue-600 text-sm mb-0">Fire Product</p> <p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="assets/img/icon/head-information.svg" alt=""/></p>`;
  let t2;
  let div4;
  let div3;
  let div1;
  let textContent_1 = `<p class="icon mb-0"><img class="d-block w-100" src="assets/img/icon/icon-ugm-1.svg" alt=""/></p>`;
  let t3;
  let div2;
  let select2;
  let mounted;
  let dispose;
  let each_value = ensure_array_like(
    /*fire_options*/
    ctx[1]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  return {
    c() {
      div6 = element("div");
      div5 = element("div");
      div0 = element("div");
      div0.innerHTML = textContent;
      t2 = space();
      div4 = element("div");
      div3 = element("div");
      div1 = element("div");
      div1.innerHTML = textContent_1;
      t3 = space();
      div2 = element("div");
      select2 = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div6 = claim_element(nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div5 = claim_element(div6_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      div0 = claim_element(div5_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-zptitx")
        div0.innerHTML = textContent;
      t2 = claim_space(div5_nodes);
      div4 = claim_element(div5_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      div3 = claim_element(div4_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div1 = claim_element(div3_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div1) !== "svelte-1lzl765")
        div1.innerHTML = textContent_1;
      t3 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", { class: true });
      var div2_nodes = children(div2);
      select2 = claim_element(div2_nodes, "SELECT", { id: true, class: true });
      var select_nodes = children(select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(select_nodes);
      }
      select_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      div3_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      div5_nodes.forEach(detach);
      div6_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100");
      attr(div1, "class", "col-2");
      attr(select2, "id", "select2-fire");
      attr(select2, "class", "nice-select wide selectize");
      if (
        /*$selectedFire*/
        ctx[0] === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[2].call(select2)
        ));
      attr(div2, "class", "col");
      attr(div3, "class", "row no-gutters align-items-center");
      attr(div4, "class", "box__description");
      attr(div5, "class", "info bg-white mb-2 p-15 rounded");
      attr(div6, "class", "item");
    },
    m(target, anchor) {
      insert_hydration(target, div6, anchor);
      append_hydration(div6, div5);
      append_hydration(div5, div0);
      append_hydration(div5, t2);
      append_hydration(div5, div4);
      append_hydration(div4, div3);
      append_hydration(div3, div1);
      append_hydration(div3, t3);
      append_hydration(div3, div2);
      append_hydration(div2, select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select2, null);
        }
      }
      select_option(
        select2,
        /*$selectedFire*/
        ctx[0],
        true
      );
      if (!mounted) {
        dispose = listen(
          select2,
          "change",
          /*select_change_handler*/
          ctx[2]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*fire_options*/
      2) {
        each_value = ensure_array_like(
          /*fire_options*/
          ctx2[1]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select2, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*$selectedFire, fire_options*/
      3) {
        select_option(
          select2,
          /*$selectedFire*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div6);
      }
      destroy_each(each_blocks, detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let $selectedFire;
  component_subscribe($$self, selectedFire, ($$value) => $$invalidate(0, $selectedFire = $$value));
  let fire_options = [
    {
      value: "vfei",
      name: "VIIRS-based Fire Emission Inventory (VFEI)"
    },
    {
      value: "fires_viirs_24",
      name: "VIIRS active fire last 24 hours"
    },
    {
      value: "fires_viirs_48",
      name: "VIIRS active fire last 48 hours"
    },
    {
      value: "fires_viirs_time",
      name: "VIIRS active fire for a single day"
    }
  ];
  setTimeout(
    () => {
      NiceSelect.bind(document.querySelector("#select2-fire"));
    },
    100
  );
  function select_change_handler() {
    $selectedFire = select_value(this);
    selectedFire.set($selectedFire);
    $$invalidate(1, fire_options);
  }
  return [$selectedFire, fire_options, select_change_handler];
}
class FireLayerControl extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {});
  }
}
function create_fragment$4(ctx) {
  let div16;
  let a0;
  let textContent = `<img class="d-block" src="assets/img/icon/close.svg" alt=""/>`;
  let t0;
  let div0;
  let textContent_1 = `<p class="icon me-15 mb-0"><img style="height: 25px;" src="assets/img/icon/base-map.svg" alt=""/></p> <p class="text blue-600 text-2lg font-bold mb-0">Base Map</p>`;
  let t3;
  let div15;
  let div14;
  let div13;
  let a1;
  let div3;
  let div1;
  let p2;
  let img2;
  let img2_src_value;
  let t4;
  let div2;
  let textContent_2 = `<p class="text-sm mb-0">Light</p> <p class="text-xs">Displays a map in light theme</p>`;
  let t8;
  let a2;
  let div6;
  let div4;
  let p5;
  let img3;
  let img3_src_value;
  let t9;
  let div5;
  let textContent_3 = `<p class="text-sm mb-0">Dark</p> <p class="text-xs">Displays a map in dark theme</p>`;
  let t13;
  let a3;
  let div9;
  let div7;
  let p8;
  let img4;
  let img4_src_value;
  let t14;
  let div8;
  let textContent_4 = `<p class="text-sm mb-0">Classic</p> <p class="text-xs">Displays the default road map view</p>`;
  let t18;
  let a4;
  let div12;
  let div10;
  let p11;
  let img5;
  let img5_src_value;
  let t19;
  let div11;
  let textContent_5 = `<p class="text-sm mb-0">Wind</p> <p class="text-xs">wind forecast data (6 hourly from NOAA)</p>`;
  let mounted;
  let dispose;
  return {
    c() {
      div16 = element("div");
      a0 = element("a");
      a0.innerHTML = textContent;
      t0 = space();
      div0 = element("div");
      div0.innerHTML = textContent_1;
      t3 = space();
      div15 = element("div");
      div14 = element("div");
      div13 = element("div");
      a1 = element("a");
      div3 = element("div");
      div1 = element("div");
      p2 = element("p");
      img2 = element("img");
      t4 = space();
      div2 = element("div");
      div2.innerHTML = textContent_2;
      t8 = space();
      a2 = element("a");
      div6 = element("div");
      div4 = element("div");
      p5 = element("p");
      img3 = element("img");
      t9 = space();
      div5 = element("div");
      div5.innerHTML = textContent_3;
      t13 = space();
      a3 = element("a");
      div9 = element("div");
      div7 = element("div");
      p8 = element("p");
      img4 = element("img");
      t14 = space();
      div8 = element("div");
      div8.innerHTML = textContent_4;
      t18 = space();
      a4 = element("a");
      div12 = element("div");
      div10 = element("div");
      p11 = element("p");
      img5 = element("img");
      t19 = space();
      div11 = element("div");
      div11.innerHTML = textContent_5;
      this.h();
    },
    l(nodes) {
      div16 = claim_element(nodes, "DIV", { id: true, class: true });
      var div16_nodes = children(div16);
      a0 = claim_element(div16_nodes, "A", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(a0) !== "svelte-1fsuvn8")
        a0.innerHTML = textContent;
      t0 = claim_space(div16_nodes);
      div0 = claim_element(div16_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-m2t4hp")
        div0.innerHTML = textContent_1;
      t3 = claim_space(div16_nodes);
      div15 = claim_element(div16_nodes, "DIV", { class: true });
      var div15_nodes = children(div15);
      div14 = claim_element(div15_nodes, "DIV", { class: true });
      var div14_nodes = children(div14);
      div13 = claim_element(div14_nodes, "DIV", { class: true });
      var div13_nodes = children(div13);
      a1 = claim_element(div13_nodes, "A", { class: true });
      var a1_nodes = children(a1);
      div3 = claim_element(a1_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      div1 = claim_element(div3_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      p2 = claim_element(div1_nodes, "P", { class: true });
      var p2_nodes = children(p2);
      img2 = claim_element(p2_nodes, "IMG", { class: true, src: true, alt: true });
      p2_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      t4 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div2) !== "svelte-th25ga")
        div2.innerHTML = textContent_2;
      div3_nodes.forEach(detach);
      a1_nodes.forEach(detach);
      t8 = claim_space(div13_nodes);
      a2 = claim_element(div13_nodes, "A", { class: true });
      var a2_nodes = children(a2);
      div6 = claim_element(a2_nodes, "DIV", { class: true });
      var div6_nodes = children(div6);
      div4 = claim_element(div6_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      p5 = claim_element(div4_nodes, "P", { class: true });
      var p5_nodes = children(p5);
      img3 = claim_element(p5_nodes, "IMG", { class: true, src: true, alt: true });
      p5_nodes.forEach(detach);
      div4_nodes.forEach(detach);
      t9 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div5) !== "svelte-174u9f6")
        div5.innerHTML = textContent_3;
      div6_nodes.forEach(detach);
      a2_nodes.forEach(detach);
      t13 = claim_space(div13_nodes);
      a3 = claim_element(div13_nodes, "A", { class: true });
      var a3_nodes = children(a3);
      div9 = claim_element(a3_nodes, "DIV", { class: true });
      var div9_nodes = children(div9);
      div7 = claim_element(div9_nodes, "DIV", { class: true });
      var div7_nodes = children(div7);
      p8 = claim_element(div7_nodes, "P", { class: true });
      var p8_nodes = children(p8);
      img4 = claim_element(p8_nodes, "IMG", { class: true, src: true, alt: true });
      p8_nodes.forEach(detach);
      div7_nodes.forEach(detach);
      t14 = claim_space(div9_nodes);
      div8 = claim_element(div9_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div8) !== "svelte-11gc5uy")
        div8.innerHTML = textContent_4;
      div9_nodes.forEach(detach);
      a3_nodes.forEach(detach);
      t18 = claim_space(div13_nodes);
      a4 = claim_element(div13_nodes, "A", { class: true });
      var a4_nodes = children(a4);
      div12 = claim_element(a4_nodes, "DIV", { class: true });
      var div12_nodes = children(div12);
      div10 = claim_element(div12_nodes, "DIV", { class: true });
      var div10_nodes = children(div10);
      p11 = claim_element(div10_nodes, "P", { class: true });
      var p11_nodes = children(p11);
      img5 = claim_element(p11_nodes, "IMG", { class: true, src: true, alt: true });
      p11_nodes.forEach(detach);
      div10_nodes.forEach(detach);
      t19 = claim_space(div12_nodes);
      div11 = claim_element(div12_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div11) !== "svelte-e8401g")
        div11.innerHTML = textContent_5;
      div12_nodes.forEach(detach);
      a4_nodes.forEach(detach);
      div13_nodes.forEach(detach);
      div14_nodes.forEach(detach);
      div15_nodes.forEach(detach);
      div16_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a0, "class", "btn-close border-0 d-flex align-items-center justify-content-center");
      attr(div0, "class", "head border-bottom border-green d-flex align-items-center mb-1 pb-1 w-100");
      attr(img2, "class", "d-block w-100");
      if (!src_url_equal(img2.src, img2_src_value = LightBasemapImg))
        attr(img2, "src", img2_src_value);
      attr(img2, "alt", "");
      attr(p2, "class", "pic mb-0 me-1");
      attr(div1, "class", "col-auto");
      attr(div2, "class", "col");
      attr(div3, "class", "row no-gutters align-items-center");
      attr(a1, "class", "d-block item mb-1 p-1");
      attr(img3, "class", "d-block w-100");
      if (!src_url_equal(img3.src, img3_src_value = DarkBasemapImg))
        attr(img3, "src", img3_src_value);
      attr(img3, "alt", "");
      attr(p5, "class", "pic mb-0 me-1");
      attr(div4, "class", "col-auto");
      attr(div5, "class", "col");
      attr(div6, "class", "row no-gutters align-items-center");
      attr(a2, "class", "d-block item mb-1 p-1");
      attr(img4, "class", "d-block w-100");
      if (!src_url_equal(img4.src, img4_src_value = ClassicBasemapImg))
        attr(img4, "src", img4_src_value);
      attr(img4, "alt", "");
      attr(p8, "class", "pic mb-0 me-1");
      attr(div7, "class", "col-auto");
      attr(div8, "class", "col");
      attr(div9, "class", "row no-gutters align-items-center");
      attr(a3, "class", "d-block item mb-1 p-1");
      attr(img5, "class", "d-block w-100");
      if (!src_url_equal(img5.src, img5_src_value = WindBasemapImg))
        attr(img5, "src", img5_src_value);
      attr(img5, "alt", "");
      attr(p11, "class", "pic mb-0 me-1");
      attr(div10, "class", "col-auto");
      attr(div11, "class", "col");
      attr(div12, "class", "row no-gutters align-items-center");
      attr(a4, "class", "d-block item mb-1 p-1 active");
      attr(div13, "class", "list__info");
      attr(div14, "class", "box__overflow pe-1");
      attr(div15, "class", "box__description");
      attr(div16, "id", "mapsettingPanel");
      attr(div16, "class", "box__info-base-map p-2 rounded");
    },
    m(target, anchor) {
      insert_hydration(target, div16, anchor);
      append_hydration(div16, a0);
      append_hydration(div16, t0);
      append_hydration(div16, div0);
      append_hydration(div16, t3);
      append_hydration(div16, div15);
      append_hydration(div15, div14);
      append_hydration(div14, div13);
      append_hydration(div13, a1);
      append_hydration(a1, div3);
      append_hydration(div3, div1);
      append_hydration(div1, p2);
      append_hydration(p2, img2);
      append_hydration(div3, t4);
      append_hydration(div3, div2);
      append_hydration(div13, t8);
      append_hydration(div13, a2);
      append_hydration(a2, div6);
      append_hydration(div6, div4);
      append_hydration(div4, p5);
      append_hydration(p5, img3);
      append_hydration(div6, t9);
      append_hydration(div6, div5);
      append_hydration(div13, t13);
      append_hydration(div13, a3);
      append_hydration(a3, div9);
      append_hydration(div9, div7);
      append_hydration(div7, p8);
      append_hydration(p8, img4);
      append_hydration(div9, t14);
      append_hydration(div9, div8);
      append_hydration(div13, t18);
      append_hydration(div13, a4);
      append_hydration(a4, div12);
      append_hydration(div12, div10);
      append_hydration(div10, p11);
      append_hydration(p11, img5);
      append_hydration(div12, t19);
      append_hydration(div12, div11);
      if (!mounted) {
        dispose = [
          listen(
            a0,
            "click",
            /*click_handler*/
            ctx[2]
          ),
          listen(
            a1,
            "click",
            /*click_handler_1*/
            ctx[3]
          ),
          listen(
            a2,
            "click",
            /*click_handler_2*/
            ctx[4]
          ),
          listen(
            a3,
            "click",
            /*click_handler_3*/
            ctx[5]
          ),
          listen(a4, "click", toggleWind)
        ];
        mounted = true;
      }
    },
    p: noop,
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div16);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
const ClassicBasemapImg = "/assets/img/classic-basemap.png";
const LightBasemapImg = "/assets/img/light-basemap.png";
const DarkBasemapImg = "/assets/img/dark-basemap.png";
const WindBasemapImg = "/assets/img/wind-basemap.png";
function toggleWind() {
  console.log("toggle wind");
  const el = document.querySelector(".wind-map-container");
  el.style.display = el.style.display === "none" ? "block" : "none";
}
function instance$4($$self, $$props, $$invalidate) {
  let $ShowMapSetting;
  let $baseMapStyle;
  component_subscribe($$self, ShowMapSetting, ($$value) => $$invalidate(0, $ShowMapSetting = $$value));
  component_subscribe($$self, baseMapStyle, ($$value) => $$invalidate(1, $baseMapStyle = $$value));
  const click_handler = () => set_store_value(ShowMapSetting, $ShowMapSetting = false, $ShowMapSetting);
  const click_handler_1 = () => set_store_value(baseMapStyle, $baseMapStyle = "cltinohfj002101pc7cut13aj", $baseMapStyle);
  const click_handler_2 = () => set_store_value(baseMapStyle, $baseMapStyle = "cltiptdlg004y01ph1rm84xru", $baseMapStyle);
  const click_handler_3 = () => set_store_value(baseMapStyle, $baseMapStyle = "ckb2mbm240t2s1itc1dtmk5pf", $baseMapStyle);
  return [
    $ShowMapSetting,
    $baseMapStyle,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3
  ];
}
class MapSetting extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
  }
}
function create_default_slot$2(ctx) {
  let div0;
  let h5;
  let textContent = "Mekong PM2.5 Ranking";
  let t1;
  let closebutton;
  let t2;
  let p0;
  let t3;
  let t4;
  let t5;
  let p1;
  let t6;
  let t7;
  let ul;
  let li0;
  let textContent_1 = `<div class="d-flex justify-content-start"><div class="p-2 width10  svelte-27zeta">#</div> <div class="p-2 width70 svelte-27zeta">Major city</div> <div class="p-2 width20 svelte-27zeta"></div></div>`;
  let t12;
  let li1;
  let textContent_2 = `<div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">234</span></div></div>`;
  let t19;
  let li2;
  let textContent_3 = `<div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">12</span></div></div>`;
  let t26;
  let li3;
  let textContent_4 = `<div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 flex width70 svelte-27zeta"><div class="mr-1"></div> <div>Laos, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">32</span></div></div>`;
  let t33;
  let li4;
  let textContent_5 = `<div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">234</span></div></div>`;
  let t40;
  let li5;
  let textContent_6 = `<div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">64</span></div></div>`;
  let current;
  let mounted;
  let dispose;
  closebutton = new CloseButton({ props: { class: "mb-4 dark:text-white" } });
  closebutton.$on(
    "click",
    /*click_handler*/
    ctx[5]
  );
  return {
    c() {
      div0 = element("div");
      h5 = element("h5");
      h5.textContent = textContent;
      t1 = space();
      create_component(closebutton.$$.fragment);
      t2 = space();
      p0 = element("p");
      t3 = text(
        /*$selectedTime_str*/
        ctx[1]
      );
      t4 = text(":00:00");
      t5 = space();
      p1 = element("p");
      t6 = text(
        /*$selectedDate_str*/
        ctx[2]
      );
      t7 = space();
      ul = element("ul");
      li0 = element("li");
      li0.innerHTML = textContent_1;
      t12 = space();
      li1 = element("li");
      li1.innerHTML = textContent_2;
      t19 = space();
      li2 = element("li");
      li2.innerHTML = textContent_3;
      t26 = space();
      li3 = element("li");
      li3.innerHTML = textContent_4;
      t33 = space();
      li4 = element("li");
      li4.innerHTML = textContent_5;
      t40 = space();
      li5 = element("li");
      li5.innerHTML = textContent_6;
      this.h();
    },
    l(nodes) {
      div0 = claim_element(nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      h5 = claim_element(div0_nodes, "H5", {
        id: true,
        class: true,
        ["data-svelte-h"]: true
      });
      if (get_svelte_dataset(h5) !== "svelte-1huxu54")
        h5.textContent = textContent;
      t1 = claim_space(div0_nodes);
      claim_component(closebutton.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach);
      t2 = claim_space(nodes);
      p0 = claim_element(nodes, "P", { class: true });
      var p0_nodes = children(p0);
      t3 = claim_text(
        p0_nodes,
        /*$selectedTime_str*/
        ctx[1]
      );
      t4 = claim_text(p0_nodes, ":00:00");
      p0_nodes.forEach(detach);
      t5 = claim_space(nodes);
      p1 = claim_element(nodes, "P", { class: true });
      var p1_nodes = children(p1);
      t6 = claim_text(
        p1_nodes,
        /*$selectedDate_str*/
        ctx[2]
      );
      p1_nodes.forEach(detach);
      t7 = claim_space(nodes);
      ul = claim_element(nodes, "UL", { class: true });
      var ul_nodes = children(ul);
      li0 = claim_element(ul_nodes, "LI", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(li0) !== "svelte-1okprzs")
        li0.innerHTML = textContent_1;
      t12 = claim_space(ul_nodes);
      li1 = claim_element(ul_nodes, "LI", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(li1) !== "svelte-3m399m")
        li1.innerHTML = textContent_2;
      t19 = claim_space(ul_nodes);
      li2 = claim_element(ul_nodes, "LI", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(li2) !== "svelte-hpbjqw")
        li2.innerHTML = textContent_3;
      t26 = claim_space(ul_nodes);
      li3 = claim_element(ul_nodes, "LI", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(li3) !== "svelte-1eufhda")
        li3.innerHTML = textContent_4;
      t33 = claim_space(ul_nodes);
      li4 = claim_element(ul_nodes, "LI", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(li4) !== "svelte-1wr7g18")
        li4.innerHTML = textContent_5;
      t40 = claim_space(ul_nodes);
      li5 = claim_element(ul_nodes, "LI", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(li5) !== "svelte-1pczod")
        li5.innerHTML = textContent_6;
      ul_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(h5, "id", "drawer-label");
      attr(h5, "class", "inline-flex items-center mb-4 text-base font-semibold text-gray-800 dark:text-gray-400");
      attr(div0, "class", "flex items-center");
      attr(p0, "class", "text-sm text-gray-500 dark:text-gray-400 float-right");
      attr(p1, "class", "text-sm text-gray-500 dark:text-gray-400 mb-2");
      attr(li0, "class", "list-group-item");
      attr(li1, "class", "list-group-item text-xs");
      attr(li2, "class", "list-group-item text-xs");
      attr(li3, "class", "list-group-item text-xs");
      attr(li4, "class", "list-group-item text-xs");
      attr(li5, "class", "list-group-item text-xs");
      attr(ul, "class", "list-group text-sm");
    },
    m(target, anchor) {
      insert_hydration(target, div0, anchor);
      append_hydration(div0, h5);
      append_hydration(div0, t1);
      mount_component(closebutton, div0, null);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, p0, anchor);
      append_hydration(p0, t3);
      append_hydration(p0, t4);
      insert_hydration(target, t5, anchor);
      insert_hydration(target, p1, anchor);
      append_hydration(p1, t6);
      insert_hydration(target, t7, anchor);
      insert_hydration(target, ul, anchor);
      append_hydration(ul, li0);
      append_hydration(ul, t12);
      append_hydration(ul, li1);
      append_hydration(ul, t19);
      append_hydration(ul, li2);
      append_hydration(ul, t26);
      append_hydration(ul, li3);
      append_hydration(ul, t33);
      append_hydration(ul, li4);
      append_hydration(ul, t40);
      append_hydration(ul, li5);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            li1,
            "click",
            /*click_handler_1*/
            ctx[6]
          ),
          listen(
            li2,
            "click",
            /*click_handler_2*/
            ctx[7]
          ),
          listen(
            li3,
            "click",
            /*click_handler_3*/
            ctx[8]
          ),
          listen(
            li4,
            "click",
            /*click_handler_4*/
            ctx[9]
          ),
          listen(
            li5,
            "click",
            /*click_handler_5*/
            ctx[10]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*$selectedTime_str*/
      2)
        set_data(
          t3,
          /*$selectedTime_str*/
          ctx2[1]
        );
      if (!current || dirty & /*$selectedDate_str*/
      4)
        set_data(
          t6,
          /*$selectedDate_str*/
          ctx2[2]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(closebutton.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(closebutton.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div0);
        detach(t2);
        detach(p0);
        detach(t5);
        detach(p1);
        detach(t7);
        detach(ul);
      }
      destroy_component(closebutton);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment$3(ctx) {
  let drawer;
  let updating_hidden;
  let current;
  function drawer_hidden_binding(value) {
    ctx[11](value);
  }
  let drawer_props = {
    activateClickOutside: activateClickOutside$1,
    backdrop: backdrop$1,
    rightOffset: "top-14 h-screen end-0",
    placement: "right",
    transitionType: "fly",
    transitionParams: (
      /*transitionParamsRight*/
      ctx[3]
    ),
    id: "sidebar6",
    $$slots: { default: [create_default_slot$2] },
    $$scope: { ctx }
  };
  if (
    /*$hiddenDrawer*/
    ctx[0] !== void 0
  ) {
    drawer_props.hidden = /*$hiddenDrawer*/
    ctx[0];
  }
  drawer = new Drawer({ props: drawer_props });
  binding_callbacks.push(() => bind(drawer, "hidden", drawer_hidden_binding));
  return {
    c() {
      create_component(drawer.$$.fragment);
    },
    l(nodes) {
      claim_component(drawer.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(drawer, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const drawer_changes = {};
      if (dirty & /*$$scope, $selectedDate_str, $selectedTime_str, $hiddenDrawer*/
      65543) {
        drawer_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_hidden && dirty & /*$hiddenDrawer*/
      1) {
        updating_hidden = true;
        drawer_changes.hidden = /*$hiddenDrawer*/
        ctx2[0];
        add_flush_callback(() => updating_hidden = false);
      }
      drawer.$set(drawer_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(drawer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(drawer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(drawer, detaching);
    }
  };
}
let activateClickOutside$1 = false;
let backdrop$1 = false;
function instance$3($$self, $$props, $$invalidate) {
  let $locname;
  let $locy;
  let $locx;
  let $hiddenBottomDrawer;
  let $hiddenDrawer;
  let $selectedTime_str;
  let $selectedDate_str;
  component_subscribe($$self, locname, ($$value) => $$invalidate(12, $locname = $$value));
  component_subscribe($$self, locy, ($$value) => $$invalidate(13, $locy = $$value));
  component_subscribe($$self, locx, ($$value) => $$invalidate(14, $locx = $$value));
  component_subscribe($$self, hiddenBottomDrawer, ($$value) => $$invalidate(15, $hiddenBottomDrawer = $$value));
  component_subscribe($$self, hiddenDrawer, ($$value) => $$invalidate(0, $hiddenDrawer = $$value));
  component_subscribe($$self, selectedTime_str, ($$value) => $$invalidate(1, $selectedTime_str = $$value));
  component_subscribe($$self, selectedDate_str, ($$value) => $$invalidate(2, $selectedDate_str = $$value));
  let transitionParamsRight = { x: 320, duration: 200, easing: sineIn };
  function getStatictisChart(x, y, loc) {
    set_store_value(hiddenBottomDrawer, $hiddenBottomDrawer = false, $hiddenBottomDrawer);
    set_store_value(locx, $locx = x, $locx);
    set_store_value(locy, $locy = y, $locy);
    set_store_value(locname, $locname = loc, $locname);
  }
  const click_handler = () => set_store_value(hiddenDrawer, $hiddenDrawer = true, $hiddenDrawer);
  const click_handler_1 = () => getStatictisChart(11.2, 100.2, "Thailand, Bangkok");
  const click_handler_2 = () => getStatictisChart(11.2, 100.2, "Thailand, Bangkok");
  const click_handler_3 = () => getStatictisChart(11.2, 100.2, "Thailand, Bangkok");
  const click_handler_4 = () => getStatictisChart(11.2, 100.2, "Thailand, Bangkok");
  const click_handler_5 = () => getStatictisChart(11.2, 100.2, "Thailand, Bangkok");
  function drawer_hidden_binding(value) {
    $hiddenDrawer = value;
    hiddenDrawer.set($hiddenDrawer);
  }
  return [
    $hiddenDrawer,
    $selectedTime_str,
    $selectedDate_str,
    transitionParamsRight,
    getStatictisChart,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    click_handler_5,
    drawer_hidden_binding
  ];
}
class AQIRanking extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[5] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let option_1;
  let t_value = (
    /*option*/
    ctx[5].name + ""
  );
  let t;
  return {
    c() {
      option_1 = element("option");
      t = text(t_value);
      this.h();
    },
    l(nodes) {
      option_1 = claim_element(nodes, "OPTION", {});
      var option_1_nodes = children(option_1);
      t = claim_text(option_1_nodes, t_value);
      option_1_nodes.forEach(detach);
      this.h();
    },
    h() {
      option_1.__value = /*option*/
      ctx[5].value;
      set_input_value(option_1, option_1.__value);
    },
    m(target, anchor) {
      insert_hydration(target, option_1, anchor);
      append_hydration(option_1, t);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(option_1);
      }
    }
  };
}
function create_fragment$2(ctx) {
  let div2;
  let a;
  let textContent = `<img class="d-block" src="assets/img/icon/close.svg" alt=""/>`;
  let t0;
  let div0;
  let textContent_1 = `<p class="icon me-15 mb-0"><img style="height: 25px;" src="assets/img/icon/head-air-quality.svg" alt=""/></p> <p class="text blue-600 text-2lg font-bold mb-0">Air Pollutant</p>`;
  let t3;
  let div1;
  let p2;
  let textContent_2 = "Select air pollutant";
  let t5;
  let select2;
  let mounted;
  let dispose;
  let each_value = ensure_array_like(
    /*options*/
    ctx[2]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      div2 = element("div");
      a = element("a");
      a.innerHTML = textContent;
      t0 = space();
      div0 = element("div");
      div0.innerHTML = textContent_1;
      t3 = space();
      div1 = element("div");
      p2 = element("p");
      p2.textContent = textContent_2;
      t5 = space();
      select2 = element("select");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      this.h();
    },
    l(nodes) {
      div2 = claim_element(nodes, "DIV", { id: true, class: true });
      var div2_nodes = children(div2);
      a = claim_element(div2_nodes, "A", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(a) !== "svelte-1w7gzh6")
        a.innerHTML = textContent;
      t0 = claim_space(div2_nodes);
      div0 = claim_element(div2_nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div0) !== "svelte-12jx70m")
        div0.innerHTML = textContent_1;
      t3 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      p2 = claim_element(div1_nodes, "P", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(p2) !== "svelte-1cqawmn")
        p2.textContent = textContent_2;
      t5 = claim_space(div1_nodes);
      select2 = claim_element(div1_nodes, "SELECT", { class: true, id: true });
      var select_nodes = children(select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].l(select_nodes);
      }
      select_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      div2_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(a, "class", "btn-close border-0 d-flex align-items-center justify-content-center");
      attr(div0, "class", "head border-bottom border-green d-flex align-items-center mb-1 pb-1 w-100");
      attr(p2, "class", "blue-600");
      attr(select2, "class", "nice-select wide selectize");
      attr(select2, "id", "select-pollutant");
      if (
        /*$selectedPollutant*/
        ctx[1] === void 0
      )
        add_render_callback(() => (
          /*select_change_handler*/
          ctx[4].call(select2)
        ));
      attr(div1, "class", "box__description");
      attr(div2, "id", "select_air_pollutant");
      attr(div2, "class", "box__info-air-quality p-2 rounded");
    },
    m(target, anchor) {
      insert_hydration(target, div2, anchor);
      append_hydration(div2, a);
      append_hydration(div2, t0);
      append_hydration(div2, div0);
      append_hydration(div2, t3);
      append_hydration(div2, div1);
      append_hydration(div1, p2);
      append_hydration(div1, t5);
      append_hydration(div1, select2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select2, null);
        }
      }
      select_option(
        select2,
        /*$selectedPollutant*/
        ctx[1],
        true
      );
      if (!mounted) {
        dispose = [
          listen(
            a,
            "click",
            /*click_handler*/
            ctx[3]
          ),
          listen(
            select2,
            "change",
            /*select_change_handler*/
            ctx[4]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*options*/
      4) {
        each_value = ensure_array_like(
          /*options*/
          ctx2[2]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(select2, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
      if (dirty & /*$selectedPollutant, options*/
      6) {
        select_option(
          select2,
          /*$selectedPollutant*/
          ctx2[1]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div2);
      }
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let $ShowPollutantSelect;
  let $selectedPollutant;
  component_subscribe($$self, ShowPollutantSelect, ($$value) => $$invalidate(0, $ShowPollutantSelect = $$value));
  component_subscribe($$self, selectedPollutant, ($$value) => $$invalidate(1, $selectedPollutant = $$value));
  let options = [
    { value: "pm25", name: "PM2.5" },
    // { value: 'pm10', name: 'PM10' },
    {
      value: "no2",
      name: "Nitrogen dioxide (NO2)"
    }
  ];
  setTimeout(
    () => {
      NiceSelect.bind(document.querySelector("#select-pollutant"));
    },
    50
  );
  const click_handler = () => set_store_value(ShowPollutantSelect, $ShowPollutantSelect = false, $ShowPollutantSelect);
  function select_change_handler() {
    $selectedPollutant = select_value(this);
    selectedPollutant.set($selectedPollutant);
    $$invalidate(2, options);
  }
  return [
    $ShowPollutantSelect,
    $selectedPollutant,
    options,
    click_handler,
    select_change_handler
  ];
}
class PollutantSelect extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {});
  }
}
function addData(chart, label, newData, colors) {
  chart.data.labels = label;
  chart.data.datasets[0].data = newData;
  chart.update();
}
function removeData(chart) {
  chart.data.labels = [];
  chart.data.datasets[0].data = [];
  chart.update();
}
function create_default_slot$1(ctx) {
  let div0;
  let h5;
  let textContent = "PM 2.5 forecast of Thailand, Bangkok";
  let t1;
  let closebutton;
  let t2;
  let div6;
  let textContent_1 = `<div><p class="max-w-lg mb-6 text-sm text-gray-500 dark:text-gray-400">GEOS Air Quality Forecasts bias-corrected using machine learning algorithm</p></div> <div class="float-right"><div class="flex"><div class="mr-2"><span class="badge rounded-pill bg-success svelte-1925r2e">Min 234
						<p class="svelte-1925r2e">2024-01-01 01:00:00</p></span></div> <div class=""><span class="badge rounded-pill bg-warning svelte-1925r2e">Max 234
						<p class="svelte-1925r2e">2024-01-01 01:00:00</p></span></div></div></div>`;
  let t10;
  let div7;
  let canvas;
  let current;
  closebutton = new CloseButton({ props: { class: "mb-4 dark:text-white" } });
  closebutton.$on(
    "click",
    /*click_handler*/
    ctx[5]
  );
  return {
    c() {
      div0 = element("div");
      h5 = element("h5");
      h5.textContent = textContent;
      t1 = space();
      create_component(closebutton.$$.fragment);
      t2 = space();
      div6 = element("div");
      div6.innerHTML = textContent_1;
      t10 = space();
      div7 = element("div");
      canvas = element("canvas");
      this.h();
    },
    l(nodes) {
      div0 = claim_element(nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      h5 = claim_element(div0_nodes, "H5", {
        id: true,
        class: true,
        ["data-svelte-h"]: true
      });
      if (get_svelte_dataset(h5) !== "svelte-ntawnk")
        h5.textContent = textContent;
      t1 = claim_space(div0_nodes);
      claim_component(closebutton.$$.fragment, div0_nodes);
      div0_nodes.forEach(detach);
      t2 = claim_space(nodes);
      div6 = claim_element(nodes, "DIV", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(div6) !== "svelte-1eugj9f")
        div6.innerHTML = textContent_1;
      t10 = claim_space(nodes);
      div7 = claim_element(nodes, "DIV", { class: true, style: true });
      var div7_nodes = children(div7);
      canvas = claim_element(div7_nodes, "CANVAS", { id: true });
      children(canvas).forEach(detach);
      div7_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(h5, "id", "drawer-label");
      attr(h5, "class", "inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400");
      attr(div0, "class", "flex items-center");
      attr(div6, "class", "flex justify-between");
      attr(canvas, "id", "myChart2");
      attr(div7, "class", "chart-container");
      set_style(div7, "position", "relative");
      set_style(div7, "height", "15vh");
      set_style(div7, "width", "90vw");
    },
    m(target, anchor) {
      insert_hydration(target, div0, anchor);
      append_hydration(div0, h5);
      append_hydration(div0, t1);
      mount_component(closebutton, div0, null);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, div6, anchor);
      insert_hydration(target, t10, anchor);
      insert_hydration(target, div7, anchor);
      append_hydration(div7, canvas);
      ctx[6](canvas);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(closebutton.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(closebutton.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div0);
        detach(t2);
        detach(div6);
        detach(t10);
        detach(div7);
      }
      destroy_component(closebutton);
      ctx[6](null);
    }
  };
}
function create_fragment$1(ctx) {
  let drawer;
  let updating_hidden;
  let current;
  function drawer_hidden_binding(value) {
    ctx[7](value);
  }
  let drawer_props = {
    activateClickOutside,
    backdrop,
    placement: "bottom",
    width: "w-full",
    transitionType: "fly",
    transitionParams: (
      /*transitionParamsBottom*/
      ctx[2]
    ),
    id: "sidebar8",
    class: "shadow-lg",
    $$slots: { default: [create_default_slot$1] },
    $$scope: { ctx }
  };
  if (
    /*$hiddenBottomDrawer*/
    ctx[0] !== void 0
  ) {
    drawer_props.hidden = /*$hiddenBottomDrawer*/
    ctx[0];
  }
  drawer = new Drawer({ props: drawer_props });
  binding_callbacks.push(() => bind(drawer, "hidden", drawer_hidden_binding));
  return {
    c() {
      create_component(drawer.$$.fragment);
    },
    l(nodes) {
      claim_component(drawer.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(drawer, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const drawer_changes = {};
      if (dirty & /*$$scope, chartCanvasBottom, $hiddenBottomDrawer*/
      4099) {
        drawer_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_hidden && dirty & /*$hiddenBottomDrawer*/
      1) {
        updating_hidden = true;
        drawer_changes.hidden = /*$hiddenBottomDrawer*/
        ctx2[0];
        add_flush_callback(() => updating_hidden = false);
      }
      drawer.$set(drawer_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(drawer.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(drawer.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(drawer, detaching);
    }
  };
}
let activateClickOutside = false;
let backdrop = false;
function instance$1($$self, $$props, $$invalidate) {
  let $locx;
  let $locy;
  let $hiddenBottomDrawer;
  let $intializationDate;
  component_subscribe($$self, locx, ($$value) => $$invalidate(3, $locx = $$value));
  component_subscribe($$self, locy, ($$value) => $$invalidate(4, $locy = $$value));
  component_subscribe($$self, hiddenBottomDrawer, ($$value) => $$invalidate(0, $hiddenBottomDrawer = $$value));
  component_subscribe($$self, intializationDate, ($$value) => $$invalidate(10, $intializationDate = $$value));
  let ctx2;
  let chartCanvasBottom;
  let chartBottom;
  let transitionParamsBottom = { y: 320, duration: 200, easing: sineIn };
  async function getChartData2(drawCoords2, drawType2) {
    let dataUrl = PUBLIC_BASE_API_URL + "/mapclient";
    const initDate = $intializationDate.replace("-", "").replace("-", "");
    console.log(drawCoords2);
    let params = {
      action: "get-chartData",
      freq_chart: "3dayrecent",
      geom_data: drawCoords2,
      interaction: drawType2,
      run_date_chart: initDate + ".nc",
      run_type_chart: "geos",
      variable: "BC_MLPM25"
    };
    const res = await axios.get(dataUrl, {
      params,
      headers: {
        Authorization: `admin.KRg06uWinwXAL5SRRCBSmH2HON4tZKdpCItHpbZh7HghJFFH6mIizlNM01`
      }
    });
    if (res.data) {
      let fetchData = res.data.data;
      let pm25Data = fetchData.plot;
      let lables = pm25Data.map((tuple) => new Date(tuple[0]).toLocaleString("en-GB", { hour12: false }));
      pm25Data.map(function(tuple) {
        if (tuple[1] < 20) {
          return "#8b81ba";
        } else if (tuple[1] < 40) {
          return "#6ca7cc";
        } else if (tuple[1] < 60) {
          return "#91d2bd";
        } else if (tuple[1] < 80) {
          return "#fbfbcf";
        } else if (tuple[1] < 100) {
          return "#b44674";
        } else {
          return "#ddd";
        }
      });
      let pm25val = pm25Data.map((tuple) => tuple[1]);
      ctx2 = chartCanvasBottom.getContext("2d");
      chartBottom = new Chart(
        ctx2,
        {
          type: "line",
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              filler: { propagate: false }
            },
            scales: {
              x: {
                ticks: {
                  font: { size: 10 },
                  type: "time",
                  autoSkip: true,
                  maxTicksLimit: 3,
                  autoSkipPadding: 10
                },
                gridLines: { display: false }
              },
              y: {
                ticks: { font: { size: 10 } },
                title: {
                  display: true,
                  text: "PM 2.5",
                  font: { size: 10 }
                }
              }
            }
          },
          data: {
            labels: [],
            datasets: [
              {
                label: "PM2.5",
                backgroundColor: "rgb(255, 165, 0, 0.2)",
                borderColor: "rgb(255, 165, 0, 0.2)",
                data: [],
                lineTension: 0.3,
                fill: {
                  target: "origin",
                  above: "rgba(255, 165, 0, 0.2)",
                  // Area will be red above the origin
                  below: "rgba(255, 165, 0, 0.2)"
                  // And blue below the origin
                }
              }
            ]
          }
        }
      );
      removeData(chartBottom);
      addData(chartBottom, lables, pm25val);
    }
  }
  const click_handler = () => set_store_value(hiddenBottomDrawer, $hiddenBottomDrawer = true, $hiddenBottomDrawer);
  function canvas_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      chartCanvasBottom = $$value;
      $$invalidate(1, chartCanvasBottom);
    });
  }
  function drawer_hidden_binding(value) {
    $hiddenBottomDrawer = value;
    hiddenBottomDrawer.set($hiddenBottomDrawer);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$hiddenBottomDrawer, $locy, $locx*/
    25) {
      if ($hiddenBottomDrawer === false) {
        let coor = $locy.toString() + "," + $locx.toString();
        getChartData2(coor, "Point");
      }
    }
  };
  return [
    $hiddenBottomDrawer,
    chartCanvasBottom,
    transitionParamsBottom,
    $locx,
    $locy,
    click_handler,
    canvas_binding,
    drawer_hidden_binding
  ];
}
class BottomDrawer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {});
  }
}
const showChartModal = writable(false);
({
  subscribe: showChartModal.subscribe,
  set: showChartModal.set,
  update: showChartModal.update
});
function create_if_block_4(ctx) {
  let airpollutants;
  let current;
  airpollutants = new AirPollutants({});
  return {
    c() {
      create_component(airpollutants.$$.fragment);
    },
    l(nodes) {
      claim_component(airpollutants.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(airpollutants, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(airpollutants.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(airpollutants.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(airpollutants, detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let stationslayercontrol;
  let current;
  stationslayercontrol = new StationsLayerControl({});
  return {
    c() {
      create_component(stationslayercontrol.$$.fragment);
    },
    l(nodes) {
      claim_component(stationslayercontrol.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(stationslayercontrol, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(stationslayercontrol.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(stationslayercontrol.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(stationslayercontrol, detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let firelayercontrol;
  let current;
  firelayercontrol = new FireLayerControl({});
  return {
    c() {
      create_component(firelayercontrol.$$.fragment);
    },
    l(nodes) {
      claim_component(firelayercontrol.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(firelayercontrol, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(firelayercontrol.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(firelayercontrol.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(firelayercontrol, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let pollutantselect;
  let current;
  pollutantselect = new PollutantSelect({});
  return {
    c() {
      create_component(pollutantselect.$$.fragment);
    },
    l(nodes) {
      claim_component(pollutantselect.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(pollutantselect, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(pollutantselect.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(pollutantselect.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(pollutantselect, detaching);
    }
  };
}
function create_if_block(ctx) {
  let mapsetting;
  let current;
  mapsetting = new MapSetting({});
  return {
    c() {
      create_component(mapsetting.$$.fragment);
    },
    l(nodes) {
      claim_component(mapsetting.$$.fragment, nodes);
    },
    m(target, anchor) {
      mount_component(mapsetting, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(mapsetting.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(mapsetting.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(mapsetting, detaching);
    }
  };
}
function create_default_slot_1(ctx) {
  let h2;
  let textContent = "Air quality monitoring";
  return {
    c() {
      h2 = element("h2");
      h2.textContent = textContent;
      this.h();
    },
    l(nodes) {
      h2 = claim_element(nodes, "H2", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(h2) !== "svelte-bf0pzk")
        h2.textContent = textContent;
      this.h();
    },
    h() {
      attr(h2, "class", "font-meduim text-lg text-slate-700 mb-0");
    },
    m(target, anchor) {
      insert_hydration(target, h2, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(h2);
      }
    }
  };
}
function create_default_slot(ctx) {
  let p;
  let t0;
  let t1;
  let t2;
  let div;
  let canvas;
  return {
    c() {
      p = element("p");
      t0 = text("Location: ");
      t1 = text(
        /*$drawCoords*/
        ctx[1]
      );
      t2 = space();
      div = element("div");
      canvas = element("canvas");
      this.h();
    },
    l(nodes) {
      p = claim_element(nodes, "P", { class: true });
      var p_nodes = children(p);
      t0 = claim_text(p_nodes, "Location: ");
      t1 = claim_text(
        p_nodes,
        /*$drawCoords*/
        ctx[1]
      );
      p_nodes.forEach(detach);
      t2 = claim_space(nodes);
      div = claim_element(nodes, "DIV", { class: true, style: true });
      var div_nodes = children(div);
      canvas = claim_element(div_nodes, "CANVAS", { id: true });
      children(canvas).forEach(detach);
      div_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(p, "class", "mt-0 font-light text-xs text-slate-500");
      attr(canvas, "id", "myChart");
      attr(div, "class", "chart-container");
      set_style(div, "position", "relative");
      set_style(div, "height", "15vh");
      set_style(div, "width", "40vw");
    },
    m(target, anchor) {
      insert_hydration(target, p, anchor);
      append_hydration(p, t0);
      append_hydration(p, t1);
      insert_hydration(target, t2, anchor);
      insert_hydration(target, div, anchor);
      append_hydration(div, canvas);
      ctx[19](canvas);
    },
    p(ctx2, dirty) {
      if (dirty & /*$drawCoords*/
      2)
        set_data(
          t1,
          /*$drawCoords*/
          ctx2[1]
        );
    },
    d(detaching) {
      if (detaching) {
        detach(p);
        detach(t2);
        detach(div);
      }
      ctx[19](null);
    }
  };
}
function create_header_slot(ctx) {
  let h2;
  let textContent = "Air quality monitoring";
  return {
    c() {
      h2 = element("h2");
      h2.textContent = textContent;
      this.h();
    },
    l(nodes) {
      h2 = claim_element(nodes, "H2", {
        slot: true,
        class: true,
        ["data-svelte-h"]: true
      });
      if (get_svelte_dataset(h2) !== "svelte-cd3bw0")
        h2.textContent = textContent;
      this.h();
    },
    h() {
      attr(h2, "slot", "header");
      attr(h2, "class", "font-meduim text-lg text-slate-700 mb-0");
    },
    m(target, anchor) {
      insert_hydration(target, h2, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(h2);
      }
    }
  };
}
function create_fragment(ctx) {
  let div6;
  let div1;
  let div0;
  let t0;
  let t1;
  let t2;
  let div2;
  let layertoggle;
  let t3;
  let t4;
  let t5;
  let div3;
  let a0;
  let textContent = `<img src="assets/img/icon/icon-plus.svg" alt=""/>`;
  let t6;
  let a1;
  let textContent_1 = `<img src="assets/img/icon/icon-minus.svg" alt=""/>`;
  let t7;
  let div4;
  let mapexample;
  let updating_map;
  let t8;
  let div5;
  let timeslider;
  let t9;
  let aqiranking;
  let updating_hiddenDrawer;
  let t10;
  let bottomdrawer;
  let updating_hiddenDrawer_1;
  let t11;
  let modal;
  let updating_showModal;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*$ShowPollutant*/
    ctx[8] && create_if_block_4()
  );
  let if_block1 = (
    /*$ShowStation*/
    ctx[9] && create_if_block_3()
  );
  let if_block2 = (
    /*$ShowFire*/
    ctx[10] && create_if_block_2()
  );
  layertoggle = new LayerToggle({});
  let if_block3 = (
    /*$ShowPollutantSelect*/
    ctx[6] && create_if_block_1()
  );
  let if_block4 = (
    /*$ShowMapSetting*/
    ctx[7] && create_if_block()
  );
  function mapexample_map_binding(value) {
    ctx[16](value);
  }
  let mapexample_props = {};
  if (
    /*map*/
    ctx[2] !== void 0
  ) {
    mapexample_props.map = /*map*/
    ctx[2];
  }
  mapexample = new MapBox({ props: mapexample_props });
  binding_callbacks.push(() => bind(mapexample, "map", mapexample_map_binding));
  timeslider = new TimeSlider({});
  function aqiranking_hiddenDrawer_binding(value) {
    ctx[17](value);
  }
  let aqiranking_props = {};
  if (
    /*$hiddenDrawer*/
    ctx[0] !== void 0
  ) {
    aqiranking_props.hiddenDrawer = /*$hiddenDrawer*/
    ctx[0];
  }
  aqiranking = new AQIRanking({ props: aqiranking_props });
  binding_callbacks.push(() => bind(aqiranking, "hiddenDrawer", aqiranking_hiddenDrawer_binding));
  function bottomdrawer_hiddenDrawer_binding(value) {
    ctx[18](value);
  }
  let bottomdrawer_props = {
    $$slots: { default: [create_default_slot_1] },
    $$scope: { ctx }
  };
  if (
    /*$hiddenBottomDrawer*/
    ctx[5] !== void 0
  ) {
    bottomdrawer_props.hiddenDrawer = /*$hiddenBottomDrawer*/
    ctx[5];
  }
  bottomdrawer = new BottomDrawer({ props: bottomdrawer_props });
  binding_callbacks.push(() => bind(bottomdrawer, "hiddenDrawer", bottomdrawer_hiddenDrawer_binding));
  function modal_showModal_binding(value) {
    ctx[20](value);
  }
  let modal_props = {
    $$slots: {
      header: [create_header_slot],
      default: [create_default_slot]
    },
    $$scope: { ctx }
  };
  if (
    /*showModal*/
    ctx[3] !== void 0
  ) {
    modal_props.showModal = /*showModal*/
    ctx[3];
  }
  modal = new Modal({ props: modal_props });
  binding_callbacks.push(() => bind(modal, "showModal", modal_showModal_binding));
  return {
    c() {
      div6 = element("div");
      div1 = element("div");
      div0 = element("div");
      if (if_block0)
        if_block0.c();
      t0 = space();
      if (if_block1)
        if_block1.c();
      t1 = space();
      if (if_block2)
        if_block2.c();
      t2 = space();
      div2 = element("div");
      create_component(layertoggle.$$.fragment);
      t3 = space();
      if (if_block3)
        if_block3.c();
      t4 = space();
      if (if_block4)
        if_block4.c();
      t5 = space();
      div3 = element("div");
      a0 = element("a");
      a0.innerHTML = textContent;
      t6 = space();
      a1 = element("a");
      a1.innerHTML = textContent_1;
      t7 = space();
      div4 = element("div");
      create_component(mapexample.$$.fragment);
      t8 = space();
      div5 = element("div");
      create_component(timeslider.$$.fragment);
      t9 = space();
      create_component(aqiranking.$$.fragment);
      t10 = space();
      create_component(bottomdrawer.$$.fragment);
      t11 = space();
      create_component(modal.$$.fragment);
      this.h();
    },
    l(nodes) {
      div6 = claim_element(nodes, "DIV", { id: true });
      var div6_nodes = children(div6);
      div1 = claim_element(div6_nodes, "DIV", { class: true });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", { class: true });
      var div0_nodes = children(div0);
      if (if_block0)
        if_block0.l(div0_nodes);
      t0 = claim_space(div0_nodes);
      if (if_block1)
        if_block1.l(div0_nodes);
      t1 = claim_space(div0_nodes);
      if (if_block2)
        if_block2.l(div0_nodes);
      div0_nodes.forEach(detach);
      div1_nodes.forEach(detach);
      t2 = claim_space(div6_nodes);
      div2 = claim_element(div6_nodes, "DIV", { id: true, class: true });
      var div2_nodes = children(div2);
      claim_component(layertoggle.$$.fragment, div2_nodes);
      t3 = claim_space(div2_nodes);
      if (if_block3)
        if_block3.l(div2_nodes);
      t4 = claim_space(div2_nodes);
      if (if_block4)
        if_block4.l(div2_nodes);
      div2_nodes.forEach(detach);
      t5 = claim_space(div6_nodes);
      div3 = claim_element(div6_nodes, "DIV", { class: true });
      var div3_nodes = children(div3);
      a0 = claim_element(div3_nodes, "A", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(a0) !== "svelte-1kv41tv")
        a0.innerHTML = textContent;
      t6 = claim_space(div3_nodes);
      a1 = claim_element(div3_nodes, "A", { class: true, ["data-svelte-h"]: true });
      if (get_svelte_dataset(a1) !== "svelte-15v47jt")
        a1.innerHTML = textContent_1;
      div3_nodes.forEach(detach);
      t7 = claim_space(div6_nodes);
      div4 = claim_element(div6_nodes, "DIV", { class: true });
      var div4_nodes = children(div4);
      claim_component(mapexample.$$.fragment, div4_nodes);
      div4_nodes.forEach(detach);
      t8 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", { class: true });
      var div5_nodes = children(div5);
      claim_component(timeslider.$$.fragment, div5_nodes);
      div5_nodes.forEach(detach);
      t9 = claim_space(div6_nodes);
      claim_component(aqiranking.$$.fragment, div6_nodes);
      t10 = claim_space(div6_nodes);
      claim_component(bottomdrawer.$$.fragment, div6_nodes);
      t11 = claim_space(div6_nodes);
      claim_component(modal.$$.fragment, div6_nodes);
      div6_nodes.forEach(detach);
      this.h();
    },
    h() {
      attr(div0, "class", "slider");
      attr(div1, "class", "box__info-ugm");
      attr(div2, "id", "right-component");
      attr(div2, "class", "box__tool bg-white py-2 rounded");
      attr(a0, "class", "btn-plus d-flex align-items-center justify-content-center mb-1");
      attr(a1, "class", "btn-minus d-flex align-items-center justify-content-center");
      attr(div3, "class", "box__zoom-map");
      attr(div4, "class", "map overflow-hidden");
      attr(div5, "class", "absolute dateTime-position w-full flex justify-center items-stretch svelte-1mxola6");
      attr(div6, "id", "box__home");
    },
    m(target, anchor) {
      insert_hydration(target, div6, anchor);
      append_hydration(div6, div1);
      append_hydration(div1, div0);
      if (if_block0)
        if_block0.m(div0, null);
      append_hydration(div0, t0);
      if (if_block1)
        if_block1.m(div0, null);
      append_hydration(div0, t1);
      if (if_block2)
        if_block2.m(div0, null);
      append_hydration(div6, t2);
      append_hydration(div6, div2);
      mount_component(layertoggle, div2, null);
      append_hydration(div2, t3);
      if (if_block3)
        if_block3.m(div2, null);
      append_hydration(div2, t4);
      if (if_block4)
        if_block4.m(div2, null);
      append_hydration(div6, t5);
      append_hydration(div6, div3);
      append_hydration(div3, a0);
      append_hydration(div3, t6);
      append_hydration(div3, a1);
      append_hydration(div6, t7);
      append_hydration(div6, div4);
      mount_component(mapexample, div4, null);
      append_hydration(div6, t8);
      append_hydration(div6, div5);
      mount_component(timeslider, div5, null);
      append_hydration(div6, t9);
      mount_component(aqiranking, div6, null);
      append_hydration(div6, t10);
      mount_component(bottomdrawer, div6, null);
      append_hydration(div6, t11);
      mount_component(modal, div6, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            a0,
            "click",
            /*mapZoomIn*/
            ctx[11]
          ),
          listen(
            a1,
            "click",
            /*mapZoomOut*/
            ctx[12]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (
        /*$ShowPollutant*/
        ctx2[8]
      ) {
        if (if_block0) {
          if (dirty & /*$ShowPollutant*/
          256) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_4();
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div0, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*$ShowStation*/
        ctx2[9]
      ) {
        if (if_block1) {
          if (dirty & /*$ShowStation*/
          512) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_3();
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div0, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (
        /*$ShowFire*/
        ctx2[10]
      ) {
        if (if_block2) {
          if (dirty & /*$ShowFire*/
          1024) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_2();
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div0, null);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, () => {
          if_block2 = null;
        });
        check_outros();
      }
      if (
        /*$ShowPollutantSelect*/
        ctx2[6]
      ) {
        if (if_block3) {
          if (dirty & /*$ShowPollutantSelect*/
          64) {
            transition_in(if_block3, 1);
          }
        } else {
          if_block3 = create_if_block_1();
          if_block3.c();
          transition_in(if_block3, 1);
          if_block3.m(div2, t4);
        }
      } else if (if_block3) {
        group_outros();
        transition_out(if_block3, 1, 1, () => {
          if_block3 = null;
        });
        check_outros();
      }
      if (
        /*$ShowMapSetting*/
        ctx2[7]
      ) {
        if (if_block4) {
          if (dirty & /*$ShowMapSetting*/
          128) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block();
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(div2, null);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, () => {
          if_block4 = null;
        });
        check_outros();
      }
      const mapexample_changes = {};
      if (!updating_map && dirty & /*map*/
      4) {
        updating_map = true;
        mapexample_changes.map = /*map*/
        ctx2[2];
        add_flush_callback(() => updating_map = false);
      }
      mapexample.$set(mapexample_changes);
      const aqiranking_changes = {};
      if (!updating_hiddenDrawer && dirty & /*$hiddenDrawer*/
      1) {
        updating_hiddenDrawer = true;
        aqiranking_changes.hiddenDrawer = /*$hiddenDrawer*/
        ctx2[0];
        add_flush_callback(() => updating_hiddenDrawer = false);
      }
      aqiranking.$set(aqiranking_changes);
      const bottomdrawer_changes = {};
      if (dirty & /*$$scope*/
      536870912) {
        bottomdrawer_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_hiddenDrawer_1 && dirty & /*$hiddenBottomDrawer*/
      32) {
        updating_hiddenDrawer_1 = true;
        bottomdrawer_changes.hiddenDrawer = /*$hiddenBottomDrawer*/
        ctx2[5];
        add_flush_callback(() => updating_hiddenDrawer_1 = false);
      }
      bottomdrawer.$set(bottomdrawer_changes);
      const modal_changes = {};
      if (dirty & /*$$scope, chartCanvas, $drawCoords*/
      536870930) {
        modal_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_showModal && dirty & /*showModal*/
      8) {
        updating_showModal = true;
        modal_changes.showModal = /*showModal*/
        ctx2[3];
        add_flush_callback(() => updating_showModal = false);
      }
      modal.$set(modal_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      transition_in(layertoggle.$$.fragment, local);
      transition_in(if_block3);
      transition_in(if_block4);
      transition_in(mapexample.$$.fragment, local);
      transition_in(timeslider.$$.fragment, local);
      transition_in(aqiranking.$$.fragment, local);
      transition_in(bottomdrawer.$$.fragment, local);
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(if_block2);
      transition_out(layertoggle.$$.fragment, local);
      transition_out(if_block3);
      transition_out(if_block4);
      transition_out(mapexample.$$.fragment, local);
      transition_out(timeslider.$$.fragment, local);
      transition_out(aqiranking.$$.fragment, local);
      transition_out(bottomdrawer.$$.fragment, local);
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div6);
      }
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (if_block2)
        if_block2.d();
      destroy_component(layertoggle);
      if (if_block3)
        if_block3.d();
      if (if_block4)
        if_block4.d();
      destroy_component(mapexample);
      destroy_component(timeslider);
      destroy_component(aqiranking);
      destroy_component(bottomdrawer);
      destroy_component(modal);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $hiddenDrawer;
  let $drawType;
  let $drawCoords;
  let $showChartModal;
  let $pcdshow;
  let $forecastedTime;
  let $forecastedDate;
  let $intializationDate;
  let $selectedFire;
  let $hiddenBottomDrawer;
  let $ShowPollutantSelect;
  let $ShowMapSetting;
  let $ShowPollutant;
  let $ShowStation;
  let $ShowFire;
  component_subscribe($$self, hiddenDrawer, ($$value) => $$invalidate(0, $hiddenDrawer = $$value));
  component_subscribe($$self, drawType, ($$value) => $$invalidate(13, $drawType = $$value));
  component_subscribe($$self, drawCoords, ($$value) => $$invalidate(1, $drawCoords = $$value));
  component_subscribe($$self, showChartModal, ($$value) => $$invalidate(14, $showChartModal = $$value));
  component_subscribe($$self, pcdshow, ($$value) => $$invalidate(15, $pcdshow = $$value));
  component_subscribe($$self, forecastedTime, ($$value) => $$invalidate(23, $forecastedTime = $$value));
  component_subscribe($$self, forecastedDate, ($$value) => $$invalidate(24, $forecastedDate = $$value));
  component_subscribe($$self, intializationDate, ($$value) => $$invalidate(25, $intializationDate = $$value));
  component_subscribe($$self, selectedFire, ($$value) => $$invalidate(26, $selectedFire = $$value));
  component_subscribe($$self, hiddenBottomDrawer, ($$value) => $$invalidate(5, $hiddenBottomDrawer = $$value));
  component_subscribe($$self, ShowPollutantSelect, ($$value) => $$invalidate(6, $ShowPollutantSelect = $$value));
  component_subscribe($$self, ShowMapSetting, ($$value) => $$invalidate(7, $ShowMapSetting = $$value));
  component_subscribe($$self, ShowPollutant, ($$value) => $$invalidate(8, $ShowPollutant = $$value));
  component_subscribe($$self, ShowStation, ($$value) => $$invalidate(9, $ShowStation = $$value));
  component_subscribe($$self, ShowFire, ($$value) => $$invalidate(10, $ShowFire = $$value));
  let map;
  let showModal = false;
  let ctx;
  let chartCanvas;
  let chart;
  set_store_value(ShowPollutant, $ShowPollutant = true, $ShowPollutant);
  set_store_value(ShowMapSetting, $ShowMapSetting = false, $ShowMapSetting);
  set_store_value(hiddenDrawer, $hiddenDrawer = false, $hiddenDrawer);
  set_store_value(ShowPollutantSelect, $ShowPollutantSelect = false, $ShowPollutantSelect);
  set_store_value(hiddenBottomDrawer, $hiddenBottomDrawer = true, $hiddenBottomDrawer);
  set_store_value(selectedFire, $selectedFire = "fires_viirs_24", $selectedFire);
  setTimeout(
    () => {
      ctx = chartCanvas.getContext("2d");
      chart = new Chart(
        ctx,
        {
          type: "bar",
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: {
                ticks: {
                  font: { size: 10 },
                  type: "time",
                  autoSkip: true,
                  maxTicksLimit: 3,
                  autoSkipPadding: 10
                },
                gridLines: { display: false }
              },
              y: {
                ticks: { font: { size: 10 } },
                title: {
                  display: true,
                  text: "PM 2.5",
                  font: { size: 10 }
                }
              }
            }
          },
          data: {
            labels: [],
            datasets: [
              {
                label: "PM2.5",
                backgroundColor: "rgb(126, 58, 242)",
                borderColor: "rgb(126, 58, 242)",
                data: [],
                backgroundColor: [],
                lineTension: 0.3
              }
            ]
          }
        }
      );
    },
    200
  );
  async function getChartData(drawCoords2, drawType2) {
    let dataUrl = PUBLIC_BASE_API_URL + "/mapclient";
    const initDate = $intializationDate.replace("-", "").replace("-", "");
    console.log(drawCoords2);
    let params = {
      action: "get-chartData",
      freq_chart: "3dayrecent",
      geom_data: drawCoords2,
      interaction: drawType2,
      run_date_chart: initDate + ".nc",
      run_type_chart: "geos",
      variable: "BC_MLPM25"
    };
    const res = await axios.get(dataUrl, {
      params,
      headers: {
        Authorization: `admin.KRg06uWinwXAL5SRRCBSmH2HON4tZKdpCItHpbZh7HghJFFH6mIizlNM01`
      }
    });
    if (res.data) {
      let fetchData = res.data.data;
      let pm25Data = fetchData.plot;
      let lables = pm25Data.map((tuple) => new Date(tuple[0]).toLocaleString("en-GB", { hour12: false }));
      let barColors = pm25Data.map(function(tuple) {
        if (tuple[1] < 20) {
          return "#8b81ba";
        } else if (tuple[1] < 40) {
          return "#6ca7cc";
        } else if (tuple[1] < 60) {
          return "#91d2bd";
        } else if (tuple[1] < 80) {
          return "#fbfbcf";
        } else if (tuple[1] < 100) {
          return "#b44674";
        } else {
          return "#ddd";
        }
      });
      console.log(barColors);
      let pm25val = pm25Data.map((tuple) => tuple[1]);
      removeData(chart);
      addData(chart, lables, pm25val);
      let pointContent = document.querySelector(".mapboxgl-popup-content");
      pointContent.innerHTML += '<div class="point-popup-val">' + pm25val[0] + ' µgm<sup>3</sup> <span id="open-statistic-button"  style="float: right; cursor: pointer;"><i class="fa fa-signal mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent" aria-hidden="true"></i></span> </div>';
      document.getElementById("open-statistic-button").addEventListener("click", function(e) {
        $$invalidate(3, showModal = true);
      });
    }
    console.log(res.data);
  }
  async function getStations() {
    let dataUrl = PUBLIC_BASE_API_URL + "/mapclient";
    let selectedDate = $forecastedDate + "+" + $forecastedTime.replace("h", "") + ":00:00";
    console.log(selectedDate);
    let params = {
      action: "get-stations",
      obs_date: "2024-01-09+11:00:00"
    };
    const res = await axios.get(dataUrl, {
      params,
      paramsSerializer: (params2) => qs.stringify(params2, { encode: false }),
      headers: {
        Authorization: `admin.KRg06uWinwXAL5SRRCBSmH2HON4tZKdpCItHpbZh7HghJFFH6mIizlNM01`
      }
    });
    let geojsons = createFeatureCollection(res.data.data);
    createMarker(map, mapboxgl, geojsons);
  }
  function mapZoomIn() {
    let currentZoom = map.getZoom();
    map.setZoom(currentZoom + 1);
  }
  function mapZoomOut() {
    let currentZoom = map.getZoom();
    map.setZoom(currentZoom - 1);
  }
  function mapexample_map_binding(value) {
    map = value;
    $$invalidate(2, map);
  }
  function aqiranking_hiddenDrawer_binding(value) {
    $hiddenDrawer = value;
    hiddenDrawer.set($hiddenDrawer);
  }
  function bottomdrawer_hiddenDrawer_binding(value) {
    $hiddenBottomDrawer = value;
    hiddenBottomDrawer.set($hiddenBottomDrawer);
  }
  function canvas_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      chartCanvas = $$value;
      $$invalidate(4, chartCanvas);
    });
  }
  function modal_showModal_binding(value) {
    showModal = value;
    $$invalidate(3, showModal), $$invalidate(14, $showChartModal);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$pcdshow*/
    32768) {
      if ($pcdshow) {
        getStations();
      }
    }
    if ($$self.$$.dirty & /*$showChartModal*/
    16384) {
      if ($showChartModal) {
        $$invalidate(3, showModal = true);
      }
    }
    if ($$self.$$.dirty & /*$drawCoords, $drawType*/
    8194) {
      if ($drawCoords !== "") {
        getChartData($drawCoords, $drawType);
      }
    }
    if ($$self.$$.dirty & /*$hiddenDrawer*/
    1) {
      if (!$hiddenDrawer) {
        document.querySelectorAll("#right-component").forEach((el) => el.style.right = "330px");
        document.querySelectorAll("#timeslider").forEach((el) => el.style.justifyContent = "right");
      }
    }
    if ($$self.$$.dirty & /*$hiddenDrawer*/
    1) {
      if ($hiddenDrawer) {
        document.querySelectorAll("#right-component").forEach((el) => el.style.right = "30px");
        document.querySelectorAll("#timeslider").forEach((el) => el.style.justifyContent = "center");
      }
    }
  };
  return [
    $hiddenDrawer,
    $drawCoords,
    map,
    showModal,
    chartCanvas,
    $hiddenBottomDrawer,
    $ShowPollutantSelect,
    $ShowMapSetting,
    $ShowPollutant,
    $ShowStation,
    $ShowFire,
    mapZoomIn,
    mapZoomOut,
    $drawType,
    $showChartModal,
    $pcdshow,
    mapexample_map_binding,
    aqiranking_hiddenDrawer_binding,
    bottomdrawer_hiddenDrawer_binding,
    canvas_binding,
    modal_showModal_binding
  ];
}
class Page extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
}
export {
  Page as component,
  _page as universal
};
