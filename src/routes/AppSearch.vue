<script>
import store from '../data/store.js';
import { RouterLink } from 'vue-router';
import AppSearchFilters from '../components/AppSearchFilters.vue';
import axios from 'axios';

export default {
  name: 'AppSearch',

  components: {
    AppSearchFilters,
  },

  data() {
    return {
      store,
      stanze: 'Camere',
      letti: 'Posti letto',
      bagni: 'Bagni',
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

      axios
        .get(url)
        .then((response) => {
          this.store.searchApartment = response.data.results;
        })
        .catch((error) => {
          console.log('errore');
        });
    }
  },
};
</script>

<template>
  <AppSearchFilters />
  <div class="container" :class="{ 'opacity-zero': isLoading }">
    <div class="row g-4 flex-wrap">
      <div
        v-for="(apartment, i) in store.searchApartment"
        class="col-12 col-md-6 col-lg-4 col-xl-3"
      >
        <router-link :to="`/search/${apartment.title}`" class="card h-100">
          <img
            :src="getImage(apartment.image)"
            class="card-img-top"
            alt="..."
          />
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

            <h6>Servizi</h6>
            <div class="servizi row">
              <div
                v-for="(servizio, i) in apartment.services.slice(0, 4)"
                class="col-6 servizio"
              >
                <div class="center">
                  <span v-html="getServizio(servizio.id).icon"></span>
                  <span class="nome-servizio">{{
                    getServizio(servizio.id).title
                  }}</span>
                </div>
              </div>
              <div
                v-if="apartment.services.length > 5"
                class="altri-servizi col"
              >
                <div>altri {{ apartment.services.length - 4 }} servizi</div>
              </div>
              <div
                v-if="apartment.services.length == 5"
                class="altri-servizi col"
              >
                <div>un altro servizio</div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
  <div
    v-show="isLoading"
    class="loading-screen"
    :class="{ 'loading-show': isLoading }"
  >
    <div class="loading-message">Caricamento appartamenti</div>
    <div class="loader">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-bottom: 2rem;
  max-width: 1600px;
  padding-top: 13rem;
}

.card {
  position: relative;
  border-radius: 10px;
  border: none;
  background-color: white;
  transition: 0.5s;
  /* box-shadow: 5px 5px 10px 0px; */
}

.card:hover {
  /* box-shadow: rgba(255, 172, 28, 0.199) 10px 10px,
    rgba(255, 172, 28, 0.19) 20px 20px; */
  box-shadow: rgba(88, 162, 205, 0.199) 10px 10px,
    rgba(88, 162, 205, 0.19) 20px 20px;
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

.loader {
  margin-top: 10rem;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.circle {
  position: absolute;
  width: 0px;
  height: 0px;
  border-radius: 100%;
  background: rgb(25, 172, 221);
  animation: radar 3s ease-out infinite;
  box-shadow: 0px 0px 10px rgb(25, 172, 221);
}

.circle:nth-of-type(1) {
  animation-delay: 0.2s;
}

.circle:nth-of-type(2) {
  animation-delay: 0.6s;
}

.circle:nth-of-type(3) {
  animation-delay: 1s;
}

.circle:nth-of-type(4) {
  animation-delay: 1.4s;
}

.circle:nth-of-type(5) {
  animation-delay: 1.8s;
}

@keyframes radar {
  0% {
  }
  30% {
    width: 100px;
    height: 100px;
  }
  100% {
    width: 100px;
    height: 100px;
    opacity: 0;
  }
}

.loading-screen {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}

.loading-show {
  opacity: 100;
}

.loading-message {
  position: fixed;
  color: rgb(25, 172, 221);
  width: 400px;
  font-size: 2rem;
  top: 30%;
  left: -40%;
}

.opacity-zero {
  opacity: 0;
}
</style>
