<template>
    <md-app-content>
      <md-card md-with-hover
                v-for="(feature, index) in allShapes"
                :key="index"
                class="plotmap-card">
        <md-list-item id="index">
          <md-icon class="plotmap-icon">image</md-icon>
          <span class="md-list-item-text">
            <md-ripple>
              <md-card-header>
                <div class="plotmap-title">{{ feature.shape.getGeometry().getType() }}</div>
              </md-card-header>
              <md-card-content class="plotmap-card-content" >Layer: {{feature.layer}}
                <vs-collapse class="plotmap-collapse">
                  <vs-collapse-item>
                     <div slot="header" class="plotmap-collapse-header">Source</div>
                     <vs-textarea id="sourceText" v-model="feature.sourceText"/>
                     <vs-button radius class="plotmap-card-button" color="#ff5252" type="line"
                                  icon="content_copy" @click="selectAllSourceText()" size="large"></vs-button>
                      <vs-button radius class="plotmap-card-button" color="#ff5252" type="line"
                                   icon="done" @click="changeSourceText(index)" size="large"></vs-button>
                  </vs-collapse-item>
                </vs-collapse>
            </md-card-content>
              <md-card-actions class="plotmap-card-actions">
                <vs-button radius class="plotmap-card-button" color="#ff5252" type="line"
                            icon="find_in_page" @click="zoomToShape(index)" size="large"></vs-button>
                <vs-button radius v-if="allShapes[index].visible" class="plotmap-card-button" color="#ff5252" type="line"
                            icon="visibility" @click="changeVisibility(index)" size="large"></vs-button>
                <vs-button radius v-if="!allShapes[index].visible" class="plotmap-card-button" color="#ff5252" type="line"
                            icon="visibility_off" @click="changeVisibility(index)" size="large"></vs-button>
                <vs-button radius class="plotmap-card-button" color="#ff5252" type="line"
                icon="delete" @click="removeSelectedFeature(index)" size="large"></vs-button>
              </md-card-actions>
            </md-ripple>
          </span>
          </md-list-item>
      </md-card>
    </md-app-content>
</template>


<script>
import mapStore from "../../store/mapStore";
import pastedDataProcessor from "../../services/pastedDataProcessor";

export default {
  name: 'ShapesList',
  data: function(){
    return {
      allShapes: []
    }
  },
  mounted(){
    this.allShapes = mapStore.state.allShapes;
  },

  methods: {
    removeSelectedFeature(index) {
      let selectedFeature = this.allShapes[index];
      mapStore.dispatch('actionRemoveFeature', selectedFeature)
    },

    changeVisibility(index) {
      let selectedFeature = this.allShapes[index];
      mapStore.dispatch('actionToggleFeatureVisibility', selectedFeature);
    },

    selectAllSourceText() {
      const textarea = document.getElementById("sourceText");
      textarea.select();
      document.execCommand("Copy");
    },

    zoomToShape(index) {
      mapStore.dispatch('actionResetFeaturesStyle');
      mapStore.dispatch('actionZoomToShape', index);
    },

    changeSourceText(index) {
     const sourceText = document.getElementById("sourceText").value;
     mapStore.dispatch('actionRemoveFeature', this.allShapes[index]);
     pastedDataProcessor.handlePasteEvent(sourceText, this);
    }
  }
}
</script>

<style src="./shapesScrollableList.css"></style>
