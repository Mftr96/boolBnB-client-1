<script>
import store from '../data/store.js';
import { RouterLink } from 'vue-router';
import AppSearchFilters from '../components/AppSearchFilters.vue';
import axios from 'axios';
import Appfooter from '../components/Appfooter.vue';

export default {
  name: 'AppSearch',

  components: {
    AppSearchFilters,
    Appfooter,
  },

  data() {
    return {
      store,
      stanze: 'Camere',
      letti: 'Posti letto',
      bagni: 'Bagni',
      isApartment: false,
      isLoading: false,
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
    getRightWords(parola, appartamento) {
      if (parola == 'Camere' && appartamento == 1) {
        return 'Camera';
      } else if (parola == 'Camere') {
        return parola;
      }
      if (parola == 'Posti letto' && appartamento == 1) {
        return 'Posto letto';
      } else if (parola == 'Posti letto') {
        return parola;
      }
      if (parola == 'Bagni' && appartamento == 1) {
        return 'Bagno';
      } else if (parola == 'Bagni') {
        return parola;
      }
    },
    getServizio(id) {
      return this.store.servizi_bnb[id - 1];
    },
    apartmentSponsorship(sponsorships) {
      let isSponsored = false;
      const now = new Date();
      if (sponsorships.length == 0) {
        return false;
      }
      const endDate = new Date(sponsorships[sponsorships.length - 1].pivot.ending_date);
      if (endDate > now) {
        isSponsored = true;
      }
      return isSponsored;
    },
  },

  watch: {
    'store.searchApartment'() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
  },
  mounted() {
    if (this.$route.query.latitude && this.$route.query.longitude) {
      const url = `http://127.0.0.1:8000/api/search?latitude=${this.$route.query.latitude}&longitude=${this.$route.query.longitude}&radius=${this.$route.query.radius}&beds=${this.$route.query.beds}&rooms=${this.$route.query.rooms}&services=${this.$route.query.services}`;

      this.store.noApartment = false;

      axios
        .get(url)
        .then((response) => {
          this.store.searchApartment = response.data.results;
          if (response.data.results.length > 0) {
            this.isApartment = true;
          } else {
            this.isApartment = false;
          }
          console.log(this.isApartment);
        })
        .catch((error) => {
          console.log('errore');
        });
    }
  },
};
</script>

<template>
  <div class="height">
    <AppSearchFilters />
    <div class="container" :class="{ 'opacity-zero': isLoading }">
      <h4 v-show="isApartment" class="">Trovati {{ store.searchApartment.length }} appartamenti:</h4>
      <div class="enter d-flex flex-column align-items-center">
        <div v-show="store.noApartment" class="cerca-appartamento">
          <div class="home-animation">
            <svg class="ha-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
              <path
                class="house"
                d="M1.9 8.5V5.3h-1l4-4.3 2.2 
         2.1v-.6h1v1.7l1 1.1H7.9v3.2z"
              />
              <path
                class="circut"
                d="M5 8.5V4m0 3.5l1.6-1.6V4.3M5 
         6.3L3.5 4.9v-.6m2.7.7l.4.4L7 
         5M5.9 6.1v.5h.5M4.2 5v.5h-.8m1 
         1.5v.6h-.6m1.2.8L3.6 6.7M5 
         8.4l1-.9h.7M4.6 3.6L5 4l.4-.4"
              />
              <g>
                <circle cx="5.5" cy="3.4" r="0.21" />
                <circle cx="4.5" cy="3.4" r="0.21" />
                <circle cx="6.6" cy="4.1" r="0.21" />
                <circle cx="3.5" cy="4.1" r="0.21" />
                <circle cx="4.2" cy="4.8" r="0.21" />
                <circle cx="6.1" cy="4.8" r="0.21" />
                <circle cx="7.1" cy="4.8" r="0.21" />
                <circle cx="6.6" cy="6.6" r="0.21" />
                <circle cx="5.9" cy="5.9" r="0.21" />
                <circle cx="3.2" cy="5.5" r="0.21" />
                <circle cx="3.5" cy="6.5" r="0.21" />
                <circle cx="4.4" cy="6.8" r="0.21" />
                <circle cx="3.6" cy="7.6" r="0.21" />
                <circle cx="6.9" cy="7.5" r="0.21" />
              </g>
            </svg>
          </div>
          Inizia la ricerca per trovare un appartamento su misura
        </div>
      </div>
      <div class="row g-4 flex-wrap">
        <div v-for="(apartment, i) in store.searchApartment" class="col-12 col-md-6 col-lg-4 col-xxl-3">
          <router-link :to="`/search/${apartment.title}`" class="card h-100">
            <img :src="getImage(apartment.image)" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">{{ apartment.title }}</h5>
              <div class="row">
                <div class="col-6 dettagli">
                  <p class="">
                    <i class="fas fa-door-open"></i> {{ apartment.rooms }}
                    {{ getRightWords(stanze, apartment.rooms) }}
                  </p>
                  <p class="">
                    <i class="fas fa-bed"></i> {{ apartment.beds }}
                    {{ getRightWords(letti, apartment.beds) }}
                  </p>
                  <p class="">
                    <i class="fas fa-bath"></i> {{ apartment.bathrooms }}
                    {{ getRightWords(bagni, apartment.bathrooms) }}
                  </p>
                </div>
                <div class="col-6 d-flex flex-column align-items-center">
                  <div><i class="fa-solid fa-location-dot location"></i></div>
                  {{ apartment.distance.toFixed(2) }} Km dal centro
                </div>
              </div>
              <hr />
              <div v-show="apartmentSponsorship(apartment.sponsorships)" class="badge animation fs-4">
                <i class="fa-solid fa-rocket"></i>
                <div class="rocket-trail"></div>
              </div>
              <h6>Servizi</h6>
              <div class="servizi row">
                <div v-for="(servizio, i) in apartment.services.slice(0, 4)" class="col-6 servizio">
                  <div class="center">
                    <span v-html="getServizio(servizio.id).icon"></span>
                    <span class="nome-servizio">{{ getServizio(servizio.id).title }}</span>
                  </div>
                </div>
                <div v-if="apartment.services.length > 5" class="altri-servizi col">
                  <div>altri {{ apartment.services.length - 4 }} servizi</div>
                </div>
                <div v-if="apartment.services.length == 5" class="altri-servizi col">
                  <!-- <div>un altro servizio</div> -->
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <Appfooter />
    <div v-show="isLoading" class="loading-screen" :class="{ 'loading-show': isLoading }">
      <svg class="ha-logo loading" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
        <path
          class="house"
          d="M1.9 8.5V5.3h-1l4-4.3 2.2 
       2.1v-.6h1v1.7l1 1.1H7.9v3.2z"
        />
        <path
          class="circut"
          d="M5 8.5V4m0 3.5l1.6-1.6V4.3M5 
       6.3L3.5 4.9v-.6m2.7.7l.4.4L7 
       5M5.9 6.1v.5h.5M4.2 5v.5h-.8m1 
       1.5v.6h-.6m1.2.8L3.6 6.7M5 
       8.4l1-.9h.7M4.6 3.6L5 4l.4-.4"
        />
        <g>
          <circle cx="5.5" cy="3.4" r="0.21" />
          <circle cx="4.5" cy="3.4" r="0.21" />
          <circle cx="6.6" cy="4.1" r="0.21" />
          <circle cx="3.5" cy="4.1" r="0.21" />
          <circle cx="4.2" cy="4.8" r="0.21" />
          <circle cx="6.1" cy="4.8" r="0.21" />
          <circle cx="7.1" cy="4.8" r="0.21" />
          <circle cx="6.6" cy="6.6" r="0.21" />
          <circle cx="5.9" cy="5.9" r="0.21" />
          <circle cx="3.2" cy="5.5" r="0.21" />
          <circle cx="3.5" cy="6.5" r="0.21" />
          <circle cx="4.4" cy="6.8" r="0.21" />
          <circle cx="3.6" cy="7.6" r="0.21" />
          <circle cx="6.9" cy="7.5" r="0.21" />
        </g>
      </svg>
      <div class="loading-message">Caricamento appartamenti</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-bottom: 2rem;
  max-width: 1600px;
  padding-top: 11rem;
  min-height: 100vh;
}

