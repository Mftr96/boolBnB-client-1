<script>
import store from '../data/store.js';
import axios from 'axios';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppApartmentDetail',

  components: {},

  data() {
    return {
      store,
      apartment: null,
      image: null,
      title: null,
      latitude: null,
      longitude: null,
      coordinateMaps: null,
      rooms: null,
      beds: null,
      bathrooms: null,
      services: null,
    };
  },

  methods: {
    getImage(immagine) {
      if (immagine.startsWith('http')) {
        this.image = immagine;
      } else {
        this.image = `http://127.0.0.1:8000/storage/${immagine}`;
      }
    },
    updateMapCoordinates() {
      const margin = 0.002;
      const lat = parseFloat(this.latitude);
      const lon = parseFloat(this.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        const bbox = `${(lon - margin).toFixed(6)},${(lat - margin).toFixed(
          6
        )},${(lon + margin).toFixed(6)},${(lat + margin).toFixed(6)}`;
        this.coordinateMaps = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        console.log(this.longitude + ' ' + this.latitude + ' ' + bbox);
      } else {
        console.error('Latitudine o Longitudine non valide');
      }
    },
  },

  created() {
    const apartmentId = this.$route.params.id;
    axios
      .get(`http://127.0.0.1:8000/api/apartments/${apartmentId}`)
      .then((response) => {
        console.log(response.data.project);
        this.apartment = response.data.project;
        this.title = this.apartment.title;
        this.latitude = this.apartment.latitude;
        this.longitude = this.apartment.longitude;
        this.rooms = this.apartment.rooms;
        this.beds = this.apartment.beds;
        this.bathrooms = this.apartment.bathrooms;
        this.services = this.apartment.services;
        this.getImage(this.apartment.image);
        this.updateMapCoordinates();
        console.log(this.apartment)
      });
  },
};
</script>

<template>
  <div class="card" style="width: 18rem">
    <img :src="image" class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">
        Stanze:{{ rooms }}
      </p>
      <p class="card-text">
        Posti letto:{{ beds }}
      </p>
      <p class="card-text">
        Bagni:{{ bathrooms }}
      </p>
      <h5>Servizi:</h5>
      <ul>

        <li v-for="servizio in services">
          {{ servizio.name }}
        </li>
      </ul>
    </div>
  </div>

  <iframe width="600" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
    :src="coordinateMaps">
  </iframe>
  <!-- <br />
  <small
    ><a
      href="https://www.openstreetmap.org/?mlat=44.495&mlon=11.325#map=14/44.495/11.325"
      target="_blank"
      >Vedi mappa più grande</a
    ></small
  > -->
</template>

<style scoped></style>
