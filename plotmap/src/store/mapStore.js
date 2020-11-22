import Vuex from "vuex";
import Vue from "vue";
import 'ol/ol.css';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import BackgroundConfig from "../config/backgroundConfig";
import StyleConfig from "../config/styleConfig";
import Style from 'ol/style/Style';
import View from 'ol/View';
import {get as getProjection} from 'ol/proj';
import {fromLonLat} from 'ol/proj';

Vue.use(Vuex);

const mapStore = new Vuex.Store({
  state: {
    map: null,
    allShapes: []
  },

  actions: {
    actionLoadMap(context, map) {
      context.commit('loadMap', map);
    },
    actionChangeBackground(context, backgroundId) {
      context.commit('changeBackground', backgroundId);
    },
    actionAddFeature(context, payload) {
      context.commit('addFeature', payload);
    },
    actionRemoveFeature(context, payload) {
      context.commit('removeFeature', payload);
    },
    actionUpdateSize(context) {
      context.commit('updateSize');
    },
    actionToggleFeatureVisibility(context, payload) {
      context.commit('toggleFeatureVisibility', payload);
    },
    actionToggleLayerVisibility(context, payload) {
      context.commit('toggleLayerVisibility', payload);
    },
    actionChangeMapProjection(context, projectionCode) {
      context.commit('changeMapProjection', projectionCode);
    },
    actionMapRefresh(context) {
      context.commit('mapRefresh');
    },
    actionResetFeaturesStyle(context) {
      context.commit('resetFeaturesStyle');
    },
    actionZoomToShape(context, index) {
      context.commit('zoomToShape', index);
    }
  },

  mutations: {
    loadMap(state, map){
      state.map = map;
    },

    changeBackground(state, backgroundId) {
      if(backgroundId >= 0 && backgroundId < BackgroundConfig.backgrounds.length) {
        let baseLayer = state.map.getLayers().getArray().find(layer => layer.get('id') === 'base');
        state.map.removeLayer(baseLayer);

        let background = BackgroundConfig.backgrounds[backgroundId];
        const backgroundLayer =  new TileLayer({
          source: new XYZ({
            url: background.url
          })
        });
        backgroundLayer.set('id', 'base');
        state.map.addLayer(backgroundLayer);
      }
    },

    addFeature(state, payload) {
      let correspondingLayer = state.map.getLayers().getArray().find(layer => layer.get('id') === payload.layerId);
      payload.features.forEach(feature => {
        feature.setGeometry(feature.getGeometry().transform("EPSG:4326",state.map.getView().getProjection().getCode()));
        feature.setId(state.allShapes.length);
        state.allShapes.push({shape: feature, visible: true, layer: payload.layerId, sourceText: payload.inputData});
        correspondingLayer.getSource().addFeature(feature);
      });
    },

    removeFeature(state, featureToRemove) {
      state.map.getLayers().getArray().forEach( layer => {
        if(layer.get('id') !== 'base') {
          const searchedFeature = layer.getSource().getFeatureById(featureToRemove.shape.getId());
          if(searchedFeature) {
            layer.getSource().removeFeature(featureToRemove.shape);
            const indexToRemoveFrom = state.allShapes.indexOf(featureToRemove);
            state.allShapes.splice(indexToRemoveFrom, 1);
          }
        }
      });
    },

    toggleFeatureVisibility(state, feature) {
      state.map.getLayers().getArray().forEach( layer => {
        if(layer.get('id') !== 'base') {
          const searchedFeature = layer.getSource().getFeatureById(feature.shape.getId());
          if(searchedFeature) {
            if(feature.visible) {
              searchedFeature.setStyle(new Style(null));
            } else {
              searchedFeature.setStyle(null);
            }
            feature.visible = !feature.visible;
          }
        }
      });
    },

    toggleLayerVisibility(state, payload) {
      let correspondingLayer = state.map.getLayers().getArray().find(layer => layer.get('id') === payload.layerId);
      correspondingLayer.setVisible(payload.visibilityState);
    },

    changeMapProjection(state, projectionCode) {
      const newProjection = getProjection(projectionCode);
      let currentProjection = state.map.getView().getProjection().getCode();
      let lengthControlArray = state.map.getControls().getArray().length;
      state.map.getControls().getArray()[lengthControlArray-1].setProjection(newProjection);
      let initialCoordinate = state.map.getView().getCenter();

      state.map.setView(new View({
        projection: newProjection,
        center: fromLonLat(initialCoordinate, newProjection),
        zoom: 5
      }));
      state.allShapes.forEach( shapeObject  => {
          shapeObject.shape.setGeometry(shapeObject.shape.getGeometry().transform(currentProjection, projectionCode));
      });
    },

    mapRefresh(state) {
      setTimeout( () => state.map.updateSize(), 200);
   },

   resetFeaturesStyle(state) {
     state.allShapes.forEach( feature=> {
       feature.shape.setStyle();
     });
   },

   zoomToShape(state, index) {
     state.map.getView().fit(state.allShapes[index].shape.getGeometry());
     let zoomLevel = state.map.getView().getZoom();
     if(state.allShapes[index].shape.getGeometry().getType() === 'Point') {
       state.map.getView().setZoom(zoomLevel - 15);
     } else {
       state.map.getView().setZoom(zoomLevel - 1);
     }
     state.allShapes[index].shape.setStyle(StyleConfig.zoomStyle);
   }
 },

 getters: {
   indexLastAddedShape: state => {
     return state.allShapes.length - 1;
   }
 }
});

export default mapStore