.enter {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: auto;
  padding-top: 2rem;
}

.find {
  font-size: 20px;
  color: #6a6569;
  font-weight: 500;
}

.cerca-appartamento {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 3rem;
  font-size: 3rem;
  max-width: 600px;
  color: #69c9f0;
}

.card {
  position: relative;
  border-radius: 10px;
  border: none;
  background-color: rgba(202, 212, 210, 0.237);
  transition: 0.5s;
  /* box-shadow: 5px 5px 10px 0px; */
}

.badge {
  background-color: #69c9f0;
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.card:hover {
  /* box-shadow: rgba(255, 172, 28, 0.199) 10px 10px,
    rgba(255, 172, 28, 0.19) 20px 20px; */
  box-shadow: rgba(88, 162, 205, 0.199) 10px 10px, rgba(88, 162, 205, 0.19) 20px 20px;
  transform: translate3d(-10px, -10px, 0);
}

.card-img-top {
  border-radius: 10px;
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  transition: 0.5s;
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 90%);
  mask-image: linear-gradient(to bottom, black 70%, transparent 90%);
}

.card-body {
  padding-top: 0;
  margin-top: -1rem;
}

.card-title {
  text-align: center;
}

.dettagli {
  border-right: 1px solid rgb(194, 194, 194);
}

