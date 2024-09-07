<script>
import axios from 'axios';
import store from '../data/store.js';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppSearchFilters',

  components: {},

  data() {
    return {
      store,
      searchData: null,
      inputIndirizzo: '',
      inputCamere: null,
      inputLetti: null,
      inputServizi: [],
      inputRaggio: null,
      apiKey: 'RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu',
      apiSuggestions: [],
      isActive: false,
      coordinates: [],
      visible: false,
      errors: null,
    };
  },

  watch: {
    inputIndirizzo(newInputIndirizzo, oldInputIndirizzo) {
      if (newInputIndirizzo.length > 3 && this.isActive == true) {
        this.assistenzaIndirizzo(newInputIndirizzo);
      }
    },
  },

  methods: {
    assistenzaIndirizzo(indirizzo) {
      this.apiSuggestions = [];
      const url_tomtom = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
        indirizzo
      )}.json?key=${this.apiKey}&typeahead=true&limit=5&countrySet=IT`;
      axios.get(url_tomtom).then((response) => {
        let apiResponse = response.data.results;
        for (let i = 0; i < apiResponse.length; i++) {
          this.apiSuggestions.push(apiResponse[i].address.freeformAddress);
        }
      });
    },
    writeAddress(actualAddress) {
      this.inputIndirizzo = actualAddress;
    },
    timeoutShow() {
      setTimeout(() => {
        this.isActive = false;
      }, 200);
    },
    searchRequest() {
      this.errors = [];
      if (!this.inputIndirizzo) {
        this.visible = true;
        this.store.searchApartment = [];
      } else {
        this.visible = false;
        axios
          .get(
            `https://api.tomtom.com/search/2/geocode/${this.inputIndirizzo}.json?key=RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu&countrySet=IT`
          )
          .then((response) => {
            this.coordinates = response.data.results[0].position;
            this.searchData = {
              longitude: this.coordinates.lon,
              latitude: this.coordinates.lat,
              rooms: this.inputCamere,
              beds: this.inputLetti,
              services: this.inputServizi,
              radius: this.inputRaggio,
            };
            console.log(this.searchData);

            axios
              .post('http://127.0.0.1:8000/api/search', this.searchData)
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
  //provaprova
  mounted() {},
};
</script>

<template>
  <header>
    <nav class="container">
      <div class="search-container">
        <div class="search-bar">
          <input
            class=""
            id="indirizzo"
            list="suggestion"
            type="text"
            placeholder="Inserisci indirizzo o città"
            v-model="inputIndirizzo"
            @focus="isActive = true"
            @blur="timeoutShow"
          />
          <div class="d-flex flex-column justify-content-center">
            <label for="numero-stanze">Numero di stanze</label>
            <input
              id="numero-stanze"
              step="1"
              min="1"
              class=""
              type="number"
              v-model="inputCamere"
              readonly
            />
          </div>
          <input
            step="1"
            min="1"
            class=""
            type="number"
            placeholder="Numero di posti letto"
            v-model="inputLetti"
          />
          <input
            step="1"
            min="1"
            class=""
            type="number"
            placeholder="Raggio di ricerca in km"
            v-model="inputRaggio"
          />
          <router-link
            :to="{ name: 'search' }"
            @click="searchRequest()"
            class="buttonSearch"
          >
            Cerca
          </router-link>
        </div>
      </div>
      <div class="d-flex gap-3 justify-content-between">
        <div v-for="(servizio, i) in store.servizi_bnb" class="servizi">
          <input
            v-model="inputServizi"
            class="servicescheck"
            type="checkbox"
            :id="i"
            :value="i + 1"
            style="display: none"
          />
          <label :for="i">
            <span v-html="servizio.icon"></span>
            {{ servizio.title }}
          </label>
        </div>
      </div>
      <ul v-show="apiSuggestions.length > 0 && isActive == true">
        <li
          @click="writeAddress(singleAddress)"
          v-for="(singleAddress, i) in apiSuggestions"
        >
          {{ singleAddress }}
        </li>
      </ul>

      <p v-show="visible" class="paragrafo">L'indirizzo è obbligatorio</p>
      <p v-for="error in errors" class="paragrafo">{{ error }}</p>
    </nav>
  </header>
</template>

<style scoped>
input {
  all: unset;
}

header {
  width: 100%;
  height: 10rem;
  display: flex;
  align-items: center;
}

.container {
  position: relative;
}

.search-container {
  display: flex;
  justify-content: center;
}

.search-bar {
  display: inline-flex;
  background-color: white;
  border-radius: 30px;
  padding: 1rem;
  justify-content: center;
  text-align: center;
  margin-bottom: 0.5rem;
}

.servicescheck {
  width: 15px;
  margin-left: 1rem;
}

.buttonSearch {
  background-color: rgb(255, 255, 255);
  border-radius: 0 5px 5px 0;
  margin: 0.4px 0;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

#indirizzo {
  border-radius: 5px 0 0 5px;
}

ul {
  background-color: rgba(217, 217, 217, 0.88);
  padding: 0;
  position: absolute;
  z-index: 1;
  border-radius: 0 0 10px 10px;
}

li {
  list-style: none;
  padding: 0 1rem;
}

li:hover {
  background-color: rgb(176, 220, 233);
  cursor: pointer;
}

.servizi {
  margin-bottom: 0.3rem;
}

.paragrafo {
  position: absolute;
  top: -1.5rem;
  color: red;
}
</style>
