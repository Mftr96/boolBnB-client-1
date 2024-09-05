<script>
import store from '../data/store.js';
import { RouterLink } from 'vue-router';

export default {
  name: '',

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
  <div class="Div1">
    <h2>Appartamenti suggeriti</h2>
  </div>
  <div class="Div2">
    <h2>Città più in voga</h2>
  </div>
  <div class="Div3">
    <h2>Ultimi appartamenti inseriti</h2>
  </div>
</template>

<style scoped>
.Div1 {
  width: calc(100% - 2rem);
  height: 15rem;
  margin: 1rem;
  background-color: rgb(178, 255, 241);
  border-radius: 2rem;
  text-align: center;
}
.Div2 {
  width: calc(100% - 2rem);
  height: 15rem;
  margin: 1rem;
  background-color: rgb(190, 255, 178);
  border-radius: 2rem;
  text-align: center;
}
.Div3 {
  width: calc(100% - 2rem);
  height: 15rem;
  margin: 1rem;
  background-color: rgb(255, 175, 175);
  border-radius: 2rem;
  text-align: center;
}
</style>
