import GeoJSON from 'ol/format/GeoJSON';
import WKT from 'ol/format/WKT';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import snackbar from "../store/snackbar";
import mapStore from "../store/mapStore"

export default {
  handlePasteEvent(inputData, vueComponent) {
    if(this.isXML(inputData)) {
        this.processAsAIXM(inputData, vueComponent);
    } else {
      let succeedGeojson = this.processAsGeojson(inputData);
      if(!succeedGeojson) {
        let succeedWKT = this.processAsWKT(inputData);
        if(!succeedWKT) {
          this.showSnackbar("JSON / GeoJSON / WKT / AIXM format requested !");
        }
      }
    }
  },

  processAsGeojson(inputData) {
    let geojson;
    try{
      geojson = this.readGeoJSONGeometry(inputData);
    } catch(error){
        try {
          geojson = this.readGeoJSONFeatures(inputData);
        } catch(error) {
          geojson = this.readFromJson(inputData);
        }
    }
    if(geojson !== null) {
      this.addToMap(geojson, 'geojson', inputData);
      return true;
    }
    return false;
  },

  processAsWKT(inputData) {
    let wkt;
    try{
      wkt = this.readWKTGeometry(inputData);
      console.log(wkt);
    } catch(error){
        try {
          wkt = this.readWKTFeature(inputData);
        } catch(error) {
          return false;
        }
    }
    this.addToMap(wkt, 'wkt', inputData);
    return true;
  },

  readWKTFeature(inputData) {
    return new WKT().readFeatures(inputData);
  },

  readWKTGeometry(inputData) {
    let geometries = new WKT().readGeometry(inputData).getGeometries();
    let features = this.encapsulateIntoFeatures(geometries);
    return features;
  },

  encapsulateIntoFeatures(geometries) {
    const features = [];
    geometries.forEach(geometry => {
      const feature = new Feature({
        geometry: geometry
      });
      features.push(feature);
    });
    return features;
  },

  readGeoJSONGeometry(inputData) {
    let geometries = new GeoJSON().readGeometry(inputData).getGeometries();
    return this.encapsulateIntoFeatures(geometries);
  },

  readGeoJSONFeatures(inputData) {
    return new GeoJSON().readFeatures(inputData);
  },

  readFromJson(inputData) {
    let geometries = this.extractGeometriesFromJson(inputData);
    if(geometries.length == 0 ) return null;
    return geometries
  },

  showSnackbar(message) {
    snackbar.dispatch('actionShowSnackbar', message);
  },

  isGeojsonGeometry(inputData) {
    try {
      const geometry = new GeoJSON().readGeometry(inputData);
      return geometry instanceof Geometry;
    } catch(error) {
      return false;
    }
  },

  isJson(inputData) {
    try {
      if(typeof inputData === 'string' || inputData instanceof String) {
          return JSON.parse(inputData);
      }
      return JSON.parse(JSON.stringify(inputData));
    } catch(error){
      return null;
    }
  },

  extractGeometriesFromJson(inputData) {
    if(this.isGeojsonGeometry(inputData)) {
      return [new GeoJSON().readFeature(inputData)];
    }
    let jsonObject = this.isJson(inputData);
    if(! jsonObject) {
      return [];
    }
    let geojsonGeometries = [];

    if(Array.isArray(jsonObject)) {
      jsonObject.forEach(obj => {
        let currentGeometries = this.extractGeometriesFromJson(obj);
        geojsonGeometries = [...geojsonGeometries, ...currentGeometries];
      });
      return geojsonGeometries;
    }
    for(let key of Object.keys(jsonObject)) {
      let currentGeometries = this.extractGeometriesFromJson(jsonObject[key]);
      geojsonGeometries = [...geojsonGeometries, ...currentGeometries];
    }
    return geojsonGeometries;
  },

  addToMap(features, layerId, inputData) {
    mapStore.dispatch('actionAddFeature', {
            features: features,
            layerId: layerId,
            inputData: inputData
          });
    mapStore.dispatch('actionZoomToShape', mapStore.getters.indexLastAddedShape);
  },

  isXML(inputData) {
    if(inputData.search("<?xml version") != -1 || inputData.search("www.aixm.aero/schema/5.1/message") != -1) {
      return true;
    } else {
      return false;
    }
  },

  processAsAIXM(inputData, vueComponent) {
    this.startLoadingEffect(vueComponent);
    fetch('http://10.17.3.209:30028/convertToJson', {
      method: 'POST',
      headers: {
        "Content-Type": "text/xml"
      },
      body: inputData,
      }).then(res => res.json().then(data => {
        let geometries = this.readFromJson(data);
        this.addToMap(geometries, 'aixm', inputData);
      })).then( () => this.endLoadingEffect(vueComponent));
  },

  startLoadingEffect(vueComponent) {
    vueComponent.$vs.loading({color: "#1565c0"});
  },

  endLoadingEffect(vueComponent) {
    vueComponent.$vs.loading.close();
  }
}
