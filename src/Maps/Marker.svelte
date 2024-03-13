<script>
    import { onMount, getContext } from 'svelte'
    import { contextKey } from '../Maps/mapbox'
    import { Marker } from "mapbox-gl";
  
    const { getMap } = getContext(contextKey)
    const map = getMap()

  
    function randomColour () {
      return Math.round(Math.random() * 255)
    }
  
    function move (lng, lat) {
      marker.setLngLat({ lng, lat })
    }
  
    export let lat
    export let lng
    export let label = 'Marker'
    export let popupClassName = 'beyonk-mapbox-popup'
    export let markerOffset = [ 0, 0 ]
    export let popupOffset = 10
    export let color = randomColour()
    export let popup = true
    export let popupOptions = {}
    export let markerOptions = {}
  
    let marker
    let element
    let elementPopup
  
    $: marker && move(lng, lat)
  
    onMount(() => {
      const namedParams = Object.assign(
        {
          offset: markerOffset
        },
        element.hasChildNodes() ? { element } : { color }
      )
      marker = new Marker(Object.assign(namedParams, markerOptions))
    
      if (popup) {
        const namedPopupParams = { offset: popupOffset, className: popupClassName }
        const popupEl = new Popup(Object.assign(namedPopupParams, popupOptions))
        if (elementPopup.hasChildNodes()) {
          popupEl.setDOMContent(elementPopup)
        } else {
          popupEl.setText(label)
        }
  
        marker.setPopup(popupEl)
      }
  
      marker
        .setLngLat({ lng, lat })
        .addTo(map)
  
      if (!element.hasChildNodes()) element.remove()
  
      return () => marker.remove()
    })
  
    export function getMarker () {
      return marker
    }
  </script>
  
  <div bind:this={element}>
  <slot></slot>
  </div>
  
  <div class='popup' bind:this={elementPopup}>
    <slot name="popup"></slot>
  </div>
  