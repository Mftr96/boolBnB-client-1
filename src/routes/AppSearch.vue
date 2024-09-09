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
      if (this.store.searchApartment.length > 0) {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    },
  },
  mounted() {},
};
</script>

<template>
  <AppSearchFilters />
  <div class="container" :class="{ 'opacity-zero': isLoading }">
    <div class="row g-3 flex-wrap">
      <div v-for="(apartment, i) in store.searchApartment" class="col-4">
        <router-link :to="`/search/${apartment.id}`" class="card">
          <img
            :src="getImage(apartment.image)"
            class="card-img-top"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">{{ apartment.title }}</h5>
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

            <hr />

            <h6>Servizi</h6>
            <div class="servizi row">
              <div
                v-for="(servizio, i) in apartment.services.slice(0, 4)"
                class="col-6"
              >
                <div class="center">
                  <span v-html="getServizio(servizio.id).icon"></span>
                  {{ getServizio(servizio.id).title }}
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

            <!-- <router-link :to="`/search/${apartment.id}`">
            Dettagli appartamento
          </router-link> -->
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
}

.card {
  position: relative; /* Per posizionare il layer sotto la card */
  border-radius: 20px;
  height: 565px;
  border: none;
  background-color: white; /* Rendi la card trasparente */
  transition: 0.5s;
}

.card:hover .card-img-top {
  box-shadow: 0px 10px 10px 0px;
  transform: translateY(-10px);
}

.card-img-top {
  border-radius: 20px;
  /* box-shadow: 0px 10px 10px 0px; */
  transition: 0.5s;
}

.card-title {
  text-align: center;
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

p:nth-child(4) i {
  font-size: 25px;
}

hr {
  margin: 0.5rem 0;
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
  background-color: #959086;
  color: white;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 0.3rem;
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
