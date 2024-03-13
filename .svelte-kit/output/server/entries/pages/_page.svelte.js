import { w as writable, c as create_ssr_component, s as subscribe, a as setContext, b as add_attribute, d as set_store_value, e as escape, v as validate_component, D as DateInput, R as RangeSlider, o as onDestroy, f as each, g as Drawer, C as CloseButton, h as sineIn } from "../../chunks/vendor.js";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import qs from "qs";
import Chart from "chart.js/auto";
import "@mapbox/mapbox-gl-draw";
import "d3";
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
