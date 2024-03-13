import { n as noop, c as create_ssr_component, a as subscribe, s as setContext, b as add_attribute, d as set_store_value, e as escape, f as each, h as createEventDispatcher, v as validate_component, i as add_styles, o as onDestroy, j as compute_rest_props, g as getContext, k as spread, l as escape_attribute_value, p as escape_object } from "../../chunks/ssr.js";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import qs from "qs";
import Chart from "chart.js/auto";
import "@mapbox/mapbox-gl-draw";
import { w as writable } from "../../chunks/index.js";
import "d3";
import { twMerge } from "tailwind-merge";
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const PUBLIC_BASE_API_URL = "http://localhost:8080/api/";
const PUBLIC_BASE_WMS_URL = "http://216.218.240.247:8080/thredds/wms/";
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
const MapBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedProduct, $$unsubscribe_selectedProduct;
  let $selectedPollutant, $$unsubscribe_selectedPollutant;
  let $ShowPollutant, $$unsubscribe_ShowPollutant;
  let $ShowStation, $$unsubscribe_ShowStation;
  let $ShowFire, $$unsubscribe_ShowFire;
  let $selectedFire, $$unsubscribe_selectedFire;
  let $baseMapStyle, $$unsubscribe_baseMapStyle;
  let $intializationDate, $$unsubscribe_intializationDate;
  let $selectedProductLayer, $$unsubscribe_selectedProductLayer;
  let $forecastedTime, $$unsubscribe_forecastedTime;
  let $forecastedDate, $$unsubscribe_forecastedDate;
  let $$unsubscribe_drawType;
  let $$unsubscribe_drawCoords;
  let $PollutantTileUrl, $$unsubscribe_PollutantTileUrl;
  $$unsubscribe_selectedProduct = subscribe(selectedProduct, (value) => $selectedProduct = value);
  $$unsubscribe_selectedPollutant = subscribe(selectedPollutant, (value) => $selectedPollutant = value);
  $$unsubscribe_ShowPollutant = subscribe(ShowPollutant, (value) => $ShowPollutant = value);
  $$unsubscribe_ShowStation = subscribe(ShowStation, (value) => $ShowStation = value);
  $$unsubscribe_ShowFire = subscribe(ShowFire, (value) => $ShowFire = value);
  $$unsubscribe_selectedFire = subscribe(selectedFire, (value) => $selectedFire = value);
  $$unsubscribe_baseMapStyle = subscribe(baseMapStyle, (value) => $baseMapStyle = value);
  $$unsubscribe_intializationDate = subscribe(intializationDate, (value) => $intializationDate = value);
  $$unsubscribe_selectedProductLayer = subscribe(selectedProductLayer, (value) => $selectedProductLayer = value);
  $$unsubscribe_forecastedTime = subscribe(forecastedTime, (value) => $forecastedTime = value);
  $$unsubscribe_forecastedDate = subscribe(forecastedDate, (value) => $forecastedDate = value);
  $$unsubscribe_drawType = subscribe(drawType, (value) => value);
  $$unsubscribe_drawCoords = subscribe(drawCoords, (value) => value);
  $$unsubscribe_PollutantTileUrl = subscribe(PollutantTileUrl, (value) => $PollutantTileUrl = value);
  let { map } = $$props;
  let { Draw } = $$props;
  let mapContainer;
  let currentFire = "";
  setContext(contextKey, {
    getMap: () => map,
    getMapBoxDraw: () => Draw
  });
  mapboxgl.accessToken = "pk.eyJ1Ijoic2VydmlybWVrb25nIiwiYSI6ImNrYWMzenhldDFvNG4yeXBtam1xMTVseGoifQ.Wr-FBcvcircZ0qyItQTq9g";
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
    currentFire = layername;
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
  function getMap() {
    return map;
  }
  if ($$props.map === void 0 && $$bindings.map && map !== void 0)
    $$bindings.map(map);
  if ($$props.Draw === void 0 && $$bindings.Draw && Draw !== void 0)
    $$bindings.Draw(Draw);
  if ($$props.getMap === void 0 && $$bindings.getMap && getMap !== void 0)
    $$bindings.getMap(getMap);
  {
    if ($intializationDate !== "") {
      addTileMap($selectedPollutant, $selectedProduct);
    }
  }
  {
    if ($forecastedDate !== "" && $forecastedTime !== "" && $intializationDate !== "" && map.getLayer("wms-layer")) {
      updateTileMap($selectedPollutant, $selectedProduct);
    }
  }
  {
    if ($selectedProductLayer && $intializationDate !== "" && map.getLayer("wms-layer")) {
      updateTileMap($selectedPollutant, $selectedProduct);
    }
  }
  {
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
  {
    if (map && $ShowFire == false && map.getLayer("fire-wms-layer")) {
      clearLayer(map, "fire-wms-layer");
      clearSource(map, "fire-wms-source");
    }
  }
  {
    if (map && $ShowFire == true && !map.getLayer("fire-wms-layer")) {
      addFireTileMap($selectedFire);
    }
  }
  {
    if ($selectedFire !== currentFire && map && $ShowFire == true) {
      addFireTileMap($selectedFire);
    }
  }
  {
    if (map && $ShowFire == true && map.getLayer("fire-wms-layer")) {
      map.setPaintProperty("fire-wms-layer", "raster-opacity", 0.9);
    }
  }
  {
    if (map && $ShowStation == false) {
      clearLayer(map, "station-point");
      clearLayer(map, "marker-text");
      clearSource(map, "station-data");
    }
  }
  {
    if (map && $ShowPollutant == false) {
      map.setPaintProperty("wms-layer", "raster-opacity", 0);
    }
  }
  {
    if (map && $ShowPollutant == true && map.getLayer("wms-layer")) {
      console.log("ShowPollutant ture", $selectedPollutant, $selectedProduct);
      map.setPaintProperty("wms-layer", "raster-opacity", 0.7);
    }
  }
  $$unsubscribe_selectedProduct();
  $$unsubscribe_selectedPollutant();
  $$unsubscribe_ShowPollutant();
  $$unsubscribe_ShowStation();
  $$unsubscribe_ShowFire();
  $$unsubscribe_selectedFire();
  $$unsubscribe_baseMapStyle();
  $$unsubscribe_intializationDate();
  $$unsubscribe_selectedProductLayer();
  $$unsubscribe_forecastedTime();
  $$unsubscribe_forecastedDate();
  $$unsubscribe_drawType();
  $$unsubscribe_drawCoords();
  $$unsubscribe_PollutantTileUrl();
  return `<div class="wind-map-container" data-svelte-h="svelte-lapt2t"><canvas id="mapcanvas" class="relative w-full h-screen"></canvas></div> <div id="map-container" class="relative w-full h-screen"${add_attribute("this", mapContainer, 0)}></div>`;
});
function is_date(obj) {
  return Object.prototype.toString.call(obj) === "[object Date]";
}
function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60);
    const spring2 = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring2 - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;
    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value;
    } else {
      ctx.settled = false;
      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map(
      (_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i])
    );
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) {
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    }
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
function spring(value, opts = {}) {
  const store = writable(value);
  const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
  let last_time;
  let task;
  let current_token;
  let last_value = value;
  let target_value = value;
  let inv_mass = 1;
  let inv_mass_recovery_rate = 0;
  let cancel_task = false;
  function set(new_value, opts2 = {}) {
    target_value = new_value;
    const token = current_token = {};
    if (value == null || opts2.hard || spring2.stiffness >= 1 && spring2.damping >= 1) {
      cancel_task = true;
      last_time = now();
      last_value = new_value;
      store.set(value = target_value);
      return Promise.resolve();
    } else if (opts2.soft) {
      const rate = opts2.soft === true ? 0.5 : +opts2.soft;
      inv_mass_recovery_rate = 1 / (rate * 60);
      inv_mass = 0;
    }
    if (!task) {
      last_time = now();
      cancel_task = false;
      task = loop((now2) => {
        if (cancel_task) {
          cancel_task = false;
          task = null;
          return false;
        }
        inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
        const ctx = {
          inv_mass,
          opts: spring2,
          settled: true,
          dt: (now2 - last_time) * 60 / 1e3
        };
        const next_value = tick_spring(ctx, last_value, value, target_value);
        last_time = now2;
        last_value = value;
        store.set(value = next_value);
        if (ctx.settled) {
          task = null;
        }
        return !ctx.settled;
      });
    }
    return new Promise((fulfil) => {
      task.promise.then(() => {
        if (token === current_token)
          fulfil();
      });
    });
  }
  const spring2 = {
    set,
    update: (fn, opts2) => set(fn(target_value, value), opts2),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  };
  return spring2;
}
function sineIn(t) {
  const v = Math.cos(t * Math.PI * 0.5);
  if (Math.abs(v) < 1e-14)
    return 1;
  else
    return 1 - v;
}
const css$a = {
  code: ".rangeSlider{--pip:var(--range-pip, lightslategray);--pip-text:var(--range-pip-text, var(--pip));--pip-active:var(--range-pip-active, darkslategrey);--pip-active-text:var(--range-pip-active-text, var(--pip-active));--pip-hover:var(--range-pip-hover, darkslategrey);--pip-hover-text:var(--range-pip-hover-text, var(--pip-hover));--pip-in-range:var(--range-pip-in-range, var(--pip-active));--pip-in-range-text:var(--range-pip-in-range-text, var(--pip-active-text))}.rangePips{position:absolute;height:1em;left:0;right:0;bottom:-1em}.rangePips.vertical{height:auto;width:1em;left:100%;right:auto;top:0;bottom:0}.rangePips .pip{height:0.4em;position:absolute;top:0.25em;width:1px;white-space:nowrap}.rangePips.vertical .pip{height:1px;width:0.4em;left:0.25em;top:auto;bottom:auto}.rangePips .pipVal{position:absolute;top:0.4em;transform:translate(-50%, 25%)}.rangePips.vertical .pipVal{position:absolute;top:0;left:0.4em;transform:translate(25%, -50%)}.rangePips .pip{transition:all 0.15s ease}.rangePips .pipVal{transition:all 0.15s ease, font-weight 0s linear}.rangePips .pip{color:lightslategray;color:var(--pip-text);background-color:lightslategray;background-color:var(--pip)}.rangePips .pip.selected{color:darkslategrey;color:var(--pip-active-text);background-color:darkslategrey;background-color:var(--pip-active)}.rangePips.hoverable:not(.disabled) .pip:hover{color:darkslategrey;color:var(--pip-hover-text);background-color:darkslategrey;background-color:var(--pip-hover)}.rangePips .pip.in-range{color:darkslategrey;color:var(--pip-in-range-text);background-color:darkslategrey;background-color:var(--pip-in-range)}.rangePips .pip.selected{height:0.75em}.rangePips.vertical .pip.selected{height:1px;width:0.75em}.rangePips .pip.selected .pipVal{font-weight:bold;top:0.75em}.rangePips.vertical .pip.selected .pipVal{top:0;left:0.75em}.rangePips.hoverable:not(.disabled) .pip:not(.selected):hover{transition:none}.rangePips.hoverable:not(.disabled) .pip:not(.selected):hover .pipVal{transition:none;font-weight:bold}",
  map: null
};
const RangePips = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pipStep;
  let pipCount;
  let pipVal;
  let isSelected;
  let inRange;
  let { range = false } = $$props;
  let { min = 0 } = $$props;
  let { max = 100 } = $$props;
  let { step = 1 } = $$props;
  let { values = [(max + min) / 2] } = $$props;
  let { vertical = false } = $$props;
  let { reversed = false } = $$props;
  let { hoverable = true } = $$props;
  let { disabled = false } = $$props;
  let { pipstep = void 0 } = $$props;
  let { all = true } = $$props;
  let { first = void 0 } = $$props;
  let { last = void 0 } = $$props;
  let { rest = void 0 } = $$props;
  let { prefix = "" } = $$props;
  let { suffix = "" } = $$props;
  let { formatter = (v, i, p) => v } = $$props;
  let { focus = void 0 } = $$props;
  let { orientationStart = void 0 } = $$props;
  let { percentOf = void 0 } = $$props;
  let { moveHandle = void 0 } = $$props;
  let { fixFloat = void 0 } = $$props;
  let { normalisedClient: normalisedClient2 = void 0 } = $$props;
  if ($$props.range === void 0 && $$bindings.range && range !== void 0)
    $$bindings.range(range);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.reversed === void 0 && $$bindings.reversed && reversed !== void 0)
    $$bindings.reversed(reversed);
  if ($$props.hoverable === void 0 && $$bindings.hoverable && hoverable !== void 0)
    $$bindings.hoverable(hoverable);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.pipstep === void 0 && $$bindings.pipstep && pipstep !== void 0)
    $$bindings.pipstep(pipstep);
  if ($$props.all === void 0 && $$bindings.all && all !== void 0)
    $$bindings.all(all);
  if ($$props.first === void 0 && $$bindings.first && first !== void 0)
    $$bindings.first(first);
  if ($$props.last === void 0 && $$bindings.last && last !== void 0)
    $$bindings.last(last);
  if ($$props.rest === void 0 && $$bindings.rest && rest !== void 0)
    $$bindings.rest(rest);
  if ($$props.prefix === void 0 && $$bindings.prefix && prefix !== void 0)
    $$bindings.prefix(prefix);
  if ($$props.suffix === void 0 && $$bindings.suffix && suffix !== void 0)
    $$bindings.suffix(suffix);
  if ($$props.formatter === void 0 && $$bindings.formatter && formatter !== void 0)
    $$bindings.formatter(formatter);
  if ($$props.focus === void 0 && $$bindings.focus && focus !== void 0)
    $$bindings.focus(focus);
  if ($$props.orientationStart === void 0 && $$bindings.orientationStart && orientationStart !== void 0)
    $$bindings.orientationStart(orientationStart);
  if ($$props.percentOf === void 0 && $$bindings.percentOf && percentOf !== void 0)
    $$bindings.percentOf(percentOf);
  if ($$props.moveHandle === void 0 && $$bindings.moveHandle && moveHandle !== void 0)
    $$bindings.moveHandle(moveHandle);
  if ($$props.fixFloat === void 0 && $$bindings.fixFloat && fixFloat !== void 0)
    $$bindings.fixFloat(fixFloat);
  if ($$props.normalisedClient === void 0 && $$bindings.normalisedClient && normalisedClient2 !== void 0)
    $$bindings.normalisedClient(normalisedClient2);
  $$result.css.add(css$a);
  pipStep = pipstep || ((max - min) / step >= (vertical ? 50 : 100) ? (max - min) / (vertical ? 10 : 20) : 1);
  pipCount = parseInt((max - min) / (step * pipStep), 10);
  pipVal = function(val) {
    return fixFloat(min + val * step * pipStep);
  };
  isSelected = function(val) {
    return values.some((v) => fixFloat(v) === fixFloat(val));
  };
  inRange = function(val) {
    if (range === "min") {
      return values[0] > val;
    } else if (range === "max") {
      return values[0] < val;
    } else if (range) {
      return values[0] < val && values[1] > val;
    }
  };
  return ` <div class="${[
    "rangePips",
    (disabled ? "disabled" : "") + " " + (hoverable ? "hoverable" : "") + " " + (vertical ? "vertical" : "") + " " + (reversed ? "reversed" : "") + " " + (focus ? "focus" : "")
  ].join(" ").trim()}">${all && first !== false || first ? `<span class="${[
    "pip first",
    (isSelected(min) ? "selected" : "") + " " + (inRange(min) ? "in-range" : "")
  ].join(" ").trim()}" style="${escape(orientationStart, true) + ": 0%;"}">${all === "label" || first === "label" ? `<span class="pipVal">${prefix ? `<span class="pipVal-prefix">${escape(prefix)}</span>` : ``}<!-- HTML_TAG_START -->${formatter(fixFloat(min), 0, 0)}<!-- HTML_TAG_END -->${suffix ? `<span class="pipVal-suffix">${escape(suffix)}</span>` : ``}</span>` : ``}</span>` : ``} ${all && rest !== false || rest ? `${each(Array(pipCount + 1), (_, i) => {
    return `${pipVal(i) !== min && pipVal(i) !== max ? `<span class="${[
      "pip",
      (isSelected(pipVal(i)) ? "selected" : "") + " " + (inRange(pipVal(i)) ? "in-range" : "")
    ].join(" ").trim()}" style="${escape(orientationStart, true) + ": " + escape(percentOf(pipVal(i)), true) + "%;"}">${all === "label" || rest === "label" ? `<span class="pipVal">${prefix ? `<span class="pipVal-prefix">${escape(prefix)}</span>` : ``}<!-- HTML_TAG_START -->${formatter(pipVal(i), i, percentOf(pipVal(i)))}<!-- HTML_TAG_END -->${suffix ? `<span class="pipVal-suffix">${escape(suffix)}</span>` : ``} </span>` : ``} </span>` : ``}`;
  })}` : ``} ${all && last !== false || last ? `<span class="${[
    "pip last",
    (isSelected(max) ? "selected" : "") + " " + (inRange(max) ? "in-range" : "")
  ].join(" ").trim()}" style="${escape(orientationStart, true) + ": 100%;"}">${all === "label" || last === "label" ? `<span class="pipVal">${prefix ? `<span class="pipVal-prefix">${escape(prefix)}</span>` : ``}<!-- HTML_TAG_START -->${formatter(fixFloat(max), pipCount, 100)}<!-- HTML_TAG_END -->${suffix ? `<span class="pipVal-suffix">${escape(suffix)}</span>` : ``}</span>` : ``}</span>` : ``}</div>`;
});
const css$9 = {
  code: '.rangeSlider{--slider:var(--range-slider, #d7dada);--handle-inactive:var(--range-handle-inactive, #99a2a2);--handle:var(--range-handle, #838de7);--handle-focus:var(--range-handle-focus, #4a40d4);--handle-border:var(--range-handle-border, var(--handle));--range-inactive:var(--range-range-inactive, var(--handle-inactive));--range:var(--range-range, var(--handle-focus));--float-inactive:var(--range-float-inactive, var(--handle-inactive));--float:var(--range-float, var(--handle-focus));--float-text:var(--range-float-text, white);position:relative;border-radius:100px;height:0.5em;margin:1em;transition:opacity 0.2s ease;-webkit-user-select:none;-moz-user-select:none;user-select:none}.rangeSlider *{-webkit-user-select:none;-moz-user-select:none;user-select:none}.rangeSlider.pips{margin-bottom:1.8em}.rangeSlider.pip-labels{margin-bottom:2.8em}.rangeSlider.vertical{display:inline-block;border-radius:100px;width:0.5em;min-height:200px}.rangeSlider.vertical.pips{margin-right:1.8em;margin-bottom:1em}.rangeSlider.vertical.pip-labels{margin-right:2.8em;margin-bottom:1em}.rangeSlider .rangeHandle{position:absolute;display:block;height:1.4em;width:1.4em;top:0.25em;bottom:auto;transform:translateY(-50%) translateX(-50%);z-index:2}.rangeSlider.reversed .rangeHandle{transform:translateY(-50%) translateX(50%)}.rangeSlider.vertical .rangeHandle{left:0.25em;top:auto;transform:translateY(50%) translateX(-50%)}.rangeSlider.vertical.reversed .rangeHandle{transform:translateY(-50%) translateX(-50%)}.rangeSlider .rangeNub,.rangeSlider .rangeHandle:before{position:absolute;left:0;top:0;display:block;border-radius:10em;height:100%;width:100%;transition:box-shadow 0.2s ease}.rangeSlider .rangeHandle:before{content:"";left:1px;top:1px;bottom:1px;right:1px;height:auto;width:auto;box-shadow:0 0 0 0px var(--handle-border);opacity:0}.rangeSlider.hoverable:not(.disabled) .rangeHandle:hover:before{box-shadow:0 0 0 8px var(--handle-border);opacity:0.2}.rangeSlider.hoverable:not(.disabled) .rangeHandle.press:before,.rangeSlider.hoverable:not(.disabled) .rangeHandle.press:hover:before{box-shadow:0 0 0 12px var(--handle-border);opacity:0.4}.rangeSlider.range:not(.min):not(.max) .rangeNub{border-radius:10em 10em 10em 1.6em}.rangeSlider.range .rangeHandle:nth-of-type(1) .rangeNub{transform:rotate(-135deg)}.rangeSlider.range .rangeHandle:nth-of-type(2) .rangeNub{transform:rotate(45deg)}.rangeSlider.range.reversed .rangeHandle:nth-of-type(1) .rangeNub{transform:rotate(45deg)}.rangeSlider.range.reversed .rangeHandle:nth-of-type(2) .rangeNub{transform:rotate(-135deg)}.rangeSlider.range.vertical .rangeHandle:nth-of-type(1) .rangeNub{transform:rotate(135deg)}.rangeSlider.range.vertical .rangeHandle:nth-of-type(2) .rangeNub{transform:rotate(-45deg)}.rangeSlider.range.vertical.reversed .rangeHandle:nth-of-type(1) .rangeNub{transform:rotate(-45deg)}.rangeSlider.range.vertical.reversed .rangeHandle:nth-of-type(2) .rangeNub{transform:rotate(135deg)}.rangeSlider .rangeFloat{display:block;position:absolute;left:50%;top:-0.5em;transform:translate(-50%, -100%);text-align:center;opacity:0;pointer-events:none;white-space:nowrap;transition:all 0.2s ease;font-size:0.9em;padding:0.2em 0.4em;border-radius:0.2em}.rangeSlider .rangeHandle.active .rangeFloat,.rangeSlider.hoverable .rangeHandle:hover .rangeFloat{opacity:1;top:-0.2em;transform:translate(-50%, -100%)}.rangeSlider .rangeBar{position:absolute;display:block;transition:background 0.2s ease;border-radius:1em;height:0.5em;top:0;-webkit-user-select:none;-moz-user-select:none;user-select:none;z-index:1}.rangeSlider.vertical .rangeBar{width:0.5em;height:auto}.rangeSlider{background-color:#d7dada;background-color:var(--slider)}.rangeSlider .rangeBar{background-color:#99a2a2;background-color:var(--range-inactive)}.rangeSlider.focus .rangeBar{background-color:#838de7;background-color:var(--range)}.rangeSlider .rangeNub{background-color:#99a2a2;background-color:var(--handle-inactive)}.rangeSlider.focus .rangeNub{background-color:#838de7;background-color:var(--handle)}.rangeSlider .rangeHandle.active .rangeNub{background-color:#4a40d4;background-color:var(--handle-focus)}.rangeSlider .rangeFloat{color:white;color:var(--float-text);background-color:#99a2a2;background-color:var(--float-inactive)}.rangeSlider.focus .rangeFloat{background-color:#4a40d4;background-color:var(--float)}.rangeSlider.disabled{opacity:0.5}.rangeSlider.disabled .rangeNub{background-color:#d7dada;background-color:var(--slider)}',
  map: null
};
function normalisedClient(e) {
  if (e.type.includes("touch")) {
    return e.touches[0] || e.changedTouches[0];
  } else {
    return e;
  }
}
function pureText(possibleHtml) {
  return `${possibleHtml}`.replace(/<[^>]*>/g, "");
}
const RangeSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let percentOf;
  let clampValue;
  let alignValueToStep;
  let orientationStart;
  let orientationEnd;
  let $springPositions, $$unsubscribe_springPositions = noop, $$subscribe_springPositions = () => ($$unsubscribe_springPositions(), $$unsubscribe_springPositions = subscribe(springPositions, ($$value) => $springPositions = $$value), springPositions);
  let { slider = void 0 } = $$props;
  let { range = false } = $$props;
  let { pushy = false } = $$props;
  let { min = 0 } = $$props;
  let { max = 100 } = $$props;
  let { step = 1 } = $$props;
  let { values = [(max + min) / 2] } = $$props;
  let { vertical = false } = $$props;
  let { float = false } = $$props;
  let { reversed = false } = $$props;
  let { hoverable = true } = $$props;
  let { disabled = false } = $$props;
  let { pips = false } = $$props;
  let { pipstep = void 0 } = $$props;
  let { all = void 0 } = $$props;
  let { first = void 0 } = $$props;
  let { last = void 0 } = $$props;
  let { rest = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { prefix = "" } = $$props;
  let { suffix = "" } = $$props;
  let { formatter = (v, i, p) => v } = $$props;
  let { handleFormatter = formatter } = $$props;
  let { ariaLabels = [] } = $$props;
  let { precision = 2 } = $$props;
  let { springValues = { stiffness: 0.15, damping: 0.4 } } = $$props;
  const dispatch = createEventDispatcher();
  let valueLength = 0;
  let focus = false;
  let activeHandle = values.length - 1;
  let startValue;
  let previousValue;
  let springPositions;
  const fixFloat = (v) => parseFloat((+v).toFixed(precision));
  function trimRange(values2) {
    if (range === "min" || range === "max") {
      return values2.slice(0, 1);
    } else if (range) {
      return values2.slice(0, 2);
    } else {
      return values2;
    }
  }
  function moveHandle(index, value) {
    value = alignValueToStep(value);
    if (typeof index === "undefined") {
      index = activeHandle;
    }
    if (range) {
      if (index === 0 && value > values[1]) {
        if (pushy) {
          values[1] = value;
        } else {
          value = values[1];
        }
      } else if (index === 1 && value < values[0]) {
        if (pushy) {
          values[0] = value;
        } else {
          value = values[0];
        }
      }
    }
    if (values[index] !== value) {
      values[index] = value;
    }
    if (previousValue !== value) {
      eChange();
      previousValue = value;
    }
    return value;
  }
  function rangeStart(values2) {
    if (range === "min") {
      return 0;
    } else {
      return values2[0];
    }
  }
  function rangeEnd(values2) {
    if (range === "max") {
      return 0;
    } else if (range === "min") {
      return 100 - values2[0];
    } else {
      return 100 - values2[1];
    }
  }
  function eChange() {
    !disabled && dispatch("change", {
      activeHandle,
      startValue,
      previousValue: typeof previousValue === "undefined" ? startValue : previousValue,
      value: values[activeHandle],
      values: values.map((v) => alignValueToStep(v))
    });
  }
  if ($$props.slider === void 0 && $$bindings.slider && slider !== void 0)
    $$bindings.slider(slider);
  if ($$props.range === void 0 && $$bindings.range && range !== void 0)
    $$bindings.range(range);
  if ($$props.pushy === void 0 && $$bindings.pushy && pushy !== void 0)
    $$bindings.pushy(pushy);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.step === void 0 && $$bindings.step && step !== void 0)
    $$bindings.step(step);
  if ($$props.values === void 0 && $$bindings.values && values !== void 0)
    $$bindings.values(values);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  if ($$props.float === void 0 && $$bindings.float && float !== void 0)
    $$bindings.float(float);
  if ($$props.reversed === void 0 && $$bindings.reversed && reversed !== void 0)
    $$bindings.reversed(reversed);
  if ($$props.hoverable === void 0 && $$bindings.hoverable && hoverable !== void 0)
    $$bindings.hoverable(hoverable);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.pips === void 0 && $$bindings.pips && pips !== void 0)
    $$bindings.pips(pips);
  if ($$props.pipstep === void 0 && $$bindings.pipstep && pipstep !== void 0)
    $$bindings.pipstep(pipstep);
  if ($$props.all === void 0 && $$bindings.all && all !== void 0)
    $$bindings.all(all);
  if ($$props.first === void 0 && $$bindings.first && first !== void 0)
    $$bindings.first(first);
  if ($$props.last === void 0 && $$bindings.last && last !== void 0)
    $$bindings.last(last);
  if ($$props.rest === void 0 && $$bindings.rest && rest !== void 0)
    $$bindings.rest(rest);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.prefix === void 0 && $$bindings.prefix && prefix !== void 0)
    $$bindings.prefix(prefix);
  if ($$props.suffix === void 0 && $$bindings.suffix && suffix !== void 0)
    $$bindings.suffix(suffix);
  if ($$props.formatter === void 0 && $$bindings.formatter && formatter !== void 0)
    $$bindings.formatter(formatter);
  if ($$props.handleFormatter === void 0 && $$bindings.handleFormatter && handleFormatter !== void 0)
    $$bindings.handleFormatter(handleFormatter);
  if ($$props.ariaLabels === void 0 && $$bindings.ariaLabels && ariaLabels !== void 0)
    $$bindings.ariaLabels(ariaLabels);
  if ($$props.precision === void 0 && $$bindings.precision && precision !== void 0)
    $$bindings.precision(precision);
  if ($$props.springValues === void 0 && $$bindings.springValues && springValues !== void 0)
    $$bindings.springValues(springValues);
  $$result.css.add(css$9);
  clampValue = function(val) {
    return val <= min ? min : val >= max ? max : val;
  };
  alignValueToStep = function(val) {
    if (val <= min) {
      return fixFloat(min);
    } else if (val >= max) {
      return fixFloat(max);
    } else {
      val = fixFloat(val);
    }
    let remainder = (val - min) % step;
    let aligned = val - remainder;
    if (Math.abs(remainder) * 2 >= step) {
      aligned += remainder > 0 ? step : -step;
    }
    aligned = clampValue(aligned);
    return fixFloat(aligned);
  };
  percentOf = function(val) {
    let perc = (val - min) / (max - min) * 100;
    if (isNaN(perc) || perc <= 0) {
      return 0;
    } else if (perc >= 100) {
      return 100;
    } else {
      return fixFloat(perc);
    }
  };
  {
    {
      if (!Array.isArray(values)) {
        values = [(max + min) / 2];
        console.error("'values' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)");
      }
      const trimmedAlignedValues = trimRange(values.map((v) => alignValueToStep(v)));
      if (!(values.length === trimmedAlignedValues.length) || !values.every((element, index) => fixFloat(element) === trimmedAlignedValues[index])) {
        values = trimmedAlignedValues;
      }
      if (valueLength !== values.length) {
        $$subscribe_springPositions(springPositions = spring(values.map((v) => percentOf(v)), springValues));
      } else {
        springPositions.set(values.map((v) => percentOf(v)));
      }
      valueLength = values.length;
      if (values.length > 1 && !Array.isArray(ariaLabels)) {
        console.warn(`'ariaLabels' prop should be an Array (https://github.com/simeydotme/svelte-range-slider-pips#slider-props)`);
      }
    }
  }
  orientationStart = vertical ? reversed ? "top" : "bottom" : reversed ? "right" : "left";
  orientationEnd = vertical ? reversed ? "bottom" : "top" : reversed ? "left" : "right";
  $$unsubscribe_springPositions();
  return `    <div${add_attribute("id", id, 0)} role="none" class="${[
    "rangeSlider",
    (range ? "range" : "") + " " + (disabled ? "disabled" : "") + " " + (hoverable ? "hoverable" : "") + " " + (vertical ? "vertical" : "") + " " + (reversed ? "reversed" : "") + "  " + (range === "min" ? "min" : "") + " " + (range === "max" ? "max" : "") + " " + (pips ? "pips" : "") + " " + (all === "label" || first === "label" || last === "label" || rest === "label" ? "pip-labels" : "")
  ].join(" ").trim()}"${add_attribute("this", slider, 0)}>${each(values, (value, index) => {
    return `<span role="slider" class="${[
      "rangeHandle",
      " "
    ].join(" ").trim()}"${add_attribute("data-handle", index, 0)} style="${escape(orientationStart, true) + ": " + escape($springPositions[index], true) + "%; z-index: " + escape(activeHandle === index ? 3 : 2, true) + ";"}"${add_attribute("aria-label", ariaLabels[index], 0)}${add_attribute("aria-valuemin", range === true && index === 1 ? values[0] : min, 0)}${add_attribute("aria-valuemax", range === true && index === 0 ? values[1] : max, 0)}${add_attribute("aria-valuenow", value, 0)} aria-valuetext="${escape(prefix, true) + escape(pureText(handleFormatter(value, index, percentOf(value))), true) + escape(suffix, true)}"${add_attribute("aria-orientation", vertical ? "vertical" : "horizontal", 0)}${add_attribute("aria-disabled", disabled, 0)} ${disabled ? "disabled" : ""}${add_attribute("tabindex", disabled ? -1 : 0, 0)}><span class="rangeNub"></span> ${float ? `<span class="rangeFloat">${prefix ? `<span class="rangeFloat-prefix">${escape(prefix)}</span>` : ``}<!-- HTML_TAG_START -->${handleFormatter(value, index, percentOf(value))}<!-- HTML_TAG_END -->${suffix ? `<span class="rangeFloat-suffix">${escape(suffix)}</span>` : ``} </span>` : ``} </span>`;
  })} ${range ? `<span class="rangeBar" style="${escape(orientationStart, true) + ": " + escape(rangeStart($springPositions), true) + "%; " + escape(orientationEnd, true) + ": " + escape(rangeEnd($springPositions), true) + "%;"}"></span>` : ``} ${pips ? `${validate_component(RangePips, "RangePips").$$render(
    $$result,
    {
      values,
      min,
      max,
      step,
      range,
      vertical,
      reversed,
      orientationStart,
      hoverable,
      disabled,
      all,
      first,
      last,
      rest,
      pipstep,
      prefix,
      suffix,
      formatter,
      focus,
      percentOf,
      moveHandle,
      fixFloat,
      normalisedClient
    },
    {},
    {}
  )}` : ``}</div> `;
});
const css$8 = {
  code: ".time-picker.svelte-132npca{font-size:1.1em;display:flex;align-items:center;width:-moz-fit-content;width:fit-content;border:1px solid rgba(108, 120, 147, 0.3);border-radius:3px;margin:auto;font-variant-numeric:tabular-nums;margin-top:6px}span.svelte-132npca{-webkit-user-select:all;-moz-user-select:all;user-select:all;outline:none;position:relative;z-index:1;padding:4px 0px}span.svelte-132npca:not(:focus)::-moz-selection{background-color:transparent}span.svelte-132npca:not(:focus)::selection{background-color:transparent}span.svelte-132npca:first-child{padding-left:6px}span.svelte-132npca:last-child{padding-right:6px}",
  map: null
};
const TimePicker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { browseDate } = $$props;
  let { timePrecision } = $$props;
  let { setTime } = $$props;
  let fields = [];
  function setText(d) {
    ("00" + d.getHours()).slice(-2);
    ("00" + d.getMinutes()).slice(-2);
    ("00" + d.getSeconds()).slice(-2);
    ("000" + d.getMilliseconds()).slice(-3);
  }
  if ($$props.browseDate === void 0 && $$bindings.browseDate && browseDate !== void 0)
    $$bindings.browseDate(browseDate);
  if ($$props.timePrecision === void 0 && $$bindings.timePrecision && timePrecision !== void 0)
    $$bindings.timePrecision(timePrecision);
  if ($$props.setTime === void 0 && $$bindings.setTime && setTime !== void 0)
    $$bindings.setTime(setTime);
  $$result.css.add(css$8);
  {
    setText(browseDate);
  }
  return `${timePrecision ? `<div class="time-picker svelte-132npca" role="none"><span role="spinbutton" aria-label="Hours" tabindex="0" contenteditable inputmode="numeric" class="svelte-132npca"${add_attribute("this", fields[0], 0)}>${escape(("00" + browseDate.getHours()).slice(-2))}</span>:
		<span role="spinbutton" aria-label="Minutes" tabindex="0" contenteditable inputmode="numeric" class="svelte-132npca"${add_attribute("this", fields[1], 0)}>${escape(("00" + browseDate.getMinutes()).slice(-2))}</span> ${timePrecision !== "minute" ? `:<span role="spinbutton" aria-label="Seconds" tabindex="0" contenteditable inputmode="numeric" class="svelte-132npca"${add_attribute("this", fields[2], 0)}>${escape(("00" + browseDate.getSeconds()).slice(-2))}</span> ${timePrecision !== "second" ? `.<span role="spinbutton" aria-label="Milliseconds" tabindex="0" contenteditable inputmode="numeric" class="svelte-132npca"${add_attribute("this", fields[3], 0)}>${escape(("000" + browseDate.getMilliseconds()).slice(-3))}</span>` : ``}` : ``}</div>` : ``}`;
});
function isLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
function getMonthLength(year, month) {
  const feb = isLeapYear(year) ? 29 : 28;
  const monthLengths = [31, feb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return monthLengths[month];
}
function toText(date, formatTokens) {
  let text = "";
  if (date) {
    for (const token of formatTokens) {
      if (typeof token === "string") {
        text += token;
      } else {
        text += token.toString(date);
      }
    }
  }
  return text;
}
function getMonthDays(year, month) {
  const monthLength = getMonthLength(year, month);
  const days = [];
  for (let i = 0; i < monthLength; i++) {
    days.push({
      year,
      month,
      number: i + 1
    });
  }
  return days;
}
function getCalendarDays(value, weekStartsOn) {
  const year = value.getFullYear();
  const month = value.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  let days = [];
  const daysBefore = (firstWeekday - weekStartsOn + 7) % 7;
  if (daysBefore > 0) {
    let lastMonth = month - 1;
    let lastMonthYear = year;
    if (lastMonth === -1) {
      lastMonth = 11;
      lastMonthYear = year - 1;
    }
    days = getMonthDays(lastMonthYear, lastMonth).slice(-daysBefore);
  }
  days = days.concat(getMonthDays(year, month));
  let nextMonth = month + 1;
  let nextMonthYear = year;
  if (nextMonth === 12) {
    nextMonth = 0;
    nextMonthYear = year + 1;
  }
  const daysAfter = 42 - days.length;
  days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter));
  return days;
}
function getLocaleDefaults() {
  return {
    weekdays: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ],
    weekStartsOn: 1
  };
}
function getInnerLocale(locale = {}) {
  const innerLocale = getLocaleDefaults();
  if (typeof locale.weekStartsOn === "number") {
    innerLocale.weekStartsOn = locale.weekStartsOn;
  }
  if (locale.months)
    innerLocale.months = locale.months;
  if (locale.weekdays)
    innerLocale.weekdays = locale.weekdays;
  return innerLocale;
}
const css$7 = {
  code: ".date-time-picker.svelte-go79cf.svelte-go79cf{display:inline-block;color:var(--date-picker-foreground, #000000);background:var(--date-picker-background, #ffffff);-moz-user-select:none;user-select:none;-webkit-user-select:none;padding:0.5rem;cursor:default;font-size:0.75rem;border:1px solid rgba(103, 113, 137, 0.3);border-radius:3px;box-shadow:0px 2px 6px rgba(0, 0, 0, 0.08), 0px 2px 6px rgba(0, 0, 0, 0.11);outline:none;transition:all 80ms cubic-bezier(0.4, 0, 0.2, 1)}.date-time-picker.svelte-go79cf.svelte-go79cf:focus{border-color:var(--date-picker-highlight-border, #0269f7);box-shadow:0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(2, 105, 247, 0.4))}.tab-container.svelte-go79cf.svelte-go79cf{outline:none}.top.svelte-go79cf.svelte-go79cf{display:flex;justify-content:center;align-items:center;padding-bottom:0.5rem}.dropdown.svelte-go79cf.svelte-go79cf{margin-left:0.25rem;margin-right:0.25rem;position:relative;display:flex}.dropdown.svelte-go79cf svg.svelte-go79cf{position:absolute;right:0px;top:0px;height:100%;width:8px;padding:0rem 0.5rem;pointer-events:none;box-sizing:content-box}.month.svelte-go79cf.svelte-go79cf{flex-grow:1}.year.svelte-go79cf.svelte-go79cf{flex-grow:1}svg.svelte-go79cf.svelte-go79cf{display:block;fill:var(--date-picker-foreground, #000000);opacity:0.75;outline:none}.page-button.svelte-go79cf.svelte-go79cf{background-color:transparent;width:1.5rem;height:1.5rem;flex-shrink:0;border-radius:5px;box-sizing:border-box;border:1px solid transparent;display:flex;align-items:center;justify-content:center}.page-button.svelte-go79cf.svelte-go79cf:hover{background-color:rgba(128, 128, 128, 0.08);border:1px solid rgba(128, 128, 128, 0.08)}.page-button.svelte-go79cf svg.svelte-go79cf{width:0.68rem;height:0.68rem}select.dummy-select.svelte-go79cf.svelte-go79cf{position:absolute;width:100%;pointer-events:none;outline:none;color:var(--date-picker-foreground, #000000);background-color:var(--date-picker-background, #ffffff);border-radius:3px}select.svelte-go79cf:focus+select.dummy-select.svelte-go79cf{border-color:var(--date-picker-highlight-border, #0269f7);box-shadow:0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(2, 105, 247, 0.4))}select.svelte-go79cf.svelte-go79cf:not(.dummy-select){opacity:0}select.svelte-go79cf.svelte-go79cf{font-size:inherit;font-family:inherit;-webkit-appearance:none;-moz-appearance:none;appearance:none;flex-grow:1;padding:0rem 0.35rem;height:1.5rem;padding-right:1.3rem;margin:0px;border:1px solid rgba(108, 120, 147, 0.3);outline:none;transition:all 80ms cubic-bezier(0.4, 0, 0.2, 1);background-image:none}.header.svelte-go79cf.svelte-go79cf{display:flex;font-weight:600;padding-bottom:2px}.header-cell.svelte-go79cf.svelte-go79cf{width:1.875rem;text-align:center;flex-grow:1}.week.svelte-go79cf.svelte-go79cf{display:flex}.cell.svelte-go79cf.svelte-go79cf{display:flex;align-items:center;justify-content:center;width:2rem;height:1.94rem;flex-grow:1;border-radius:5px;box-sizing:border-box;border:2px solid transparent}.cell.svelte-go79cf.svelte-go79cf:hover{border:1px solid rgba(128, 128, 128, 0.08)}.cell.today.svelte-go79cf.svelte-go79cf{font-weight:600;border:2px solid var(--date-picker-today-border, rgba(128, 128, 128, 0.3))}.cell.svelte-go79cf.svelte-go79cf:hover{background-color:rgba(128, 128, 128, 0.08)}.cell.disabled.svelte-go79cf.svelte-go79cf{visibility:hidden}.cell.disabled.svelte-go79cf.svelte-go79cf:hover{border:none;background-color:transparent}.cell.other-month.svelte-go79cf span.svelte-go79cf{opacity:0.4}.cell.selected.svelte-go79cf.svelte-go79cf{color:var(--date-picker-selected-color, inherit);background:var(--date-picker-selected-background, rgba(2, 105, 247, 0.2));border:2px solid var(--date-picker-highlight-border, #0269f7)}",
  map: null
};
function cloneDate(d) {
  return new Date(d.getTime());
}
function clamp(d, min2, max2) {
  if (d > max2) {
    return cloneDate(max2);
  } else if (d < min2) {
    return cloneDate(min2);
  } else {
    return cloneDate(d);
  }
}
function clampDate(d, min2, max2) {
  const limit = clamp(d, min2, max2);
  if (limit.getTime() !== d.getTime()) {
    d = new Date(limit.getFullYear(), limit.getMonth(), limit.getDate(), d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
    d = clamp(d, min2, max2);
  }
  return d;
}
function getYears(min2, max2) {
  let years2 = [];
  for (let i = min2.getFullYear(); i <= max2.getFullYear(); i++) {
    years2.push(i);
  }
  return years2;
}
function dayIsInRange(calendarDay, min2, max2) {
  const date = new Date(calendarDay.year, calendarDay.month, calendarDay.number);
  const minDate = new Date(min2.getFullYear(), min2.getMonth(), min2.getDate());
  const maxDate = new Date(max2.getFullYear(), max2.getMonth(), max2.getDate());
  return date >= minDate && date <= maxDate;
}
const DatePicker = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let iLocale;
  let browseYear;
  let browseMonth;
  let calendarDays;
  createEventDispatcher();
  let { value = null } = $$props;
  function setValue(d) {
    if (d.getTime() !== value?.getTime()) {
      browseDate = clamp(d, min, max);
      value = cloneDate(browseDate);
    }
  }
  function setTime(d) {
    browseDate = clamp(d, min, max);
    if (value) {
      setValue(browseDate);
    }
    return browseDate;
  }
  const todayDate = /* @__PURE__ */ new Date();
  const defaultDate = /* @__PURE__ */ new Date();
  let { timePrecision = null } = $$props;
  let { min = new Date(defaultDate.getFullYear() - 20, 0, 1) } = $$props;
  let { max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999) } = $$props;
  let browseDate = value ? cloneDate(value) : cloneDate(clampDate(defaultDate, min, max));
  function setBrowseDate(value2) {
    if (browseDate.getTime() !== value2?.getTime()) {
      browseDate = value2 ? cloneDate(value2) : browseDate;
    }
  }
  let years = getYears(min, max);
  let { locale = {} } = $$props;
  let { browseWithoutSelecting = false } = $$props;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.timePrecision === void 0 && $$bindings.timePrecision && timePrecision !== void 0)
    $$bindings.timePrecision(timePrecision);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.locale === void 0 && $$bindings.locale && locale !== void 0)
    $$bindings.locale(locale);
  if ($$props.browseWithoutSelecting === void 0 && $$bindings.browseWithoutSelecting && browseWithoutSelecting !== void 0)
    $$bindings.browseWithoutSelecting(browseWithoutSelecting);
  $$result.css.add(css$7);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (value && value > max) {
        setValue(max);
      } else if (value && value < min) {
        setValue(min);
      }
    }
    {
      setBrowseDate(value);
    }
    years = getYears(min, max);
    iLocale = getInnerLocale(locale);
    browseYear = browseDate.getFullYear();
    browseMonth = browseDate.getMonth();
    calendarDays = getCalendarDays(browseDate, iLocale.weekStartsOn);
    $$rendered = `  <div class="date-time-picker svelte-go79cf" tabindex="0"><div class="tab-container svelte-go79cf" tabindex="-1"><div class="top svelte-go79cf"><button type="button" class="page-button svelte-go79cf" tabindex="-1" data-svelte-h="svelte-t4cock"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="svelte-go79cf"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" transform="rotate(180, 12, 12)"></path></svg></button> <div class="dropdown month svelte-go79cf"><select${add_attribute("value", browseMonth, 0)} class="svelte-go79cf">${each(iLocale.months, (monthName, i) => {
      return `<option ${new Date(browseYear, i, getMonthLength(browseYear, i), 23, 59, 59, 999) < min || new Date(browseYear, i) > max ? "disabled" : ""}${add_attribute("value", i, 0)}>${escape(monthName)}</option>`;
    })}</select>  <select class="dummy-select svelte-go79cf" tabindex="-1">${each(iLocale.months, (monthName, i) => {
      return `<option${add_attribute("value", i, 0)} ${i === browseMonth ? "selected" : ""}>${escape(monthName)}</option>`;
    })}</select> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="svelte-go79cf"><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)"></path></svg></div> <div class="dropdown year svelte-go79cf"><select${add_attribute("value", browseYear, 0)} class="svelte-go79cf">${each(years, (v) => {
      return `<option${add_attribute("value", v, 0)}>${escape(v)}</option>`;
    })}</select>  <select class="dummy-select svelte-go79cf" tabindex="-1">${each(years, (v) => {
      return `<option${add_attribute("value", v, 0)} ${v === browseDate.getFullYear() ? "selected" : ""}>${escape(v)}</option>`;
    })}</select> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="svelte-go79cf"><path d="M6 0l12 12-12 12z" transform="rotate(90, 12, 12)"></path></svg></div> <button type="button" class="page-button svelte-go79cf" tabindex="-1" data-svelte-h="svelte-1a006lp"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="svelte-go79cf"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"></path></svg></button></div> <div class="header svelte-go79cf"> ${each(Array(7), (_, i) => {
      return `${i + iLocale.weekStartsOn < 7 ? `<div class="header-cell svelte-go79cf">${escape(iLocale.weekdays[iLocale.weekStartsOn + i])}</div>` : `<div class="header-cell svelte-go79cf">${escape(iLocale.weekdays[iLocale.weekStartsOn + i - 7])}</div>`}`;
    })}</div>  ${each(Array(6), (_, weekIndex) => {
      return `<div class="week svelte-go79cf">${each(calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7), (calendarDay) => {
        return ` <div class="${[
          "cell svelte-go79cf",
          (!dayIsInRange(calendarDay, min, max) ? "disabled" : "") + " " + (value && calendarDay.year === value.getFullYear() && calendarDay.month === value.getMonth() && calendarDay.number === value.getDate() ? "selected" : "") + " " + (calendarDay.year === todayDate.getFullYear() && calendarDay.month === todayDate.getMonth() && calendarDay.number === todayDate.getDate() ? "today" : "") + " " + (calendarDay.month !== browseMonth ? "other-month" : "")
        ].join(" ").trim()}"><span class="svelte-go79cf">${escape(calendarDay.number)}</span> </div>`;
      })} </div>`;
    })} ${validate_component(TimePicker, "TimePicker").$$render(
      $$result,
      { timePrecision, setTime, browseDate },
      {
        browseDate: ($$value) => {
          browseDate = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${slots.default ? slots.default({}) : ``}</div> </div>`;
  } while (!$$settled);
  return $$rendered;
});
function parse(str, tokens, baseDate) {
  let missingPunctuation = "";
  let valid = true;
  baseDate = baseDate || new Date(2020, 0, 1, 0, 0, 0, 0);
  let year = baseDate.getFullYear();
  let month = baseDate.getMonth();
  let day = baseDate.getDate();
  let hours = baseDate.getHours();
  let minutes = baseDate.getMinutes();
  let seconds = baseDate.getSeconds();
  const ms = baseDate.getMilliseconds();
  function parseString(token) {
    for (let i = 0; i < token.length; i++) {
      if (str.startsWith(token[i])) {
        str = str.slice(1);
      } else {
        valid = false;
        if (str.length === 0)
          missingPunctuation = token.slice(i);
        return;
      }
    }
  }
  function parseUint(pattern, min, max) {
    const matches = str.match(pattern);
    if (matches?.[0]) {
      str = str.slice(matches[0].length);
      const n = parseInt(matches[0]);
      if (n > max || n < min) {
        valid = false;
        return null;
      } else {
        return n;
      }
    } else {
      valid = false;
      return null;
    }
  }
  function parseToken(token) {
    if (typeof token === "string") {
      parseString(token);
    } else if (token.id === "yy") {
      const value = parseUint(/^[0-9]{2}/, 0, 99);
      if (value !== null)
        year = 2e3 + value;
    } else if (token.id === "yyyy") {
      const value = parseUint(/^[0-9]{4}/, 0, 9999);
      if (value !== null)
        year = value;
    } else if (token.id === "MM") {
      const value = parseUint(/^[0-9]{2}/, 1, 12);
      if (value !== null)
        month = value - 1;
    } else if (token.id === "dd") {
      const value = parseUint(/^[0-9]{2}/, 1, 31);
      if (value !== null)
        day = value;
    } else if (token.id === "HH") {
      const value = parseUint(/^[0-9]{2}/, 0, 23);
      if (value !== null)
        hours = value;
    } else if (token.id === "mm") {
      const value = parseUint(/^[0-9]{2}/, 0, 59);
      if (value !== null)
        minutes = value;
    } else if (token.id === "ss") {
      const value = parseUint(/^[0-9]{2}/, 0, 59);
      if (value !== null)
        seconds = value;
    }
  }
  for (const token of tokens) {
    parseToken(token);
    if (!valid)
      break;
  }
  const monthLength = getMonthLength(year, month);
  if (day > monthLength) {
    valid = false;
  }
  return {
    date: valid ? new Date(year, month, day, hours, minutes, seconds, ms) : null,
    missingPunctuation
  };
}
function twoDigit(value) {
  return ("0" + value.toString()).slice(-2);
}
const ruleTokens = [
  {
    id: "yyyy",
    toString: (d) => d.getFullYear().toString()
  },
  {
    id: "yy",
    toString: (d) => d.getFullYear().toString().slice(-2)
  },
  {
    id: "MM",
    toString: (d) => twoDigit(d.getMonth() + 1)
  },
  {
    id: "dd",
    toString: (d) => twoDigit(d.getDate())
  },
  {
    id: "HH",
    toString: (d) => twoDigit(d.getHours())
  },
  {
    id: "mm",
    toString: (d) => twoDigit(d.getMinutes())
  },
  {
    id: "ss",
    toString: (d) => twoDigit(d.getSeconds())
  }
];
function parseRule(s) {
  for (const token of ruleTokens) {
    if (s.startsWith(token.id)) {
      return token;
    }
  }
}
function createFormat(s) {
  const tokens = [];
  while (s.length > 0) {
    const token = parseRule(s);
    if (token) {
      tokens.push(token);
      s = s.slice(token.id.length);
    } else if (typeof tokens[tokens.length - 1] === "string") {
      tokens[tokens.length - 1] += s[0];
      s = s.slice(1);
    } else {
      tokens.push(s[0]);
      s = s.slice(1);
    }
  }
  return tokens;
}
const css$6 = {
  code: ".date-time-field.svelte-1vabmef{position:relative}input.svelte-1vabmef{color:var(--date-picker-foreground, #000000);background:var(--date-picker-background, #ffffff);min-width:0px;box-sizing:border-box;padding:4px 6px;margin:0px;border:1px solid rgba(103, 113, 137, 0.3);border-radius:3px;width:var(--date-input-width, 150px);outline:none;transition:all 80ms cubic-bezier(0.4, 0, 0.2, 1)}input.svelte-1vabmef:focus{border-color:var(--date-picker-highlight-border, #0269f7);box-shadow:0px 0px 0px 2px var(--date-picker-highlight-shadow, rgba(2, 105, 247, 0.4))}input.svelte-1vabmef:disabled{opacity:0.5}.invalid.svelte-1vabmef{border:1px solid rgba(249, 47, 114, 0.5);background-color:rgba(249, 47, 114, 0.1)}.invalid.svelte-1vabmef:focus{border-color:#f92f72;box-shadow:0px 0px 0px 2px rgba(249, 47, 114, 0.5)}.picker.svelte-1vabmef{display:none;position:absolute;padding:1px;left:var(--picker-left-position);z-index:10}.picker.above.svelte-1vabmef{bottom:100%}.picker.visible.svelte-1vabmef{display:block}",
  map: null
};
const DateInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $store, $$unsubscribe_store;
  let $innerStore, $$unsubscribe_innerStore;
  createEventDispatcher();
  const defaultDate = /* @__PURE__ */ new Date();
  const innerStore = writable(null);
  $$unsubscribe_innerStore = subscribe(innerStore, (value2) => $innerStore = value2);
  const store = (() => {
    return {
      subscribe: innerStore.subscribe,
      set: (date) => {
        if (date === null || date === void 0) {
          innerStore.set(null);
          value = date;
        } else if (date.getTime() !== $innerStore?.getTime()) {
          innerStore.set(date);
          value = date;
        }
      }
    };
  })();
  $$unsubscribe_store = subscribe(store, (value2) => $store = value2);
  let { value = null } = $$props;
  let { min = new Date(defaultDate.getFullYear() - 20, 0, 1) } = $$props;
  let { max = new Date(defaultDate.getFullYear(), 11, 31, 23, 59, 59, 999) } = $$props;
  let { id = null } = $$props;
  let { placeholder = "2020-12-31 23:00:00" } = $$props;
  let { valid = true } = $$props;
  let { disabled = false } = $$props;
  let { required = false } = $$props;
  let { class: classes = "" } = $$props;
  let { format = "yyyy-MM-dd HH:mm:ss" } = $$props;
  let formatTokens = createFormat(format);
  let { locale = {} } = $$props;
  function valueUpdate(value2, formatTokens2) {
    text = toText(value2, formatTokens2);
  }
  let { text = toText($store, formatTokens) } = $$props;
  function textUpdate(text2, formatTokens2) {
    if (text2.length) {
      const result = parse(text2, formatTokens2, $store);
      if (result.date !== null) {
        valid = true;
        store.set(result.date);
      } else {
        valid = false;
      }
    } else {
      valid = true;
      if (value) {
        value = null;
        store.set(null);
      }
    }
  }
  let { visible = false } = $$props;
  let { closeOnSelection = false } = $$props;
  let { browseWithoutSelecting = false } = $$props;
  let { timePrecision = null } = $$props;
  let { dynamicPositioning = false } = $$props;
  let InputElement;
  let pickerElement;
  let pickerLeftPosition = null;
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.min === void 0 && $$bindings.min && min !== void 0)
    $$bindings.min(min);
  if ($$props.max === void 0 && $$bindings.max && max !== void 0)
    $$bindings.max(max);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.required === void 0 && $$bindings.required && required !== void 0)
    $$bindings.required(required);
  if ($$props.class === void 0 && $$bindings.class && classes !== void 0)
    $$bindings.class(classes);
  if ($$props.format === void 0 && $$bindings.format && format !== void 0)
    $$bindings.format(format);
  if ($$props.locale === void 0 && $$bindings.locale && locale !== void 0)
    $$bindings.locale(locale);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.visible === void 0 && $$bindings.visible && visible !== void 0)
    $$bindings.visible(visible);
  if ($$props.closeOnSelection === void 0 && $$bindings.closeOnSelection && closeOnSelection !== void 0)
    $$bindings.closeOnSelection(closeOnSelection);
  if ($$props.browseWithoutSelecting === void 0 && $$bindings.browseWithoutSelecting && browseWithoutSelecting !== void 0)
    $$bindings.browseWithoutSelecting(browseWithoutSelecting);
  if ($$props.timePrecision === void 0 && $$bindings.timePrecision && timePrecision !== void 0)
    $$bindings.timePrecision(timePrecision);
  if ($$props.dynamicPositioning === void 0 && $$bindings.dynamicPositioning && dynamicPositioning !== void 0)
    $$bindings.dynamicPositioning(dynamicPositioning);
  $$result.css.add(css$6);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      store.set(value);
    }
    formatTokens = createFormat(format);
    {
      valueUpdate($store, formatTokens);
    }
    {
      textUpdate(text, formatTokens);
    }
    $$rendered = ` <div class="${"date-time-field " + escape(classes, true) + " svelte-1vabmef"}"><input type="text"${add_attribute("value", text, 0)}${add_attribute("id", id, 0)}${add_attribute("placeholder", placeholder, 0)} ${disabled ? "disabled" : ""} ${required ? "required" : ""} class="${["svelte-1vabmef", !valid ? "invalid" : ""].join(" ").trim()}"${add_attribute("this", InputElement, 0)}> ${visible && !disabled ? `<div class="${[
      "picker svelte-1vabmef",
      (visible ? "visible" : "") + " "
    ].join(" ").trim()}"${add_styles({
      "--picker-left-position": `${pickerLeftPosition}px`
    })}${add_attribute("this", pickerElement, 0)}>${validate_component(DatePicker, "DateTimePicker").$$render(
      $$result,
      {
        min,
        max,
        locale,
        browseWithoutSelecting,
        timePrecision,
        value: $store
      },
      {
        value: ($$value) => {
          $store = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${slots.default ? slots.default({}) : ``}`;
        }
      }
    )}</div>` : ``} </div>`;
  } while (!$$settled);
  $$unsubscribe_store();
  $$unsubscribe_innerStore();
  return $$rendered;
});
const css$5 = {
  code: ":root{--date-input-width:90px;--date-picker-background:rgba(248, 250, 252, 0.7);--range-slider:hsl(180, 3.9%, 84.9%);--range-handle-inactive:hsl(233, 63%, 54%);--range-handle:hsl(234, 67.6%, 71%);--range-handle-focus:hsl(244.1, 63.2%, 54.1%);--range-handle-border:hsl(234, 67.6%, 71%);--range-range-inactive:hsl(244.1, 62.6%, 53.9%);--range-range:hsl(244.1, 63.2%, 54.1%);--range-float-inactive:hsl(244.1, 62.6%, 53.9%);--range-float:hsl(244.1, 63.2%, 54.1%);--range-float-text:hsl(0, 0%, 100%);--range-pip:hsl(0, 0%, 42%);--range-pip-text:hsl(0, 0%, 38%);--range-pip-active:hsl(180, 25.4%, 24.7%);--range-pip-active-text:hsl(244.1, 62.6%, 53.9%);--range-pip-hover:hsl(180, 25.4%, 24.7%);--range-pip-hover-text:hsl(180, 25.4%, 24.7%);--range-pip-in-range:hsl(180, 25.4%, 24.7%);--range-pip-in-range-text:hsl(180, 25.4%, 24.7%)}.timeslider-class.svelte-qkqnwo.svelte-qkqnwo{width:53%;background-color:rgba(248, 250, 252, 0.7);font-size:12px}.border-start.svelte-qkqnwo.svelte-qkqnwo{border-left:1px solid #ddd}#timeslider.svelte-qkqnwo .border-end.svelte-qkqnwo{border-right:1px solid #ddd;padding:5px}",
  map: null
};
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
const TimeSlider = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedTime_str, $$unsubscribe_selectedTime_str;
  let $selectedDate_str, $$unsubscribe_selectedDate_str;
  $$unsubscribe_selectedTime_str = subscribe(selectedTime_str, (value) => $selectedTime_str = value);
  $$unsubscribe_selectedDate_str = subscribe(selectedDate_str, (value) => $selectedDate_str = value);
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
  DatetoStringFormat(/* @__PURE__ */ new Date());
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
  $$result.css.add(css$5);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if (picker_date) {
        let picker_year = picker_date.getFullYear();
        let picker_month = picker_date.getMonth();
        let picker_getdate = picker_date.getDate();
        let picker_day = picker_date.getDay();
        set_store_value(selectedDate_str, $selectedDate_str = days[picker_day] + " " + months[picker_month] + " " + picker_getdate + " " + picker_year, $selectedDate_str);
        forecastedDate.set(DatetoStringFormat(picker_date));
      }
    }
    $$rendered = `<div class="timeslider-class svelte-qkqnwo"><div id="timeslider" class="flex justify-center items-center svelte-qkqnwo"><div class="flex p-2 border-end border-start svelte-qkqnwo"><div class="text-center"><p class="font-bold text-purple-900 mb-0">${escape($selectedDate_str)}</p> <p class="mb-0">${escape($selectedTime_str)}:00:00</p></div></div> <div class="flex p-2 border-end svelte-qkqnwo"><div class="">${validate_component(DateInput, "DateInput").$$render(
      $$result,
      {
        dynamicPositioning: "true",
        closeOnSelection: true,
        format: "yyyy-MM-dd",
        placeholder: "",
        value: picker_date
      },
      {
        value: ($$value) => {
          picker_date = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div> <div class="basis-1/2" style="width: -webkit-fill-available;"><div class="p-2" style="width: -webkit-fill-available;">${validate_component(RangeSlider, "RangeSlider").$$render(
      $$result,
      {
        id: "time-range",
        formatter: (v) => timeListSlider[v],
        max: timeListSlider.length - 1,
        range: "min",
        suffix: "h",
        pushy: true,
        pips: true,
        all: "label",
        float: true,
        pipstep,
        values
      },
      {
        pipstep: ($$value) => {
          pipstep = $$value;
          $$settled = false;
        },
        values: ($$value) => {
          values = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div></div> <div class="flex p-2 border-end border-start svelte-qkqnwo" data-svelte-h="svelte-3gz9hj"><div class=""><div id="timeslider-btn" class="flex"></div></div></div></div> </div>`;
  } while (!$$settled);
  $$unsubscribe_selectedTime_str();
  $$unsubscribe_selectedDate_str();
  return $$rendered;
});
const css$4 = {
  code: "dialog.svelte-1ao7csy.svelte-1ao7csy{max-width:52em;border:1px solid #929292;border-radius:5px;padding:0}dialog.svelte-1ao7csy.svelte-1ao7csy::backdrop{background:rgba(0, 0, 0, 0.3)}dialog.svelte-1ao7csy>div.svelte-1ao7csy{padding:1.5em}dialog[open].svelte-1ao7csy.svelte-1ao7csy{animation:svelte-1ao7csy-zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)}@keyframes svelte-1ao7csy-zoom{from{transform:scale(0.95)}to{transform:scale(1)}}dialog[open].svelte-1ao7csy.svelte-1ao7csy::backdrop{animation:svelte-1ao7csy-fade 0.2s ease-out}@keyframes svelte-1ao7csy-fade{from{opacity:0}to{opacity:1}}button.svelte-1ao7csy.svelte-1ao7csy{display:block}",
  map: null
};
const Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showModal } = $$props;
  let dialog;
  onDestroy(() => console.log("modal was destroyed!"));
  if ($$props.showModal === void 0 && $$bindings.showModal && showModal !== void 0)
    $$bindings.showModal(showModal);
  $$result.css.add(css$4);
  return ` <dialog class="svelte-1ao7csy"${add_attribute("this", dialog, 0)}> <div class="svelte-1ao7csy"><button class="modal-close-button svelte-1ao7csy" data-svelte-h="svelte-vbf0fn">x</button> ${slots.header ? slots.header({}) : ``} ${slots.default ? slots.default({}) : ``} <br>  </div> </dialog>`;
});
const LayerToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_ShowPollutantSelect;
  let $$unsubscribe_ShowMapSetting;
  let $$unsubscribe_ShowStation;
  let $$unsubscribe_ShowFire;
  let $$unsubscribe_hiddenDrawer;
  $$unsubscribe_ShowPollutantSelect = subscribe(ShowPollutantSelect, (value) => value);
  $$unsubscribe_ShowMapSetting = subscribe(ShowMapSetting, (value) => value);
  $$unsubscribe_ShowStation = subscribe(ShowStation, (value) => value);
  $$unsubscribe_ShowFire = subscribe(ShowFire, (value) => value);
  $$unsubscribe_hiddenDrawer = subscribe(hiddenDrawer, (value) => value);
  $$unsubscribe_ShowPollutantSelect();
  $$unsubscribe_ShowMapSetting();
  $$unsubscribe_ShowStation();
  $$unsubscribe_ShowFire();
  $$unsubscribe_hiddenDrawer();
  return `<div class="detail"><div class="air-quality" data-svelte-h="svelte-1lqf13n"><a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-1.svg" alt=""></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Air</span> Quality</p></a></div> <div class="ground-station" data-svelte-h="svelte-j6j13u"><a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-2.svg" alt=""></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Ground</span> Station</p></a></div> <div class="fire-product" data-svelte-h="svelte-1ph61d1"><a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-3.svg" alt=""></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Fire</span> Product</p></a></div> <div class="statistics-map" data-svelte-h="svelte-9oc9vu"><a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-4.svg" alt=""></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Statistics</span> Report</p></a></div> <div class="base-map" data-svelte-h="svelte-191qql3"><a class="btn-tool d-block"><p class="icon d-flex align-items-center justify-content-center rounded-circle mx-auto"><img class="d-block" src="assets/img/icon/icon-tool-5.svg" alt=""></p> <p class="text d-block text-sm text-center mb-0"><span class="d-block">Base</span> Map</p></a></div> </div>`;
});
const css$3 = {
  code: ".item.svelte-1lbf8na{height:auto}",
  map: null
};
const AirPollutants = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $selectedProduct, $$unsubscribe_selectedProduct;
  let $selectedPollutant, $$unsubscribe_selectedPollutant;
  let $selectedProductLayer, $$unsubscribe_selectedProductLayer;
  let $ShowPollutant, $$unsubscribe_ShowPollutant;
  let $selectOptions, $$unsubscribe_selectOptions;
  $$unsubscribe_selectedProduct = subscribe(selectedProduct, (value) => $selectedProduct = value);
  $$unsubscribe_selectedPollutant = subscribe(selectedPollutant, (value) => $selectedPollutant = value);
  $$unsubscribe_selectedProductLayer = subscribe(selectedProductLayer, (value) => $selectedProductLayer = value);
  $$unsubscribe_ShowPollutant = subscribe(ShowPollutant, (value) => $ShowPollutant = value);
  $$unsubscribe_selectOptions = subscribe(selectOptions, (value) => $selectOptions = value);
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
  if ($$props.hiddenDrawer === void 0 && $$bindings.hiddenDrawer && hiddenDrawer2 !== void 0)
    $$bindings.hiddenDrawer(hiddenDrawer2);
  $$result.css.add(css$3);
  {
    if ($selectedPollutant === "no2") {
      satellite_options = [
        { value: "gems", name: "GEMS" },
        { value: "sentinel5p", name: "Sentinel 5P" }
      ];
      set_store_value(selectOptions, $selectOptions = satellite_options, $selectOptions);
      set_store_value(selectedProduct, $selectedProduct = "gems", $selectedProduct);
    }
  }
  {
    if ($selectedPollutant === "pm25") {
      satellite_options = [
        { value: "geos", name: "GEOS-ML 25x25km" },
        { value: "geos5", name: "GEOS-ML 5x5km" }
      ];
      set_store_value(selectOptions, $selectOptions = satellite_options, $selectOptions);
      set_store_value(selectedProduct, $selectedProduct = "geos5", $selectedProduct);
    }
  }
  {
    if ($selectedPollutant === "pm10") {
      satellite_options = [{ value: "geos", name: "GEOS-ML 25x25km" }];
      set_store_value(selectOptions, $selectOptions = satellite_options, $selectOptions);
      set_store_value(selectedProduct, $selectedProduct = "geos", $selectedProduct);
    }
  }
  {
    if ($selectedProduct !== "") {
      set_store_value(selectedProductLayer, $selectedProductLayer = listProductLayers[$selectedPollutant][$selectedProduct], $selectedProductLayer);
    }
  }
  $$unsubscribe_selectedProduct();
  $$unsubscribe_selectedPollutant();
  $$unsubscribe_selectedProductLayer();
  $$unsubscribe_ShowPollutant();
  $$unsubscribe_selectOptions();
  return `<div class="item svelte-1lbf8na"><div class="info bg-white mb-2 p-15 rounded"><div class="head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100" data-svelte-h="svelte-12x23ds"><p class="text blue-600 text-sm mb-0">Surface PM 2.5 (ugm-3)</p> <p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="/assets/img/icon/head-information.svg" alt=""></p></div> <div class="box__description"><div class="box__color mb-05" data-svelte-h="svelte-a75pea"><div id="legend" class="map-legend"></div></div> <div class="row no-gutters align-items-center"><div class="col-2" data-svelte-h="svelte-1al5iwn"><p class="icon mb-0"><img class="d-block w-100" src="/assets/img/icon/icon-ugm-2.svg" alt=""></p></div> <div class="col"><select id="select2_satellite" class="nice-select wide selectize">${each($selectOptions, (option) => {
    return `<option${add_attribute("value", option.value, 0)}>${escape(option.name)}</option>`;
  })}</select></div></div> </div></div> </div>`;
});
const StationsLayerControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $pcdshow, $$unsubscribe_pcdshow;
  let $selectedStation, $$unsubscribe_selectedStation;
  let $ShowStation, $$unsubscribe_ShowStation;
  $$unsubscribe_pcdshow = subscribe(pcdshow, (value) => $pcdshow = value);
  $$unsubscribe_selectedStation = subscribe(selectedStation, (value) => $selectedStation = value);
  $$unsubscribe_ShowStation = subscribe(ShowStation, (value) => $ShowStation = value);
  set_store_value(selectedStation, $selectedStation = "pcd", $selectedStation);
  set_store_value(ShowStation, $ShowStation = true, $ShowStation);
  setTimeout(
    () => {
      NiceSelect.bind(document.querySelector("#select2-station"));
    },
    100
  );
  {
    if ($selectedStation === "pcd") {
      set_store_value(pcdshow, $pcdshow = true, $pcdshow);
    }
  }
  $$unsubscribe_pcdshow();
  $$unsubscribe_selectedStation();
  $$unsubscribe_ShowStation();
  return `<div class="item"><div class="info bg-white mb-2 p-15 rounded"><div class="head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100" data-svelte-h="svelte-17pg3bs"><p class="text blue-600 text-sm mb-0">Ground Stations</p> <p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="assets/img/icon/head-information.svg" alt=""></p></div> <div class="box__description"><div class="row no-gutters align-items-center"><div class="col-2" data-svelte-h="svelte-glq2g4"><p class="icon mb-0"><img class="d-block w-100" src="assets/img/icon/icon-ugm-3.svg" alt=""></p></div> <div class="col"><select id="select2-station" class="nice-select wide selectize"><option value="pcd" data-svelte-h="svelte-19fdb44">Pollution Control Department</option><option value="aeronet" data-svelte-h="svelte-usgr3e">Aeronet</option><option value="embassy" data-svelte-h="svelte-tzjcwq">Embassy</option></select></div></div></div></div></div>`;
});
const FireLayerControl = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_selectedFire;
  $$unsubscribe_selectedFire = subscribe(selectedFire, (value) => value);
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
  $$unsubscribe_selectedFire();
  return `<div class="item"><div class="info bg-white mb-2 p-15 rounded"><div class="head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100" data-svelte-h="svelte-zptitx"><p class="text blue-600 text-sm mb-0">Fire Product</p> <p class="cursor-pointer icon ms-15 mb-0"><img class="d-block" style="height: 15px;" src="assets/img/icon/head-information.svg" alt=""></p></div> <div class="box__description"><div class="row no-gutters align-items-center"><div class="col-2" data-svelte-h="svelte-1lzl765"><p class="icon mb-0"><img class="d-block w-100" src="assets/img/icon/icon-ugm-1.svg" alt=""></p></div> <div class="col"><select id="select2-fire" class="nice-select wide selectize">${each(fire_options, (option) => {
    return `<option${add_attribute("value", option.value, 0)}>${escape(option.name)}</option>`;
  })}</select></div></div></div></div></div>`;
});
const ToolbarButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["color", "name", "ariaLabel", "size", "href"]);
  const background = getContext("background");
  let { color = "default" } = $$props;
  let { name = void 0 } = $$props;
  let { ariaLabel = void 0 } = $$props;
  let { size = "md" } = $$props;
  let { href = void 0 } = $$props;
  const colors = {
    dark: "text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600",
    gray: "text-gray-500 focus:ring-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-300",
    red: "text-red-500 focus:ring-red-400 hover:bg-red-200 dark:hover:bg-red-800 dark:hover:text-red-300",
    yellow: "text-yellow-500 focus:ring-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 dark:hover:text-yellow-300",
    green: "text-green-500 focus:ring-green-400 hover:bg-green-200 dark:hover:bg-green-800 dark:hover:text-green-300",
    indigo: "text-indigo-500 focus:ring-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 dark:hover:text-indigo-300",
    purple: "text-purple-500 focus:ring-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 dark:hover:text-purple-300",
    pink: "text-pink-500 focus:ring-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800 dark:hover:text-pink-300",
    blue: "text-blue-500 focus:ring-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 dark:hover:text-blue-300",
    primary: "text-primary-500 focus:ring-primary-400 hover:bg-primary-200 dark:hover:bg-primary-800 dark:hover:text-primary-300",
    default: "focus:ring-gray-400"
  };
  const sizing = {
    xs: "m-0.5 rounded-sm focus:ring-1 p-0.5",
    sm: "m-0.5 rounded focus:ring-1 p-0.5",
    md: "m-0.5 rounded-lg focus:ring-2 p-1.5",
    lg: "m-0.5 rounded-lg focus:ring-2 p-2.5"
  };
  let buttonClass;
  const svgSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-5 h-5"
  };
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
    $$bindings.ariaLabel(ariaLabel);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  buttonClass = twMerge(
    "focus:outline-none whitespace-normal",
    sizing[size],
    colors[color],
    color === "default" && (background ? "hover:bg-gray-100 dark:hover:bg-gray-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"),
    $$props.class
  );
  return `${href ? `<a${spread(
    [
      { href: escape_attribute_value(href) },
      escape_object($$restProps),
      {
        class: escape_attribute_value(buttonClass)
      },
      {
        "aria-label": escape_attribute_value(ariaLabel ?? name)
      }
    ],
    {}
  )}>${name ? `<span class="sr-only">${escape(name)}</span>` : ``} ${slots.default ? slots.default({ svgSize: svgSizes[size] }) : ``}</a>` : `<button${spread(
    [
      { type: "button" },
      escape_object($$restProps),
      {
        class: escape_attribute_value(buttonClass)
      },
      {
        "aria-label": escape_attribute_value(ariaLabel ?? name)
      }
    ],
    {}
  )}>${name ? `<span class="sr-only">${escape(name)}</span>` : ``} ${slots.default ? slots.default({ svgSize: svgSizes[size] }) : ``}</button>`} `;
});
const CloseButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["name"]);
  let { name = "Close" } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  return `${validate_component(ToolbarButton, "ToolbarButton").$$render($$result, Object.assign({}, { name }, $$restProps, { class: twMerge("ms-auto", $$props.class) }), {}, {
    default: ({ svgSize }) => {
      return `<svg${add_attribute("class", svgSize, 0)} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;
    }
  })} `;
});
const Drawer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "activateClickOutside",
    "hidden",
    "position",
    "leftOffset",
    "rightOffset",
    "topOffset",
    "bottomOffset",
    "width",
    "backdrop",
    "bgColor",
    "bgOpacity",
    "placement",
    "id",
    "divClass",
    "transitionParams",
    "transitionType"
  ]);
  let { activateClickOutside: activateClickOutside2 = true } = $$props;
  let { hidden = true } = $$props;
  let { position = "fixed" } = $$props;
  let { leftOffset = "inset-y-0 start-0" } = $$props;
  let { rightOffset = "inset-y-0 end-0" } = $$props;
  let { topOffset = "inset-x-0 top-0" } = $$props;
  let { bottomOffset = "inset-x-0 bottom-0" } = $$props;
  let { width = "w-80" } = $$props;
  let { backdrop: backdrop2 = true } = $$props;
  let { bgColor = "bg-gray-900" } = $$props;
  let { bgOpacity = "bg-opacity-75" } = $$props;
  let { placement = "left" } = $$props;
  let { id = "drawer-example" } = $$props;
  let { divClass = "overflow-y-auto z-50 p-4 bg-white dark:bg-gray-800" } = $$props;
  let { transitionParams = {} } = $$props;
  let { transitionType = "fly" } = $$props;
  const placements = {
    left: leftOffset,
    right: rightOffset,
    top: topOffset,
    bottom: bottomOffset
  };
  let backdropDivClass = twMerge("fixed top-0 start-0 z-50 w-full h-full", backdrop2 && bgColor, backdrop2 && bgOpacity);
  if ($$props.activateClickOutside === void 0 && $$bindings.activateClickOutside && activateClickOutside2 !== void 0)
    $$bindings.activateClickOutside(activateClickOutside2);
  if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0)
    $$bindings.hidden(hidden);
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.leftOffset === void 0 && $$bindings.leftOffset && leftOffset !== void 0)
    $$bindings.leftOffset(leftOffset);
  if ($$props.rightOffset === void 0 && $$bindings.rightOffset && rightOffset !== void 0)
    $$bindings.rightOffset(rightOffset);
  if ($$props.topOffset === void 0 && $$bindings.topOffset && topOffset !== void 0)
    $$bindings.topOffset(topOffset);
  if ($$props.bottomOffset === void 0 && $$bindings.bottomOffset && bottomOffset !== void 0)
    $$bindings.bottomOffset(bottomOffset);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.backdrop === void 0 && $$bindings.backdrop && backdrop2 !== void 0)
    $$bindings.backdrop(backdrop2);
  if ($$props.bgColor === void 0 && $$bindings.bgColor && bgColor !== void 0)
    $$bindings.bgColor(bgColor);
  if ($$props.bgOpacity === void 0 && $$bindings.bgOpacity && bgOpacity !== void 0)
    $$bindings.bgOpacity(bgOpacity);
  if ($$props.placement === void 0 && $$bindings.placement && placement !== void 0)
    $$bindings.placement(placement);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.divClass === void 0 && $$bindings.divClass && divClass !== void 0)
    $$bindings.divClass(divClass);
  if ($$props.transitionParams === void 0 && $$bindings.transitionParams && transitionParams !== void 0)
    $$bindings.transitionParams(transitionParams);
  if ($$props.transitionType === void 0 && $$bindings.transitionType && transitionType !== void 0)
    $$bindings.transitionType(transitionType);
  return `${!hidden ? `${backdrop2 && activateClickOutside2 ? `<div role="presentation"${add_attribute("class", backdropDivClass, 0)}></div>` : `${backdrop2 && !activateClickOutside2 ? `<div role="presentation"${add_attribute("class", backdropDivClass, 0)}></div>` : ``}`} <div${spread(
    [
      { id: escape_attribute_value(id) },
      escape_object($$restProps),
      {
        class: escape_attribute_value(twMerge(divClass, width, position, placements[placement], $$props.class))
      },
      { tabindex: "-1" },
      {
        "aria-controls": escape_attribute_value(id)
      },
      {
        "aria-labelledby": escape_attribute_value(id)
      }
    ],
    {}
  )}>${slots.default ? slots.default({ hidden }) : ``}</div>` : ``} `;
});
const ClassicBasemapImg = "/assets/img/classic-basemap.png";
const LightBasemapImg = "/assets/img/light-basemap.png";
const DarkBasemapImg = "/assets/img/dark-basemap.png";
const WindBasemapImg = "/assets/img/wind-basemap.png";
const MapSetting = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_ShowMapSetting;
  let $$unsubscribe_baseMapStyle;
  $$unsubscribe_ShowMapSetting = subscribe(ShowMapSetting, (value) => value);
  $$unsubscribe_baseMapStyle = subscribe(baseMapStyle, (value) => value);
  $$unsubscribe_ShowMapSetting();
  $$unsubscribe_baseMapStyle();
  return `<div id="mapsettingPanel" class="box__info-base-map p-2 rounded"><a class="btn-close border-0 d-flex align-items-center justify-content-center" data-svelte-h="svelte-1fsuvn8"><img class="d-block" src="assets/img/icon/close.svg" alt=""></a> <div class="head border-bottom border-green d-flex align-items-center mb-1 pb-1 w-100" data-svelte-h="svelte-m2t4hp"><p class="icon me-15 mb-0"><img style="height: 25px;" src="assets/img/icon/base-map.svg" alt=""></p> <p class="text blue-600 text-2lg font-bold mb-0">Base Map</p></div> <div class="box__description"><div class="box__overflow pe-1"><div class="list__info"><a class="d-block item mb-1 p-1"><div class="row no-gutters align-items-center"><div class="col-auto"><p class="pic mb-0 me-1"><img class="d-block w-100"${add_attribute("src", LightBasemapImg, 0)} alt=""></p></div> <div class="col" data-svelte-h="svelte-th25ga"><p class="text-sm mb-0">Light</p> <p class="text-xs">Displays a map in light theme</p></div></div></a> <a class="d-block item mb-1 p-1"><div class="row no-gutters align-items-center"><div class="col-auto"><p class="pic mb-0 me-1"><img class="d-block w-100"${add_attribute("src", DarkBasemapImg, 0)} alt=""></p></div> <div class="col" data-svelte-h="svelte-174u9f6"><p class="text-sm mb-0">Dark</p> <p class="text-xs">Displays a map in dark theme</p></div></div></a> <a class="d-block item mb-1 p-1"><div class="row no-gutters align-items-center"><div class="col-auto"><p class="pic mb-0 me-1"><img class="d-block w-100"${add_attribute("src", ClassicBasemapImg, 0)} alt=""></p></div> <div class="col" data-svelte-h="svelte-11gc5uy"><p class="text-sm mb-0">Classic</p> <p class="text-xs">Displays the default road map view</p></div></div></a> <a class="d-block item mb-1 p-1 active"><div class="row no-gutters align-items-center"><div class="col-auto"><p class="pic mb-0 me-1"><img class="d-block w-100"${add_attribute("src", WindBasemapImg, 0)} alt=""></p></div> <div class="col" data-svelte-h="svelte-e8401g"><p class="text-sm mb-0">Wind</p> <p class="text-xs">wind forecast data (6 hourly from NOAA)</p></div></div></a></div></div></div></div>`;
});
const css$2 = {
  code: ".badge.svelte-27zeta{width:40px}.width10.svelte-27zeta{width:10%}.width70.svelte-27zeta{width:70%}.width20.svelte-27zeta{width:10%}",
  map: null
};
let activateClickOutside$1 = false;
let backdrop$1 = false;
const AQIRanking = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_locname;
  let $$unsubscribe_locy;
  let $$unsubscribe_locx;
  let $$unsubscribe_hiddenBottomDrawer;
  let $hiddenDrawer, $$unsubscribe_hiddenDrawer;
  let $selectedTime_str, $$unsubscribe_selectedTime_str;
  let $selectedDate_str, $$unsubscribe_selectedDate_str;
  $$unsubscribe_locname = subscribe(locname, (value) => value);
  $$unsubscribe_locy = subscribe(locy, (value) => value);
  $$unsubscribe_locx = subscribe(locx, (value) => value);
  $$unsubscribe_hiddenBottomDrawer = subscribe(hiddenBottomDrawer, (value) => value);
  $$unsubscribe_hiddenDrawer = subscribe(hiddenDrawer, (value) => $hiddenDrawer = value);
  $$unsubscribe_selectedTime_str = subscribe(selectedTime_str, (value) => $selectedTime_str = value);
  $$unsubscribe_selectedDate_str = subscribe(selectedDate_str, (value) => $selectedDate_str = value);
  let transitionParamsRight = { x: 320, duration: 200, easing: sineIn };
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${validate_component(Drawer, "Drawer").$$render(
      $$result,
      {
        activateClickOutside: activateClickOutside$1,
        backdrop: backdrop$1,
        rightOffset: "top-14 h-screen end-0",
        placement: "right",
        transitionType: "fly",
        transitionParams: transitionParamsRight,
        id: "sidebar6",
        hidden: $hiddenDrawer
      },
      {
        hidden: ($$value) => {
          $hiddenDrawer = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="flex items-center"><h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-800 dark:text-gray-400" data-svelte-h="svelte-1huxu54">
      Mekong PM2.5 Ranking</h5> ${validate_component(CloseButton, "CloseButton").$$render($$result, { class: "mb-4 dark:text-white" }, {}, {})}</div> <p class="text-sm text-gray-500 dark:text-gray-400 float-right">${escape($selectedTime_str)}:00:00</p> <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${escape($selectedDate_str)}</p> <ul class="list-group text-sm"><li class="list-group-item" data-svelte-h="svelte-1okprzs"><div class="d-flex justify-content-start"><div class="p-2 width10  svelte-27zeta">#</div> <div class="p-2 width70 svelte-27zeta">Major city</div> <div class="p-2 width20 svelte-27zeta"></div></div></li> <li class="list-group-item text-xs" data-svelte-h="svelte-3m399m"><div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">234</span></div></div></li> <li class="list-group-item text-xs" data-svelte-h="svelte-hpbjqw"><div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">12</span></div></div></li> <li class="list-group-item text-xs" data-svelte-h="svelte-1eufhda"><div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 flex width70 svelte-27zeta"><div class="mr-1"></div> <div>Laos, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">32</span></div></div></li> <li class="list-group-item text-xs" data-svelte-h="svelte-1wr7g18"><div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">234</span></div></div></li> <li class="list-group-item text-xs" data-svelte-h="svelte-1pczod"><div class="d-flex justify-content-start"><div class="p-2 width10 svelte-27zeta">1</div> <div class="p-2 width70 flex svelte-27zeta"><div class="mr-1"></div> <div>Thailand, Bangkok</div></div> <div class="p-2 width20 svelte-27zeta"><span class="badge rounded-pill bg-success svelte-27zeta">64</span></div></div></li></ul>`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_locname();
  $$unsubscribe_locy();
  $$unsubscribe_locx();
  $$unsubscribe_hiddenBottomDrawer();
  $$unsubscribe_hiddenDrawer();
  $$unsubscribe_selectedTime_str();
  $$unsubscribe_selectedDate_str();
  return $$rendered;
});
const PollutantSelect = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_ShowPollutantSelect;
  let $$unsubscribe_selectedPollutant;
  $$unsubscribe_ShowPollutantSelect = subscribe(ShowPollutantSelect, (value) => value);
  $$unsubscribe_selectedPollutant = subscribe(selectedPollutant, (value) => value);
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
  $$unsubscribe_ShowPollutantSelect();
  $$unsubscribe_selectedPollutant();
  return `<div id="select_air_pollutant" class="box__info-air-quality p-2 rounded"><a class="btn-close border-0 d-flex align-items-center justify-content-center" data-svelte-h="svelte-1w7gzh6"><img class="d-block" src="assets/img/icon/close.svg" alt=""></a> <div class="head border-bottom border-green d-flex align-items-center mb-1 pb-1 w-100" data-svelte-h="svelte-12jx70m"><p class="icon me-15 mb-0"><img style="height: 25px;" src="assets/img/icon/head-air-quality.svg" alt=""></p> <p class="text blue-600 text-2lg font-bold mb-0">Air Pollutant</p></div> <div class="box__description"><p class="blue-600" data-svelte-h="svelte-1cqawmn">Select air pollutant</p> <select class="nice-select wide selectize" id="select-pollutant">${each(options, (option) => {
    return `<option${add_attribute("value", option.value, 0)}>${escape(option.name)}</option>`;
  })}</select></div></div>`;
});
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
const css$1 = {
  code: ".badge.svelte-1925r2e.svelte-1925r2e{width:auto}.badge.svelte-1925r2e p.svelte-1925r2e{font-size:8px}",
  map: null
};
let activateClickOutside = false;
let backdrop = false;
const BottomDrawer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $locx, $$unsubscribe_locx;
  let $locy, $$unsubscribe_locy;
  let $hiddenBottomDrawer, $$unsubscribe_hiddenBottomDrawer;
  let $intializationDate, $$unsubscribe_intializationDate;
  $$unsubscribe_locx = subscribe(locx, (value) => $locx = value);
  $$unsubscribe_locy = subscribe(locy, (value) => $locy = value);
  $$unsubscribe_hiddenBottomDrawer = subscribe(hiddenBottomDrawer, (value) => $hiddenBottomDrawer = value);
  $$unsubscribe_intializationDate = subscribe(intializationDate, (value) => $intializationDate = value);
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
  $$result.css.add(css$1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($hiddenBottomDrawer === false) {
        let coor = $locy.toString() + "," + $locx.toString();
        getChartData2(coor, "Point");
      }
    }
    $$rendered = `${validate_component(Drawer, "Drawer").$$render(
      $$result,
      {
        activateClickOutside,
        backdrop,
        placement: "bottom",
        width: "w-full",
        transitionType: "fly",
        transitionParams: transitionParamsBottom,
        id: "sidebar8",
        class: "shadow-lg",
        hidden: $hiddenBottomDrawer
      },
      {
        hidden: ($$value) => {
          $hiddenBottomDrawer = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="flex items-center"><h5 id="drawer-label" class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400" data-svelte-h="svelte-ntawnk">PM 2.5 forecast of Thailand, Bangkok</h5> ${validate_component(CloseButton, "CloseButton").$$render($$result, { class: "mb-4 dark:text-white" }, {}, {})}</div> <div class="flex justify-between" data-svelte-h="svelte-1eugj9f"><div><p class="max-w-lg mb-6 text-sm text-gray-500 dark:text-gray-400">GEOS Air Quality Forecasts bias-corrected using machine learning algorithm</p></div> <div class="float-right"><div class="flex"><div class="mr-2"><span class="badge rounded-pill bg-success svelte-1925r2e">Min 234
						<p class="svelte-1925r2e">2024-01-01 01:00:00</p></span></div> <div class=""><span class="badge rounded-pill bg-warning svelte-1925r2e">Max 234
						<p class="svelte-1925r2e">2024-01-01 01:00:00</p></span></div></div></div></div> <div class="chart-container" style="position: relative; height:15vh; width:90vw"><canvas id="myChart2"${add_attribute("this", chartCanvasBottom, 0)}></canvas></div>`;
        }
      }
    )}`;
  } while (!$$settled);
  $$unsubscribe_locx();
  $$unsubscribe_locy();
  $$unsubscribe_hiddenBottomDrawer();
  $$unsubscribe_intializationDate();
  return $$rendered;
});
const showChartModal = writable(false);
({
  subscribe: showChartModal.subscribe,
  set: showChartModal.set,
  update: showChartModal.update
});
const css = {
  code: ".dateTime-position.svelte-1mxola6{bottom:20px;z-index:1}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $hiddenDrawer, $$unsubscribe_hiddenDrawer;
  let $drawType, $$unsubscribe_drawType;
  let $drawCoords, $$unsubscribe_drawCoords;
  let $showChartModal, $$unsubscribe_showChartModal;
  let $pcdshow, $$unsubscribe_pcdshow;
  let $forecastedTime, $$unsubscribe_forecastedTime;
  let $forecastedDate, $$unsubscribe_forecastedDate;
  let $intializationDate, $$unsubscribe_intializationDate;
  let $selectedFire, $$unsubscribe_selectedFire;
  let $hiddenBottomDrawer, $$unsubscribe_hiddenBottomDrawer;
  let $ShowPollutantSelect, $$unsubscribe_ShowPollutantSelect;
  let $ShowMapSetting, $$unsubscribe_ShowMapSetting;
  let $ShowPollutant, $$unsubscribe_ShowPollutant;
  let $ShowStation, $$unsubscribe_ShowStation;
  let $ShowFire, $$unsubscribe_ShowFire;
  $$unsubscribe_hiddenDrawer = subscribe(hiddenDrawer, (value) => $hiddenDrawer = value);
  $$unsubscribe_drawType = subscribe(drawType, (value) => $drawType = value);
  $$unsubscribe_drawCoords = subscribe(drawCoords, (value) => $drawCoords = value);
  $$unsubscribe_showChartModal = subscribe(showChartModal, (value) => $showChartModal = value);
  $$unsubscribe_pcdshow = subscribe(pcdshow, (value) => $pcdshow = value);
  $$unsubscribe_forecastedTime = subscribe(forecastedTime, (value) => $forecastedTime = value);
  $$unsubscribe_forecastedDate = subscribe(forecastedDate, (value) => $forecastedDate = value);
  $$unsubscribe_intializationDate = subscribe(intializationDate, (value) => $intializationDate = value);
  $$unsubscribe_selectedFire = subscribe(selectedFire, (value) => $selectedFire = value);
  $$unsubscribe_hiddenBottomDrawer = subscribe(hiddenBottomDrawer, (value) => $hiddenBottomDrawer = value);
  $$unsubscribe_ShowPollutantSelect = subscribe(ShowPollutantSelect, (value) => $ShowPollutantSelect = value);
  $$unsubscribe_ShowMapSetting = subscribe(ShowMapSetting, (value) => $ShowMapSetting = value);
  $$unsubscribe_ShowPollutant = subscribe(ShowPollutant, (value) => $ShowPollutant = value);
  $$unsubscribe_ShowStation = subscribe(ShowStation, (value) => $ShowStation = value);
  $$unsubscribe_ShowFire = subscribe(ShowFire, (value) => $ShowFire = value);
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
        showModal = true;
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
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($pcdshow) {
        getStations();
      }
    }
    {
      if ($showChartModal) {
        showModal = true;
      }
    }
    {
      if ($drawCoords !== "") {
        getChartData($drawCoords, $drawType);
      }
    }
    {
      if (!$hiddenDrawer) {
        document.querySelectorAll("#right-component").forEach((el) => el.style.right = "330px");
        document.querySelectorAll("#timeslider").forEach((el) => el.style.justifyContent = "right");
      }
    }
    {
      if ($hiddenDrawer) {
        document.querySelectorAll("#right-component").forEach((el) => el.style.right = "30px");
        document.querySelectorAll("#timeslider").forEach((el) => el.style.justifyContent = "center");
      }
    }
    $$rendered = `<div id="box__home"><div class="box__info-ugm"><div class="slider">${$ShowPollutant ? `${validate_component(AirPollutants, "AirPollutants").$$render($$result, {}, {}, {})}` : ``} ${$ShowStation ? `${validate_component(StationsLayerControl, "StationsLayerControl").$$render($$result, {}, {}, {})}` : ``} ${$ShowFire ? `${validate_component(FireLayerControl, "FireLayerControl").$$render($$result, {}, {}, {})}` : ``}</div></div> <div id="right-component" class="box__tool bg-white py-2 rounded">${validate_component(LayerToggle, "LayerToggle").$$render($$result, {}, {}, {})} ${$ShowPollutantSelect ? `${validate_component(PollutantSelect, "PollutantSelect").$$render($$result, {}, {}, {})}` : ``} ${$ShowMapSetting ? `${validate_component(MapSetting, "MapSetting").$$render($$result, {}, {}, {})}` : ``}</div>  <div class="box__zoom-map"><a class="btn-plus d-flex align-items-center justify-content-center mb-1" data-svelte-h="svelte-1kv41tv"><img src="assets/img/icon/icon-plus.svg" alt=""></a> <a class="btn-minus d-flex align-items-center justify-content-center" data-svelte-h="svelte-15v47jt"><img src="assets/img/icon/icon-minus.svg" alt=""></a></div> <div class="map overflow-hidden">${validate_component(MapBox, "MapExample").$$render(
      $$result,
      { map },
      {
        map: ($$value) => {
          map = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> <div class="absolute dateTime-position w-full flex justify-center items-stretch svelte-1mxola6">${validate_component(TimeSlider, "TimeSlider").$$render($$result, {}, {}, {})}</div> ${validate_component(AQIRanking, "AqiRanking").$$render(
      $$result,
      { hiddenDrawer: $hiddenDrawer },
      {
        hiddenDrawer: ($$value) => {
          $hiddenDrawer = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(BottomDrawer, "BottomDrawer").$$render(
      $$result,
      { hiddenDrawer: $hiddenBottomDrawer },
      {
        hiddenDrawer: ($$value) => {
          $hiddenBottomDrawer = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<h2 class="font-meduim text-lg text-slate-700 mb-0" data-svelte-h="svelte-bf0pzk">Air quality monitoring</h2>`;
        }
      }
    )} ${validate_component(Modal, "Modal").$$render(
      $$result,
      { showModal },
      {
        showModal: ($$value) => {
          showModal = $$value;
          $$settled = false;
        }
      },
      {
        header: () => {
          return `<h2 slot="header" class="font-meduim text-lg text-slate-700 mb-0" data-svelte-h="svelte-cd3bw0">Air quality monitoring</h2>`;
        },
        default: () => {
          return `<p class="mt-0 font-light text-xs text-slate-500">Location: ${escape($drawCoords)}</p> <div class="chart-container" style="position: relative; height:15vh; width:40vw"><canvas id="myChart"${add_attribute("this", chartCanvas, 0)}></canvas></div>`;
        }
      }
    )} </div>`;
  } while (!$$settled);
  $$unsubscribe_hiddenDrawer();
  $$unsubscribe_drawType();
  $$unsubscribe_drawCoords();
  $$unsubscribe_showChartModal();
  $$unsubscribe_pcdshow();
  $$unsubscribe_forecastedTime();
  $$unsubscribe_forecastedDate();
  $$unsubscribe_intializationDate();
  $$unsubscribe_selectedFire();
  $$unsubscribe_hiddenBottomDrawer();
  $$unsubscribe_ShowPollutantSelect();
  $$unsubscribe_ShowMapSetting();
  $$unsubscribe_ShowPollutant();
  $$unsubscribe_ShowStation();
  $$unsubscribe_ShowFire();
  return $$rendered;
});
export {
  Page as default
};
