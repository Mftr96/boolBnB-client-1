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
  <div class="container d-flex justify-content-between flex-wrap">
    <div v-for="(apartment, i) in store.searchApartment" class="col-3 p-2">
      <div class="card">
        <img :src="getImage(apartment.image)" class="card-img-top" alt="..." />
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
              <div>
                <span v-html="getServizio(servizio.id).icon"></span>
                {{ getServizio(servizio.id).title }}
              </div>
            </div>
            <div v-if="apartment.services.length > 4" class="altri-servizi col">
              <div>... altri servizi</div>
            </div>
          </div>

          <!-- <router-link
            :to="`/search/${apartment.id}`"
            @click="apartmentDetail(apartment)"
            class="btn btn-primary"
          >
            Dettagli appartamento
          </router-link> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 20px;
  height: 484px;
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
}

.altri-servizi {
  text-align: center;
}
</style>
