<template>
  <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent
                class="plotmap-snackbar">
      <span> {{ message }}</span>
      <md-button class="md-primary" @click="updateState()">OK</md-button>
  </md-snackbar>
</template>

<script>
import snackbar from "../../store/snackbar";

export default {
  name: 'Snackbar',
  computed: {
    duration() {
      return snackbar.state.duration;
    },
    isInfinity() {
      return snackbar.state.isInfinity;
    },
    position() {
      return snackbar.state.position;
    },
    message() {
      return snackbar.state.message;
    },
    showSnackbar: {
      get() {
        return snackbar.state.showSnackbar;
      },
      set(newValue) {
        snackbar.dispatch('actionUpdateIsActive', newValue);
      }
    }
  },

  methods: {
    updateState(newValue) {
      this.showSnackbar = newValue;
    }
  }

}
</script>
<style src="./snackbar.css"></style>
