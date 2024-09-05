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
      inputIndirizzo: '',
      apiKey: 'RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu',
      apiSuggestions: [],
      isActive: false,
      coordinates: [],
    };
  },

  watch: {
    inputIndirizzo(newInputIndirizzo, oldInputIndirizzo) {
      if (newInputIndirizzo.length > 5 && this.isActive == true) {
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
      axios.get('http://127.0.0.1:8000/api/apartments').then((response) => {
        console.log(response.data.results.data);
        store.searchApartment = response.data.results.data;
      });
      // axios
      //   .get(
      //     `https://api.tomtom.com/search/2/geocode/${this.inputIndirizzo}.json?key=RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu&countrySet=IT`
      //   )
      //   .then((response) => {
      //     console.log(response.data.results[0].position);
      //     this.coordinates = response.data.results[0].position;
      //   });
      // axios
      //   .post(urlchecidarannoglialtrigentilmente, this.coordinates)
      //   .then((response) => {
      //     store.searchApartment = response.data.results.data;
      //   });
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
</style>
