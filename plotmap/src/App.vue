<template>
   <md-app class="plotmap-app">
     <md-app-toolbar class="md-primary" md-elevation="0" :md-right="alignRight">
       <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
         <md-icon>menu</md-icon>
       </md-button>
       <span class="md-title">PlotMap</span>
       <span class="toolbar-text"><Settings/></span>
     </md-app-toolbar>
     <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini" class="md-scrollbar">
       <md-toolbar class="md-transparent" md-elevation="0">
         <span class="drawer-text">My shapes</span>
         <div class="md-toolbar-section-end">
           <md-button class="md-icon-button md-dense" @click="toggleMenu">
             <md-icon>keyboard_arrow_left</md-icon>
           </md-button>
         </div>
       </md-toolbar>
       <md-divider></md-divider>
       <md-list>
          <ShapesList/>
       </md-list>
     </md-app-drawer>
     <md-app-content>
       <MapGeometries/>
       <Snackbar/>
    </md-app-content>
   </md-app>
</template>

<script>
import MapGeometries from "./components/map/map.vue";
import Settings from "./components/settings/settings.vue";
import pastedDataProcessor from "./services/pastedDataProcessor";
import Snackbar from "./components/snackbar/snackbar.vue";
import ShapesList from "./components/shapesScrollableList/shapesScrollableList.vue";
import snackbar from "./store/snackbar";
import mapStore from "./store/mapStore";

export default {
  name: "App",

  components: {
    MapGeometries,
    Settings,
    Snackbar,
    ShapesList,
  },

  data: () => ({
    menuVisible: false,
    alignRight: true
  }),
  mounted() {
    document.body.addEventListener("paste", this.handlerPastedInput, false);
    document.body.addEventListener("click", this.handlerCTRLClick, false);
    mapStore.dispatch('actionMapRefresh');
  },

  methods: {
    handlerPastedInput(event) {
      event.preventDefault();
      let pastedData = event.clipboardData.getData('text/plain');
      pastedDataProcessor.handlePasteEvent(pastedData, this);
    },
    handlerCTRLClick(event) {
      if (event.ctrlKey) {
        const divElement = document.getElementById("mouse-position");
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(divElement);
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand("Copy");
        snackbar.dispatch('actionShowSnackbar', "Coordinates succesfully copied !");
      }
    },
    toggleMenu () {
      this.menuVisible = !this.menuVisible;
      mapStore.dispatch('actionResetFeaturesStyle');
      mapStore.dispatch('actionMapRefresh');
    },

  }
};
</script>

<style src="./app.css"></style>
