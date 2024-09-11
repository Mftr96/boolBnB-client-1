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
      newInputIndirizzo: "",
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
      // const url_tomtom = `https://api.tomtom.com/search/2/search/${encodeURIComponent(
      //   indirizzo
      // )}.json?key=${
      //   this.apiKey
      // }&typeahead=true&limit=5&countrySet=IT&idxSet=Geo`;

      const url_tomtom = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
        indirizzo
      )}.json?key=${this.apiKey}&typeahead=true&limit=5&countrySet=IT&entityTypeSet=Municipality`;

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
        // this.store.searchApartment = [];
      } else {
        this.visible = false;
        axios
          .get(
            `https://api.tomtom.com/search/2/geocode/${this.inputIndirizzo}.json?key=RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu&countrySet=IT`
          )
          .then((response) => {
            this.coordinates = response.data.results[0].position;
            console.log(this.searchData);

            this.$router.push({
              name: 'search',
              query: {
                indirizzo: this.inputIndirizzo,
                latitude: this.coordinates.lat,
                longitude: this.coordinates.lon,
                radius: this.inputRaggio,
                beds: this.inputLetti,
                rooms: this.inputCamere,
                services: this.inputServizi.join(','),
              },
            });

            const url = `http://127.0.0.1:8000/api/search?latitude=${this.coordinates.lat
              }&longitude=${this.coordinates.lon}&radius=${this.inputRaggio
              }&beds=${this.inputLetti}&rooms=${this.inputCamere
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
          });
      }
    },
    loadData() {
      this.inputIndirizzo = this.$route.query.indirizzo;
      this.inputCamere = this.$route.query.rooms ? this.$route.query.rooms : 1;
      this.inputLetti = this.$route.query.beds ? this.$route.query.beds : 1;
      this.inputRaggio = this.$route.query.radius
        ? this.$route.query.radius
        : 20;
      if (this.$route.query.services) {
        this.inputServizi = this.$route.query.services.split(',').map(Number);
      }
    },
  },
  mounted() {
    this.updateRangeBackground();
    this.loadData();
    const url = `http://127.0.0.1:8000/api/apartments`;
    axios
      .get(url)
      .then((response) => {
        this.store.homepageContent = response.data.results.data;
        console.log(this.store.homepageContent);
      })
      .catch((error) => {
        console.log('errore in caricamento index');
      });
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
            <input class="" id="indirizzo" list="suggestion" type="text" placeholder="Inserisci una città"
              v-model="inputIndirizzo" @focus="isActive = true" @blur="timeoutShow" autocomplete="off" />
            <ul v-show="apiSuggestions.length > 0 && isActive == true">
              <li @click="writeAddress(singleAddress, $event)" v-for="(singleAddress, i) in apiSuggestions">
                <i class="fa-solid fa-location-dot"></i>
                <span>{{ singleAddress }}</span>
              </li>
            </ul>
            <p v-show="visible" class="paragrafo">L'indirizzo è obbligatorio</p>
          </div>
          <!-------------------- Tasto ricerca --------------------->
          <router-link :to="{ name: 'search' }" @click="searchRequest()" class="buttonSearch">
            <i class="fa-solid fa-magnifying-glass"></i>
          </router-link>
        </div>
      </div>


      <!-- <p v-for="error in errors" class="paragrafo">{{ error }}</p> -->
    </nav>
  </header>
  <hr />
  <div class="apartmentsContainer">

    <div class="wrapper">

      <div class="apartmentCard" v-for="apartment in store.homepageContent" :key="apartment.id">
        <router-link :to="`/search/${apartment.title}`" class="text-dark">
          <img :src="apartment.image" width="100" class="cardImg" :alt="apartment.image" />
          <div class="cardText">
            <span class="apartmentTitle apartmentDetail">{{ apartment.title }}</span>
          </div>

        </router-link>
      </div>

    </div>

  </div>
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
  height: 5rem;
  width: 25vw;
  min-width: 16rem;
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
  font-size: 1.5rem;
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

/***** Stile cards *****/
.apartmentsContainer {
  margin: 2vw;
}
.wrapper {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 2vw;
}
.apartmentCard {
  width: 40rem;
  height: 30rem;
  border: 1px solid #8b8589;
  box-shadow: 0.7vw 0.7vw 1vw #8b8589;
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
}
.cardImg {
  width: 120%;
  object-fit: contain;
  border-radius: 2rem;
}
.cardText {
  position: absolute;
  bottom: 5%;
  left: 5%;
}
.apartmentDetail {
  padding: 0.5rem;
  color: white;
  opacity: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 1rem;
  font-size: 1.5;
  font-weight: 600;
}
.dettagli {
  display: flex;
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

hr {
  border: 1px solid #b3a49a;
  margin-top: 0;
}
#raggio {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 5px;
  outline: none;
  background: linear-gradient(to right,
      #91c2c5 var(--range-percentage),
      #e0e0e0 var(--range-percentage));
}

#raggio:hover {
  background: linear-gradient(to right,
      #91c2c5 var(--range-percentage),
      #cfcfcf var(--range-percentage));
}

/* Track personalizzato */
#raggio::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: linear-gradient(to right,
      #91c2c5 var(--range-percentage),
      #e0e0e0 var(--range-percentage));
  border-radius: 5px;
}

/* Thumb personalizzato */
#raggio::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #9f8d7c;
  /* Colore tortora */
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
