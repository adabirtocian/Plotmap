import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

const snackbar = new Vuex.Store({
  state: {
    showSnackbar: false,
    position: 'center',
    duration: 4000,
    isInfinity: false,
    message: ''
  },

  actions: {
    actionShowSnackbar(context, message) {
      context.commit('showSnackbar', message);
    },
    actionHideSnackbar(context) {
      context.commit('hideSnackbar');
    },
    actionUpdateIsActive(context, value){
      context.commit('updateIsActive', value);
    }
  },

  mutations: {
    showSnackbar(state, message) {
      state.showSnackbar = true;
      state.message = message;
    },
    hideSnackbar(state) {
      state.showSnackbar = false;
    },
    updateIsActive(state, value) {
      state.showSnackbar = value;
    }
  }
});

export default snackbar
