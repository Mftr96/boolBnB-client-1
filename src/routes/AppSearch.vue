<script>
import store from '../data/store.js';
import { RouterLink } from 'vue-router';
import AppSearchFilters from '../components/AppSearchFilters.vue';

export default {
  name: 'AppSearch',

  components: {
    AppSearchFilters,
  },

  data() {
    return {
      store,
    };
  },

  methods: {
    getImage(immagine) {
      if (immagine.startsWith('http')) {
        return immagine;
      } else {
        return `http://127.0.0.1:8000/storage/${immagine}`;
      }
    },
    apartmentDetail(appartamento) {
      this.store.apartmentDetail = appartamento;
      console.log(this.store.apartmentDetail);
    },
  },

  mounted() {
    // console.log(store.searchApartment);
  },
};
</script>

<template>
  <AppSearchFilters />
  <div class="card-container">
    <div
      v-for="(apartment, i) in store.searchApartment"
      class="card"
      style="width: 18rem"
    >
      <img :src="getImage(apartment.image)" class="card-img-top" alt="..." />
      <div class="card-body">
        <h5 class="card-title">{{ apartment.title }}</h5>
        <p class="card-text">Stanze:{{ apartment.rooms }}</p>
        <p class="card-text">Posti letto:{{ apartment.beds }}</p>
        <p class="card-text">Bagni:{{ apartment.bathrooms }}</p>

        <router-link
          :to="`/search/${apartment.id}`"
          @click="apartmentDetail(apartment)"
          class="btn btn-primary"
        >
          Dettagli appartamento
        </router-link>
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
