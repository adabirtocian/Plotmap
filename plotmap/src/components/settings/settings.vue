<template>
  <div class="flex-container">
    <div><label>GeoJSON layer</label></div>
    <div>
      <vs-switch v-model="geojsonLayerVisible" color="#ff5252" @change="setLayerVisibility('geojson')">
      <span slot="on">On</span>
      <span slot="off">Off</span>
      </vs-switch>
    </div>
    <div><label>WKT layer</label></div>
    <div>
      <vs-switch v-model="wktLayerVisible" color="#ff5252" @change="setLayerVisibility('wkt')">
        <span slot="on">On</span>
        <span slot="off">Off</span>
      </vs-switch>
    </div>
    <div><label>AIXM layer</label></div>
    <div>
      <vs-switch v-model="aixmLayerVisible" color="#ff5252" @change="setLayerVisibility('aixm')">
      <span slot="on">On</span>
      <span slot="off">Off</span>
      </vs-switch>
    </div>
    <div class="plotmap-menu">
      <md-menu md-size="small" md-align-trigger>
            <md-button class="plotmap-button" md-menu-trigger>
              <md-icon>burst_mode</md-icon>
              <label class="plotmap-label">{{ this.currentProjection }}</label>
            </md-button>
            <md-menu-content>
              <md-menu-item class="plotmap-menu-item" id="EPSG:3857" @click="changeMapProjection($event)">EPSG:3857 (default)</md-menu-item>
              <md-menu-item class="plotmap-menu-item" id="EPSG:4326" @click="changeMapProjection($event)">EPSG:4326</md-menu-item>
              <md-menu-item class="plotmap-menu-item" id="EPSG:21781" @click="changeMapProjection($event)">EPSG:21781</md-menu-item>
              <md-menu-item class="plotmap-menu-item" id="EPSG:5588" @click="changeMapProjection($event)">EPSG:5588</md-menu-item>
            </md-menu-content>
      </md-menu>
    </div>
    <div>
      <md-menu md-size="small" md-align-trigger>
            <md-button class="plotmap-button" md-menu-trigger>
              <md-icon>wallpaper</md-icon>
            </md-button>

            <md-menu-content>
              <md-menu-item class="plotmap-menu-item" id="0" @click="changeBackground($event)">Light
                  <md-icon>wb_sunny</md-icon>
              </md-menu-item>
              <md-menu-item class="plotmap-menu-item" id="1" @click="changeBackground($event)">Light with labels
              </md-menu-item>
              <md-menu-item class="plotmap-menu-item" id="2" @click="changeBackground($event)">Dark
                <md-icon>nights_stay</md-icon>
              </md-menu-item>
              <md-menu-item class="plotmap-menu-item" id="3" @click="changeBackground($event)">Dark with labels</md-menu-item>
              <md-menu-item class="plotmap-menu-item" id="4" @click="changeBackground($event)">Wikimedia</md-menu-item>
            </md-menu-content>
      </md-menu>
    </div>
  </div>
</template>

<script>
import mapStore from "../../store/mapStore";

  export default {
    name: 'settings',
    data: function() {
      return {
        geojsonLayerVisible: true,
        wktLayerVisible: true,
        aixmLayerVisible: true,
        currentProjection: 'EPSG:3857'
      }
    },

    methods: {
        changeBackground(event) {
          let backgroundId = event.currentTarget.id;
          mapStore.dispatch('actionChangeBackground', backgroundId);
        },

        setLayerVisibility(layerId) {
          mapStore.dispatch('actionToggleLayerVisibility', {
            layerId: layerId,
            visibilityState: layerId === 'wkt' ? this.wktLayerVisible : (layerId === 'geojson' ? this.geojsonLayerVisible : this.aixmLayerVisible)
          });
        },

        changeMapProjection(event) {
          let projectionCode = event.currentTarget.id;
          this.currentProjection = projectionCode;
          mapStore.dispatch('actionChangeMapProjection', projectionCode);
        }
    }

  };


</script>

<style src="./settings.css"></style>