p {
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

p i {
  width: 30px;
  font-size: 20px;
  color: #8b8589;
  margin-left: 1rem;
}

.fa-bath {
  font-size: 25px;
}

.location {
  margin-top: 1rem;
  font-size: 30px;
  color: #656164;
  text-align: center;
}

hr {
  margin-bottom: 0.5rem;
  margin-top: 0;
}

h6 {
  text-align: center;
}

.servizi {
  font-size: 14px;
  color: #6a6569;
  margin: 0 1rem;
}

.altri-servizi {
  text-align: center;
}

.center {
  border: 1px solid #6a6569;
  background-color: #ffffff;
  color: #959086;
  border-radius: 10px;
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: space-around;
}

@media (max-width: 1620px) {
  .center .nome-servizio {
    display: none;
  }
  .center {
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .center {
    justify-content: space-around;
  }
}

a {
  text-decoration: none;
}

.animation {
  display: inline-block;
}

/* Icona dell'astronave */
.animation .fa-rocket {
  font-size: 2rem;
  position: relative;
  transform: translate(-3px, 3px);
  animation: rocket-move 1.5s ease-in-out infinite;
}

/* Animazione del movimento dell'astronave */
@keyframes rocket-move {
  0% {
    transform: translate(-3px, 3px);
  }
  50% {
    transform: translate(2px, -2px); /* Muovi l'astronave verso in alto-a destra */
  }
  100% {
    transform: translate(-3px, 3px);
  }
}

/* Animazione della scia */

.loading-screen {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-show {
  opacity: 100;
}

.loading-message {
  color: rgb(25, 172, 221);
  width: 400px;
  font-size: 2rem;
  top: 100%;
  left: 0;
}

.opacity-zero {
  opacity: 0;
}

@media screen and (max-width: 1400px) {
  .container {
    padding-top: 10rem;
  }
}

@media screen and (max-width: 768px) {
  .container {
    padding-top: 9rem;
  }
}

/* --------------------------- home animation ------------------------------- */

svg {
  width: 20vw;
  height: 20vh;
  /* margin-left: 16.666vw;
  margin-top: 16.666vh; */
}

/*main-logo*/
.ha-logo path,
.ha-logo circle {
  fill: none;
  stroke: #99e1fd;
  stroke-width: 0.125px;
  stroke-linejoin: round;
}
.ha-logo path.house,
.ha-logo circle.house {
  stroke-linecap: round;
  stroke-width: 0.3px;
}

.loading.ha-logo circle {
  animation: nodes 6s linear infinite;
}

.loading.ha-logo .house {
  animation: house 6s ease infinite;
}

.loading.ha-logo .circut {
  animation: circut 6s cubic-bezier(0.7, 0.1, 0.1, 0.9) infinite;
}

@keyframes house {
  0% {
    stroke-dashoffset: -50;
    stroke-dasharray: 50 50;
  }
  45% {
    stroke-dashoffset: -100;
  }
  50% {
    stroke: #99e1fd;
  }
  60% {
    stroke: white;
  }
  75% {
    stroke: #99e1fd;
  }
  80% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: -130;
    stroke-dasharray: 50 50;
  }
}
@keyframes circut {
  0% {
    stroke-dasharray: 20 20;
    stroke-dashoffset: -20;
  }
  13% {
    stroke-dashoffset: -20;
  }
  50% {
    stroke-dashoffset: -40;
    stroke: #99e1fd;
  }
  60% {
    stroke: white;
  }
  70% {
    stroke: #99e1fd;
  }
  85% {
    stroke-dashoffset: -40;
  }
  100% {
    stroke-dashoffset: -60;
    stroke-dasharray: 20 20;
  }
}
@keyframes nodes {
  0% {
    stroke-dasharray: 0 4;
  }
  25% {
    stroke-dasharray: 0 4;
  }
  35% {
    stroke-dasharray: 4 0;
    stroke: #99e1fd;
  }
  41% {
    fill: none;
  }
  42% {
    fill: #99e1fd;
  }
  55% {
    fill: none;
    stroke: #99e1fd;
  }
  65% {
    fill: white;
    stroke: white;
  }
  75% {
    stroke: #99e1fd;
    fill: none;
    stroke-dasharray: 4 0;
  }
  85% {
    fill: #99e1fd;
    stroke: #99e1fd;
  }
  93% {
    fill: none;
    stroke-dasharray: 4 0;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -4;
    stroke-dasharray: 0 4;
  }
}
.ha-logo circle:nth-child(1n) {
  animation-delay: -0.054s;
}

.ha-logo circle:nth-child(2n) {
  animation-delay: -0.108s;
}

.ha-logo circle:nth-child(3n) {
  animation-delay: -0.162s;
}

.ha-logo circle:nth-child(4n) {
  animation-delay: -0.216s;
}

.ha-logo circle:nth-child(5n) {
  animation-delay: -0.27s;
}

.ha-logo circle:nth-child(6n) {
  animation-delay: -0.324s;
}

.ha-logo circle:nth-child(7n) {
  animation-delay: -0.378s;
}

.ha-logo circle:nth-child(8n) {
  animation-delay: -0.432s;
}

.ha-logo circle:nth-child(9n) {
  animation-delay: -0.486s;
}

.ha-logo circle:nth-child(10n) {
  animation-delay: -0.54s;
}

.ha-logo circle:nth-child(11n) {
  animation-delay: -0.594s;
}

.ha-logo circle:nth-child(12n) {
  animation-delay: -0.648s;
}

.ha-logo circle:nth-child(13n) {
  animation-delay: -0.702s;
}

.ha-logo circle:nth-child(14n) {
  animation-delay: -0.756s;
}
</style>
