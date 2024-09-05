<script>
import store from '../data/store.js';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppSearch',

  components: {},

  data() {
    return {
      store,
    };
  },

  methods: {},

  mounted() {
    console.log(store.searchApartment);
  },
};
</script>

<template>
  <div class="card-container">
    <div
      v-for="(apartment, i) in store.searchApartment"
      class="card"
      style="width: 18rem"
    >
      <img src="..." class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">{{ apartment.title }}</h5>
        <p class="card-text">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  width: 100%;
  display: flex;
}
</style>
