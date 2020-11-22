<template>
  <div id="map">
    <vs-alert title="Coordinates (ctrl+click to copy)" active="true" class="plotmap-alert">
      <div id="mouse-position"></div>
    </vs-alert>
    <div id="popup" title="Layer"></div>
  </div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MousePosition from 'ol/control/MousePosition';
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls} from 'ol/control';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import StyleConfig from "../../config/styleConfig";
import mapStore from "../../store/mapStore";
import ProjectionConfig from "../../config/projectionConfig";
import {fromLonLat} from 'ol/proj';

export default {
  name: "MapGeometries",

  data: function(){
    return {
      map: null
    }
  },
  methods: {
    registerAvailableProjections() {
      ProjectionConfig.projections.forEach( projection => {
        proj4.defs(projection.name, projection.source);
        register(proj4);
      });
    }
  },
  mounted() {
    let styleFunction = function (feature) {
      return StyleConfig.styles[feature.getGeometry().getType()];
    };

    const baseLayer =  new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'
      })
    });

    const geojsonLayer = new VectorLayer({
      source:  new VectorSource(),
      style: styleFunction
    });

    const wktLayer = new VectorLayer({
      source:  new VectorSource(),
      style: styleFunction
    });

    const aixmLayer = new VectorLayer({
      source:  new VectorSource(),
      style: styleFunction
    });

    baseLayer.set('id', 'base');
    geojsonLayer.set('id', 'geojson');
    wktLayer.set('id', 'wkt');
    aixmLayer.set('id', 'aixm');
    geojsonLayer.setZIndex(6);
    wktLayer.setZIndex(6);
    aixmLayer.setZIndex(6);

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:3857',
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;',
    });
    let center = [0, 0];
    this.map = new Map({
          target: 'map',
          controls: defaultControls().extend([mousePositionControl]),
          layers: [baseLayer, geojsonLayer, wktLayer, aixmLayer],
          view: new View({
            center: fromLonLat(center, 'EPSG:3857'),
            zoom: 5,
            projection: 'EPSG:3857'
          })
    });
    this.registerAvailableProjections();
    mapStore.dispatch('actionLoadMap', this.map);
  }
}
</script>

<style src="./map.css"></style>
