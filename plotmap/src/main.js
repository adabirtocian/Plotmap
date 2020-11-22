import Vue from "vue";
import App from "./App.vue";
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import mapStore from "./store/mapStore.js";
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css' //Vuesax styles

Vue.use(VueMaterial);
Vue.use(Vuesax, {
  theme:{
    colors:{
      primary:'#ff5252',
      success:'rgb(23, 201, 100)',
      danger:'rgb(242, 19, 93)',
      warning:'rgb(255, 130, 0)',
      dark:'rgb(36, 33, 69)'
    }
  }
});

Vue.config.productionTip = false;
window.name = 'PlotMap';

new Vue({
  mapStore,
  render: h => h(App)
}).$mount("#app");
