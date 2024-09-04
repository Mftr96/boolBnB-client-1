<script >
import axios from 'axios';
import store from './data/store.js';
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
export default {
  name:"app",

components: {
  AppHeader,

},

data() {

  return {
    store,

  }

},

methods: {

},

mounted() {

}

}

</script>

<template>
  <AppHeader></AppHeader>
  <router-view></router-view>

</template>

<style scoped>
</style>
