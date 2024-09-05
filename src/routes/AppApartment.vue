<script>
import store from '../data/store.js';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppApartment',

  components: {},

  data() {
    return {
      store,
      coordinateMaps: `https://maps.google.com/maps?q=${store.apartmentDetail.latitude},${store.apartmentDetail.longitude}&hl=es&z=14&amp;output=embed`,
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
  },

  mounted() {},
};
</script>

<template>
  <div class="card" style="width: 18rem">
    <img
      :src="getImage(store.apartmentDetail.image)"
      class="card-img-top"
      alt="..."
    />
    <div class="card-body">
      <h5 class="card-title">{{ store.apartmentDetail.title }}</h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </p>
    </div>
  </div>

  <iframe
    width="300"
    height="170"
    frameborder="0"
    scrolling="no"
    marginheight="0"
    marginwidth="0"
    :src="coordinateMaps"
  >
  </iframe>
  <br />
  <small>
    <a
      href="https://maps.google.com/maps?q='+data.lat+','+data.lon+'&hl=es;z=14&amp;output=embed"
      style="color: #0000ff; text-align: left"
      target="_blank"
    >
      See map bigger
    </a>
  </small>
</template>

<style scoped></style>
