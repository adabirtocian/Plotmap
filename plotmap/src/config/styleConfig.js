import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
export default {
  styles : {
    'Point': new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({color: 'lightblue'}),
        stroke: new Stroke({color: 'blue', width: 1})
      })
    }),
    'LineString': new Style({
      stroke: new Stroke({
        color: 'green',
        width: 2,
      }),
    }),
    'MultiLineString': new Style({
      stroke: new Stroke({
        color: 'green',
        width: 2,
      }),
    }),
    'MultiPoint': new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({color: 'lightblue'}),
        stroke: new Stroke({color: 'blue', width: 1})
      })
    }),
    'MultiPolygon': new Style({
      stroke: new Stroke({
        color: 'yellow',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.1)',
      }),
    }),
    'Polygon': new Style({
      stroke: new Stroke({
        color: 'blue',
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 255, 0.1)',
      }),
    }),
    'Circle': new Style({
      stroke: new Stroke({
        color: 'red',
        width: 2,
      }),
      fill: new Fill({
        color: 'rgba(255,0,0,0.2)',
      }),
    }),
  },

  zoomStyle: new Style({
    fill: new Fill({
      color: 'rgba(255,0,0,0.3)',
    }),
    stroke: new Stroke({
      color: 'rgba(255,0,0,0.3)',
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      fill: new Fill({color: 'rgba(255,0,0,0.3)'}),
      stroke: new Stroke({color: 'red', width: 1})
    })
  })
};
