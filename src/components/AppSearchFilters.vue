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
      inputCamere: 1,
      inputLetti: 1,
      inputServizi: [],
      inputRaggio: 20,
      rangeStyle: '',
      apiKey: 'RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu',
      apiSuggestions: [],
      isActive: false,
      coordinates: [],
      visible: false,
      errors: null,
      isActiveStanze: false,
    };
  },

  watch: {
    inputIndirizzo(newInputIndirizzo, oldInputIndirizzo) {
      if (newInputIndirizzo.length > 0 && this.isActive == true) {
        this.assistenzaIndirizzo(newInputIndirizzo);
      }
    },
  },

  methods: {
    updateRangeBackground() {
      const min = 1;
      const max = 100;
      const percentage = ((this.inputRaggio - min) / (max - min)) * 100;

      document.documentElement.style.setProperty(
        '--range-percentage',
        `${percentage}%`
      );
    },

    toggleStanze() {
      this.isActiveStanze = !this.isActiveStanze;
    },

    plusButtonStanze() {
      this.inputCamere++;
    },

    minusButtonStanze() {
      if (this.inputCamere > 1) {
        this.inputCamere--;
      }
    },

    plusButtonLetti() {
      this.inputLetti++;
    },

    minusButtonLetti() {
      if (this.inputLetti > 1) {
        this.inputLetti--;
      }
    },

    assistenzaIndirizzo(indirizzo) {
      const url_tomtom = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
        indirizzo
      )}.json?key=${
        this.apiKey
      }&typeahead=true&limit=5&countrySet=IT&idxSet=Geo`;

      // ricerca axios

      axios.get(url_tomtom).then((response) => {
        let apiResponse = response.data.results;
        const newSuggestions = [];

        for (let i = 0; i < apiResponse.length; i++) {
          newSuggestions.push(apiResponse[i].address.freeformAddress);
        }

        this.apiSuggestions = newSuggestions;
      });
    },

    writeAddress(actualAddress, event) {
      event.stopPropagation();
      this.inputIndirizzo = actualAddress;
      this.isActive = false;
    },

    timeoutShow() {
      setTimeout(() => {
        this.isActive = false;
      }, 150);
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
            // this.searchData = {
            //   longitude: this.coordinates.lon,
            //   latitude: this.coordinates.lat,
            //   rooms: this.inputCamere,
            //   beds: this.inputLetti,
            //   services: this.inputServizi,
            //   radius: this.inputRaggio,
            // };
            console.log(this.searchData);

            const url = `http://127.0.0.1:8000/api/search?latitude=${
              this.coordinates.lat
            }&longitude=${this.coordinates.lon}&radius=${
              this.inputRaggio
            }&beds=${this.inputLetti}&rooms=${
              this.inputCamere
            }&services=${this.inputServizi.join(',')}`;

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

            // axios
            //   .post('http://127.0.0.1:8000/api/search', this.searchData)
            //   .then((response) => {
            //     this.store.searchApartment = response.data.results;
            //     console.log(response);
            //     this.errors = response.data.errors.rooms;
            //   })
            //   .catch((error) => {
            //     console.log('errore');
            //   });
          });
      }
    },
  },
  mounted() {
    this.updateRangeBackground();
  },
};
</script>

<template>
  <header>
    <nav class="container">
      <div class="search-container">
        <div class="search-bar">
          <!-------------------- indirizzo --------------------->
          <div class="suggerimenti-indirizzo">
            <input
              class=""
              id="indirizzo"
              list="suggestion"
              type="text"
              placeholder="Inserisci città"
              v-model="inputIndirizzo"
              @focus="isActive = true"
              @blur="timeoutShow"
              autocomplete="off"
            />
            <ul v-show="apiSuggestions.length > 0 && isActive == true">
              <li
                @click="writeAddress(singleAddress, $event)"
                v-for="(singleAddress, i) in apiSuggestions"
              >
                <i class="fa-solid fa-location-dot"></i>
                <span>{{ singleAddress }}</span>
              </li>
            </ul>
            <p v-show="visible" class="paragrafo">L'indirizzo è obbligatorio</p>
          </div>
          <!-------------------- stanze --------------------->
          <div class="d-flex flex-column justify-content-center">
            <label class="label-number" for="numero-stanze">Stanze</label>
            <div class="number-logic">
              <button @click="minusButtonStanze()" class="button-minus">
                <i class="fa-solid fa-minus"></i>
              </button>
              <input
                id="numero-stanze"
                step="1"
                min="1"
                type="number"
                v-model="inputCamere"
                readonly
              />
              <button @click="plusButtonStanze()" class="button-plus">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>

          <!-------------------- posti letto --------------------->
          <div class="d-flex flex-column justify-content-center">
            <label class="label-number" for="numero-letti">Posti letto</label>
            <div class="number-logic">
              <button @click="minusButtonLetti()" class="button-minus">
                <i class="fa-solid fa-minus"></i>
              </button>
              <input
                id="numero-letti"
                step="1"
                min="1"
                type="number"
                v-model="inputLetti"
                readonly
              />
              <button @click="plusButtonLetti()" class="button-plus">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
          <!-------------------- raggio ricerca --------------------->
          <div class="d-flex flex-column justify-content-center">
            <label class="label-range label-number" for="raggio"
              >Raggio di ricerca</label
            >
            <div id="raggio-ricerca" class="number-logic">
              <input
                type="range"
                id="raggio"
                min="1"
                max="100"
                v-model="inputRaggio"
                @input="updateRangeBackground"
                :style="rangeStyle"
              />
            </div>
            <div>{{ inputRaggio }} Km</div>
          </div>
          <!-------------------- Tasto ricerca --------------------->
          <router-link
            :to="{ name: 'search' }"
            @click="searchRequest()"
            class="buttonSearch"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </router-link>
        </div>
      </div>
      <!-------------------- Elenco servizi --------------------->
      <div class="d-flex gap-2 justify-content-between">
        <div v-for="(servizio, i) in store.servizi_bnb">
          <input
            v-model="inputServizi"
            class=""
            type="checkbox"
            :id="i"
            :value="i + 1"
            style="display: none"
          />
          <label @click="searchRequest()" class="servizi" :for="i">
            <span v-html="servizio.icon"></span>
            {{ servizio.title }}
          </label>
        </div>
      </div>
      <!-- <p v-for="error in errors" class="paragrafo">{{ error }}</p> -->
    </nav>
  </header>
  <hr />
</template>

<style scoped>
input {
  all: unset;
}

header {
  width: 100%;
  min-height: 10rem;
  display: flex;
  align-items: center;
  padding-top: 1rem;
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
  height: 64.38px;
  background-color: white;
  border-radius: 30px;
  padding: 0.2rem 0rem 0.2rem 1rem;
  justify-content: center;
  text-align: center;
  margin-bottom: 0.5rem;
}

.buttonSearch {
  background-color: rgb(255, 255, 255);
  border-radius: 30px;
  margin: 0.4px 0;
  padding: 0 0.5rem 0 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

#indirizzo {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 150px;
}

.suggerimenti-indirizzo {
  display: flex;
  position: relative;
}

.suggerimenti-indirizzo i {
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

.number-logic {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10rem;
}

.label-number {
  font-weight: 500;
}

.label-range {
  margin-bottom: 0.2rem;
}

.animation .number-logic {
  display: unset;
  opacity: 100;
  transition: 1s;
}

#numero-stanze,
#numero-letti {
  width: 35px;
  margin-left: 15px;
  padding: 5px;
}

.span-km {
  transform: translateX(-20px);
}

.button-plus,
.button-minus {
  border: 2px solid #d8cfc4;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  transition: 0.5s;
}

#raggio-ricerca .button-plus {
  right: 25px;
}
#raggio-ricerca .button-minus {
  left: 25px;
}

.button-plus {
  right: 35px;
}

.button-minus {
  left: 35px;
}

.button-minus:hover,
.button-plus:hover {
  border-color: #8b8589;
}

.button-plus i,
.button-minus i {
  color: #d8cfc4;
  transition: 0.3s;
}

.button-plus:active i,
.button-minus:active i {
  color: #8b8589;
}

.servizi {
  margin-bottom: 0.3rem;
  border: 3px solid rgb(255, 255, 255);
  padding: 0.5rem 0.3rem;
  border-radius: 20px;
  cursor: pointer;
  background-color: white;
  transition: 0.4s;
}

.servizi:hover {
  border-color: #b3a49a;
}

input[type='checkbox']:checked + .servizi {
  border-color: #8b8589;
}

.paragrafo {
  position: absolute;
  top: 0rem;
  color: red;
  white-space: nowrap;
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

hr {
  border: 1px solid #b3a49a;
  margin-top: 0;
}

/* range input style */
/* range input style */
#raggio {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 5px;
  outline: none;
  background: linear-gradient(
    to right,
    #91c2c5 var(--range-percentage),
    #e0e0e0 var(--range-percentage)
  );
}

#raggio:hover {
  background: linear-gradient(
    to right,
    #91c2c5 var(--range-percentage),
    #cfcfcf var(--range-percentage)
  );
}

/* Track personalizzato */
#raggio::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: linear-gradient(
    to right,
    #91c2c5 var(--range-percentage),
    #e0e0e0 var(--range-percentage)
  );
  border-radius: 5px;
}

/* Thumb personalizzato */
#raggio::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #9f8d7c; /* Colore tortora */
  border-radius: 50%;
  cursor: pointer;
  margin-top: -3px;
  border: none;
}

#raggio::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #9f8d7c;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

#raggio::-ms-thumb {
  width: 12px;
  height: 12px;
  background: #9f8d7c;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style>
