<script>
import axios from 'axios';
import store from '../data/store.js';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppMain',

  components: {},

  data() {
    return {
      store,
      searchData: null,
      inputCittà: '',
      coordinates: [],
      apiKey: 'RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu',
      apiSuggestions: [],
      contentSize: 10,
      homepageContent: [],
      isLoading: false,
      isActive: false,
      inputRaggio: 20,
      visible: false,
      errors: null,
    };
  },


  watch: {
    //Animazione di caricamento
    'store.searchApartment'() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    //Assistenza input
    inputCittà(newInputCittà, oldInputCittà) {
      if (newInputCittà.length > 0 && this.isActive == true) {
        this.assistenzaCittà(newInputCittà);
      }
    },
  },


  methods: {

    //Funzioni di grafica
    timeoutShow() {
      setTimeout(() => {
        this.isActive = false;
      }, 200);
    },
    updateRangeBackground() {
      const min = 1;
      const max = 100;
      const percentage = ((this.inputRaggio - min) / (max - min)) * 100;

      document.documentElement.style.setProperty(
        '--range-percentage',
        `${percentage}%`
      );
    },

    //Funzioni per il funzionamento interno
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

    //Correzione testi e recupero dati
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

    //Funzioni con contatto API
    assistenzaCittà(città) {

      const url_tomtom = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        città
      )}.json?key=${this.apiKey}&typeahead=true&limit=5&countrySet=IT&entityTypeSet=Municipality`;

      axios.get(url_tomtom).then((response) => {
        let apiResponse = response.data.results;
        const newSuggestions = [];

        for (let i = 0; i < apiResponse.length; i++) {
          newSuggestions.push(apiResponse[i].address.freeformAddress);
        }
        console.log("Risposta API: ", newSuggestions);
        this.apiSuggestions = newSuggestions;
      });
    },
    writeAddress(actualAddress, event) {
      event.stopPropagation();
      this.inputCittà = actualAddress;
      this.isActive = false;
    },
    searchRequest() {
      this.errors = [];
      if (!this.InputCittà) {
        this.visible = true;
        // this.store.searchApartment = [];
      } else {
        this.visible = false;
        axios
          .get(
            `https://api.tomtom.com/search/2/geocode/${this.InputCittà}.json?key=RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu&countrySet=IT&entityTypeSet=Municipality`
          )
          .then((response) => {
            this.coordinates = response.data.results[0].position;

            this.$router.push({
              name: 'search',
              query: {
                indirizzo: this.InputCittà,
                latitude: this.coordinates.lat,
                longitude: this.coordinates.lon,
                radius: 20,
              },
            });

            const url = `http://127.0.0.1:8000/api/search?latitude=${
              this.coordinates.lat
              }&longitude=${this.coordinates.lon
              }&radius=${this.inputRaggio}`;

            console.log(url);

            axios
              .get(url)
              .then((response) => {
                this.store.searchApartment = response.data.results;
                console.log(response);
                this.errors = response.data.errors.rooms;
              })
              .catch((error) => {
                console.log('errore');
              });
          });
      }
    },

  },


  mounted() {

    this.updateRangeBackground();
    const url = `http://127.0.0.1:8000/api/apartments`;
    //Chiamata dati per appartamenti
    axios
      .get(url)
      .then((response) => {
        this.store.homepageContent = response.data.results.data;
        console.log(response);
        console.log(this.store.homepageContent);
      })
      .catch((error) => {
        console.log('errore in caricamento index');
      });
  },
};
</script>

