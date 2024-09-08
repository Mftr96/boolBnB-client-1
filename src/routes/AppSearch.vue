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

  mounted() {
    // console.log(store.searchApartment);
  },
};
</script>

<template>
  <AppSearchFilters />
  <div class="container">
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

.card::before {
  content: '';
  position: absolute;
  border-radius: 20px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1; /* Metti il layer dietro la card */
  background: linear-gradient(130deg, #fff6e7, #c9e8f4); /* Gradiente */
  filter: opacity(0); /* Layer inizialmente nascosto */
  transition: filter 0.5s ease; /* Transizione sull'opacità del layer */
}

.card:hover {
  background-color: transparent;
}

.card:hover::before {
  filter: opacity(1); /* Mostra il layer al passaggio del mouse */
}

.card-img-top {
  border-radius: 20px;
  box-shadow: 0px 10px 10px 0px;
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
</style>
