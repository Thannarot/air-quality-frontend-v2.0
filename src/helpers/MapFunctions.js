/// GOOGLE MAP  ADD MAP TYPE /////////
export function getMapType(type, eeMapURL) {
    let eeMapOptions = {
        getTileUrl: function (tile, zoom) {
            var url = eeMapURL.replace('{x}', tile.x)
                                .replace('{y}', tile.y)
                                .replace('{z}', zoom);
            return url;
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        opacity: 1
    };
    let mapType = new google.maps.ImageMapType(eeMapOptions);
    return mapType;
    };

export function loadMap(map, mapType) {
    console.log("load")
    map.overlayMapTypes.push(mapType);
};

export function getWMSMap(URL) {
    const getTileUrl = (tile, zoom) => {
        return (
        "/wms/mk_aqx/geos/20240208.nc?" +
        "&REQUEST=GetMap&SERVICE=WMS&VERSION=1.3.0" +
        "&LAYERS=BC_MLPM25&transparent=true" +
        "&time=2024-02-09T13%3A30%3A00.000Z&colorscalerange=0%2C100&abovemaxcolor=extend&belowmincolor=extend"+
        "&FORMAT=image%2Fpng&styles=boxfill%2Fpm25" +
        "&crs=EPSG%3A3857&WIDTH=256&HEIGHT=256" +
        "&BBOX=" +
        xyzToBounds(tile.x, tile.y, zoom).join(",")
        );
    };
    const mapType = new google.maps.ImageMapType({
        getTileUrl: getTileUrl,
        name: "WMS",
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        minZoom: 0,
        maxZoom: 19,
        opacity: 0.5
    });
    return mapType;
};

const EXTENT = [-Math.PI * 6378137, Math.PI * 6378137];

export function xyzToBounds(x, y, z) {
    const tileSize = EXTENT[1] * 2 / Math.pow(2, z);
    const minx = EXTENT[0] + x * tileSize;
    const maxx = EXTENT[0] + (x + 1) * tileSize;
    // remember y origin starts at top
    const miny = EXTENT[1] - (y + 1) * tileSize;
    const maxy = EXTENT[1] - y * tileSize;
    return [minx, miny, maxx, maxy];
}


/// MAPBOX ADD MAP SOURCE /////////
export function addMapSource(map) {
    map.addSource('wms-source', {
        'type': 'raster',
        'tiles': [
            // tileURL
            "/wms/ServirData/geos/20240123.nc?service=WMS&request=GetMap&layers=BC_MLPM25&styles=boxfill%2Fpm25&format=image%2Fpng&transparent=true&version=1.3.0&time=2024-01-23T16%3A30%3A00.000Z&colorscalerange=0%2C100&abovemaxcolor=extend&belowmincolor=extend&width=256&height=256&crs=EPSG:3857&bbox={bbox-epsg-3857}"
        ],
        'tileSize': 256
        });
    map.addLayer(
    {
    'id': 'wms-layer',
    'type': 'raster',
    'source': 'wms-source',
    'paint': {}
    },
    'building' // Place layer under labels, roads and buildings.
    );
    map.setPaintProperty(
        'wms-layer', 'raster-opacity', 0.6
    );
}

export function clearLayer(map, id) {
    if (map.getLayer(id)) {
        map.removeLayer(id);
    }
}

export function clearSource(map, id) {
    if (map.getSource(id)) {
        map.removeSource(id);
    }
}

export function createMarker(map, mapboxgl, data) {

    clearLayer(map, 'station-point');
    clearLayer(map, 'marker-text');
    clearSource(map, 'station-data');

    map.addSource('station-data', {
        type: 'geojson',
        data: data,
        cluster: false,
    });
    map.addLayer({
        id: 'station-point',
        type: 'circle',
        source: 'station-data',
        paint: {
            'circle-color': ['get', 'color_class'],
            'circle-radius': 10,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    
    map.addLayer({
        id: 'marker-text',
        type: 'symbol',
        source: 'station-data',
        layout: {
        'text-field': ['get', 'pm25'],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
        }
    });
    map.setLayerZoomRange('station-point', 2, 22);
    map.setLayerZoomRange('marker-text', 2, 22);

    map.on('click', 'station-point', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        console.log(
            e.features[0].properties.name

        )
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                '<div class="point-popup-val">' +
                e.features[0].properties.name +
                // '<span id="open-statistic-button"  style="float: right; cursor: pointer;">' +
                // '<i class="fa fa-signal mr-2 text-sm from-purple-600 to-blue-500 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent" aria-hidden="true"></i>' +
                // '</span>'+ 
                '</div>')
            .addTo(map);

    });

    map.on('mouseenter', 'clusters', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
        map.getCanvas().style.cursor = '';
    });

}


export function createFeatureCollection(data) {
    var geojson = {
        "type":"FeatureCollection",
        "features":[]
    };
    for(var i = 0; i< data.length; i++){
        var id =  data[i]["rid"];
        let stationsID = data[i]["station_id"];
        let latest_data= data[i]["latest_data"];
        let lon = data[i]["lon"];
        let lat = data[i]["lat"];
        let pm25 = data[i]["pm25"];
        let name = data[i]["name"];
        let aqi = data[i]["aqi"];
        let aqi_level = data[i]["aqi_level"];
        let color_class = '#000000'
        if(pm25 > 80){
            color_class = '#DE544D';
        }else if ( pm25 <= 80 && pm25 >60) {
            color_class = '#F2A63B';
        }
        else if ( pm25 <= 60 && pm25 > 40) {
            color_class = '#FFFF54';
        }
        else if ( pm25 <= 40 && pm25 > 20) {
            color_class = '#9FCE62';
        }
        else if ( pm25 <= 20) {
            color_class = '#6ACAFA';
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
        }
        geojson.features.push({ 
            "type": "Feature",
            "properties": properties, 
            "geometry": {
                "type": "Point",
                "coordinates": [lon, lat]
            } 
        });
    }

    return geojson
}

export function getEventObject(map) {
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

export function resetWind(map, windy, timeout) {
    const obj = getEventObject(map);
    const { zoomLevel, north, south, west, east, width, height } = obj;
    mapcanvas.style.display = 'none';

    if (windy) {
        windy.stop();
    }

    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(function () {
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
        mapcanvas.style.display = 'initial';
        mapcanvas.width = width;
        mapcanvas.height = height;
        windy.start(
            [
                [0, 0],
                [width, height]
            ],
            width,
            height,
            [
                [west, south],
                [east, north]
            ],
            { particleLineWidth: particleWidth, zoomLevel: zoomLevel}
        );
    }, 500);
}

