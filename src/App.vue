<script>
import axios from 'axios';
import store from './data/store.js';
import { RouterView } from 'vue-router';
export default {
  name: 'app',

  components: {},

  data() {
    return {
      store,
    };
  },

  methods: {},

  mounted() {},
};
</script>

<template>
  <router-view></router-view>
</template>

<style scoped></style>
