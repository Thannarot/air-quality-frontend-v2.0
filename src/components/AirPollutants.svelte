<script>
  import { onMount } from "svelte";
  import {
    selectedProduct,
    selectedPollutant,
    ShowPollutant,
    selectOptions,
    selectedProductLayer,
  } from "../stores/app";
  import { getLegend } from "../helpers/app";

  // set selected product, pm2.5 geos is a default
  selectedProduct.set("geos5km");
  selectedPollutant.set("pm25");
  selectedProductLayer.set("BC_DNN_PM25");

  $ShowPollutant = true;
  let instance;

  let pollutants = {
    no2: "Nitrogen dioxide (µgm <sup>-3</sup>)",
    pm25: "Surface PM 2.5 (µgm <sup>-3</sup>)",
  };

  let legends = {
    no2: {
      colors: [
        "#FDFDFD",
        "#CBE4BD",
        "#A1CF79",
        "#D2E749",
        "#EFF92A",
        "#FBD937",
        "#D46074",
        "#CA3688",
        "#AE4D93",
        "#A475D4",
      ],
      range: [0, 3],
      trick: [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0],
    },
    pm25: {
      colors: [
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
        "#FDECC7",
      ],
      range: [0, 300],
      trick: [0, 50, 100, 150, 200, 250, 300],
    },
  };

  let satellite_options = [];
  let listProductLayers = {
    pm25: {
      geos5km: "DS_BC_DNN_PM25",
      geos25km: "BC_DNN_PM25",
    },
    no2: {
      gems: "ColumnAmountNO2Trop",
    },
  };

  setTimeout(() => {
    instance = NiceSelect.bind(document.querySelector("#select2_satellite"));
  }, 10);

  $: if ($selectedPollutant === "no2") {
    satellite_options = [{ value: "gems", name: "GEMS" }];
    $selectOptions = satellite_options;
    $selectedProduct = "gems";

    setTimeout(() => {
      instance.update();
    }, 10);
  }

  $: if ($selectedPollutant === "pm25") {
    satellite_options = [
      { value: "geos25km", name: "GEOS-ML 25x25km" },
      { value: "geos5km", name: "GEOS-ML 5x5km" },
    ];
    $selectOptions = satellite_options;
    $selectedProduct = "geos5km";
    setTimeout(() => {
      instance.update();
    }, 10);
  }

  $: if ($selectedPollutant !== "") {
    setTimeout(() => {
      document.querySelector("#pollutant_name").innerHTML =
        pollutants[$selectedPollutant];

      // clear legend div
      document.querySelector("#legend").innerHTML = "";
      let colorPalettes = legends[$selectedPollutant]["colors"];
      let trickValues = legends[$selectedPollutant]["trick"];
      let valueRange = legends[$selectedPollutant]["range"];
      // create legend based on the selected pollutant
      getLegend(colorPalettes, trickValues, valueRange, "#legend");
    }, 50);
  }

  $: if ($selectedProduct !== "") {
    $selectedProductLayer =
      listProductLayers[$selectedPollutant][$selectedProduct];
  }
</script>

<div class="item">
  <div class="info bg-white mb-2 p-15 rounded">
    <div
      class="head border-bottom border-green d-flex align-items-center justify-content-between mb-1 pb-05 w-100"
    >
      <p id="pollutant_name" class="text blue-600 text-sm mb-0"></p>
      <p class="cursor-pointer icon ms-15 mb-0">
        <img
          class="d-block"
          style="height: 15px;"
          src="/assets/img/icon/head-information.svg"
          alt=""
        />
      </p>
    </div>
    <div class="box__description">
      <div class="box__color mb-05">
        <div id="legend" class="map-legend"></div>
      </div>

      <div class="row no-gutters align-items-center">
        <div class="col-2">
          <p class="icon mb-0">
            <img
              class="d-block w-100"
              src="/assets/img/icon/icon-ugm-2.svg"
              alt=""
            />
          </p>
        </div>
        <div class="col" id="selectDiv">
          <select
            id="select2_satellite"
            class="nice-select wide selectize"
            bind:value={$selectedProduct}
          >
            {#each $selectOptions as option}
              <option value={option.value}>{option.name}</option>
            {/each}
          </select>
        </div>
      </div>
      <!-- <div on:click={closePollutantPanel} class="overlay-panel-close"><CloseSolid/></div> -->
    </div>
  </div>
</div>

<style>
  .item {
    height: auto;
  }
</style>