<template>
  <div class="search-container">
    <div class="search-bar">
      <!-- Input città -->
      <div class="suggerimenti-città">
        <input class="" id="città" list="suggestion" type="text" placeholder="Inserisci una città" v-model="inputCittà"
          @focus="isActive = true" @blur="timeoutShow" autocomplete="off" />
        <!-- Suggerimenti input -->
        <ul v-show="apiSuggestions.length > 0 && isActive == true">
          <li @click="writeAddress(singleAddress, $event)" v-for="(singleAddress, i) in apiSuggestions">
            <i class="fa-solid fa-location-dot"></i>
            <span>{{ singleAddress }}</span>
          </li>
        </ul>
        <!-- Messaggio d'errore -->
        <p v-show="visible" class="paragrafo">Inserisci una città</p>
        <!-- Bottone di ricerca -->
        <router-link :to="{ name: 'search' }" @click="searchRequest()" class="buttonSearch">
          <i class="fa-solid fa-magnifying-glass"></i>
        </router-link>
      </div>
    </div>
  </div>

  <div class="cards-container" :class="{ 'opacity-zero': isLoading }">
    <div class="row g-4 flex-wrap">
      <div v-for="(apartment, i) in store.homepageContent" class="col-6 col-md-6 col-lg-4 col-xl-3">
        <router-link :to="`/search/${apartment.id}`" class="card h-100">
          <img :src="getImage(apartment.image)" class="card-img-top" alt="..." />
          <div class="card-body">
            <h5 class="card-title apartmentName">{{ apartment.title }}</h5>
            <div class="row">
              <div class="col-6 dettagli">
                <p class="apartmentDetail">
                  <i class="fas fa-door-open"></i> {{ apartment.rooms }}
                  {{ getRightWords("Camere", apartment.rooms) }}
                </p>
                <p class="apartmentDetail">
                  <i class="fas fa-bed"></i> {{ apartment.beds }}
                  {{ getRightWords("Posti letto", apartment.beds) }}
                </p>
                <p class="apartmentDetail">
                  <i class="fas fa-bath"></i> {{ apartment.bathrooms }}
                  {{ getRightWords("bagni", apartment.bathrooms) }}
                </p>
              </div>
            </div>

          </div>
        </router-link>
      </div>
    </div>
  </div>

  <!-- <div class="card">
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
    </div> -->

</template>

<style scoped>
:root {
  --bool-color-1: white;
  --bool-color-2: rgb(175, 175, 175);
  --bool-color-3: rgb(99, 99, 99);
  --bool-color-4: rgb(7, 7, 7);
}

HTML {
  background-color: var(--bool-color-1);
  color: var(--bool-color-4);
}

.search-container {
  display: flex;
  justify-content: space-between;
  width: 20vw;
  margin: 0 auto;
}

.search-bar {
  display: inline-flex;
  height: 5rem;
  background-color: white;
  border-radius: 2.5rem;
  padding: 0.2rem 1rem 0.2rem 2rem;
  justify-content: center;
  text-align: center;
  margin: 1rem auto;
}

.buttonSearch {
  background-color: rgb(255, 255, 255);
  border-radius: 30px;
  margin: 0.4px 0 0.4px 0.5rem;
  padding: 0 0.5rem 0 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

#città {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  font-size: 2rem;
  border-radius: 2rem;
  border: 0 white;
  outline: none;
}
#città:focus {
  border: 1px rgb(175, 175, 175);
}

a {
  text-decoration: none;
  color: rgb(255, 255, 255);
}

a i {
  background-color: #d8cfc4;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: 0.5s;
}

a i:hover {
  background-color: #b3a49a;
}


.suggerimenti-città {
  display: flex;
  position: relative;
}

.suggerimenti-città i {
  font-size: 40px;
  padding: 0.5rem;
}

ul {
  background-color: #d8cfc4;
  padding: 0;
  position: absolute;
  top: 4rem;
  left: -1rem;
  z-index: 1;
  border-radius: 20px;
  width: 25rem;
}

li {
  list-style: none;
  margin: 0.2rem 1rem;
  text-align: start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  border-radius: 10px;
}

li:hover {
  background-color: #b3a49a;
  cursor: pointer;
}
.apartmentDetail, .apartmentName {
  color: black;
}

/* Animazione di caricamento */
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
  0% {}

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
