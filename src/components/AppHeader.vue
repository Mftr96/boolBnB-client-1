<script>
import axios from 'axios';
import store from '../data/store.js';
import { RouterLink } from 'vue-router';

export default {
  name: 'AppHeader',

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
      // axios.get('http://127.0.0.1:8000/api/apartments').then((response) => {
      //   console.log(response.data.results.data);
      //   store.searchApartment = response.data.results.data;
      // });
      axios
        .get(
          `https://api.tomtom.com/search/2/geocode/${this.inputIndirizzo}.json?key=RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu&countrySet=IT`
        )
        .then((response) => {
          this.coordinates = response.data.results[0].position;
          this.searchData = {
            longitude: this.coordinates.lon,
            latitude: this.coordinates.lat,
            // rooms: this.inputCamere,
            // beds: this.inputLetti,
            // services: this.inputServices,
            // radius: this.inputRaggio,
          };
          console.log(this.searchData);

          axios
            .post('http://127.0.0.1:8000/api/search', this.searchData)
            .then((response) => {
              this.store.searchApartment = response.data.results;
              console.log(response);
            });
        });
    },
  },

  mounted() {},
};
</script>

<template>
  <header>
    <nav class="container">
      <div class="css-flex">
        <input
          class="form-control"
          id="indirizzo"
          list="suggestion"
          type="text"
          placeholder="Inserisci indirizzo o città"
          v-model="inputIndirizzo"
          @focus="isActive = true"
          @blur="timeoutShow"
        />
        <input
          step="1"
          min="1"
          class="form-control"
          type="number"
          placeholder="Numero di stanze"
          v-model="inputCamere"
        />
        <input
          step="1"
          min="1"
          class="form-control"
          type="number"
          placeholder="Numero di posti letto"
          v-model="inputLetti"
        />
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="triggerId"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Servizi
          </button>
          <div class="dropdown-menu row" aria-labelledby="triggerId">
            <div class="servizi row">
              <input
                v-model="inputServizi"
                class="col-3"
                value="1"
                type="checkbox"
                id="servizio1"
              />
              <label class="col-9" for="servizio1">Servizio1</label>
            </div>
          </div>
        </div>
        <input
          step="1"
          min="1"
          class="form-control"
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
      <ul v-show="apiSuggestions.length > 0 && isActive == true">
        <li
          @click="writeAddress(singleAddress)"
          v-for="(singleAddress, i) in apiSuggestions"
        >
          {{ singleAddress }}
        </li>
      </ul>
    </nav>
  </header>
  <!-- <div>
  <ul id="opzioni"></ul>
  <input type="number" placeholder="Stanze">
    <input type="number" placeholder="Posti letto">
  <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="triggerId"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Servizi
      </button>
      <div class="dropdown-menu" aria-labelledby="triggerId">
        <input type="checkbox" id="servizio1">Servizio 1</input>
        <input type="checkbox" id="servizio2">Servizio 2</input>
        <input type="checkbox" id="servizio3">Servizio 3</input>
        <input type="checkbox" id="servizio4">Servizio 4</input>
      </div>
  </div>
</div> -->
</template>

<style scoped>
header {
  width: 100%;
  height: 5rem;
  display: flex;
  align-items: center;
}

.css-flex {
  display: flex;
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
</style>
