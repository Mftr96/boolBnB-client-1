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
      validCity: false,
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
      this.validCity = true;
    },

    timeoutShow() {
      setTimeout(() => {
        this.isActive = false;
      }, 150);
    },

    getLastWord(wordsString) {
      var arrayParole = wordsString.split(" ");
      return (arrayParole[arrayParole.length - 1]);
      // return arrayParole[arrayParole.length - 1];
    },

    searchRequest() {
    console.log(this.validCity);
    this.errors = [];
    if (this.validCity) {
      // Eseguito se l'input è valido
      // if (!this.inputIndirizzo) {
      //   this.visible = true;
      //   // this.store.searchApartment = [];
      // } else {
      //   this.visible = false;
      //   axios
      //     .get(
      //       `https://api.tomtom.com/search/2/geocode/${this.inputIndirizzo}.json?key=RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu&countrySet=IT`
      //     )
      //     .then((response) => {
      //       this.coordinates = response.data.results[0].position;
      //       console.log(this.searchData);
  
      //       this.$router.push({
      //         name: 'search',
      //         query: {
      //           indirizzo: this.inputIndirizzo,
      //           latitude: this.coordinates.lat,
      //           longitude: this.coordinates.lon,
      //           radius: this.inputRaggio,
      //           beds: this.inputLetti,
      //           rooms: this.inputCamere,
      //           services: this.inputServizi.join(','),
      //         },
      //       });
  
      //       const url = `http://127.0.0.1:8000/api/search?latitude=${this.coordinates.lat
      //         }&longitude=${this.coordinates.lon}&radius=${this.inputRaggio
      //         }&beds=${this.inputLetti}&rooms=${this.inputCamere
      //         }&services=${this.inputServizi.join(',')}`;
  
      //       console.log(url);
  
      //       axios
      //         .get(url)
      //         .then((response) => {
      //           this.store.searchApartment = response.data.results;
      //           console.log(response);
      //           this.errors = response.data.errors.rooms;
      //         })
      //         .catch((error) => {
      //           console.log('errore');
      //         });
      //     });
      // }

    }
    else {
      //Eseguito se l'input non è valido
      document.getElementById("errNoCittà").setAttribute("style", "display: block;")
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
    <div class="container">
      <div class="search-container">
        <div class="search-bar">
          <!-------------------- Input città --------------------->
          <div class="suggerimenti-indirizzo">
            <input class="" id="indirizzo" list="suggestion" type="text" placeholder="Inserisci una città"
              v-model="inputIndirizzo" @focus="isActive = true" @blur="timeoutShow" autocomplete="off" />
            <ul v-show="apiSuggestions.length > 0 && isActive == true">
              <li @click="writeAddress(singleAddress, $event)" v-for="(singleAddress, i) in apiSuggestions">
                <i class="fa-solid fa-location-dot"></i>
                <span>{{ singleAddress }}</span>
              </li>
            </ul>
            <p v-show="visible" class="paragrafo">Inserisci una città</p>
          </div>
          <!-------------------- Tasto ricerca --------------------->
          <router-link :to="{ name: 'search' }" @click="searchRequest()" class="buttonSearch">
            <i id="searchIcon" class="fa-solid fa-magnifying-glass"></i>
          </router-link>
        </div>
      </div>
      <p id="errNoCittà">Seleziona una città trà i suggerimenti di ricerca.</p>
    </div>
  </header>
  <hr />
  <div class="apartmentsContainer" :class="{ 'opacity-zero': isLoading }">

    <div class="apartmentsWrapper">

      <div class="apartmentCard" v-for="apartment in store.homepageContent" :key="apartment.id">
        <router-link :to="`/search/${apartment.title}`" class="text-dark">
          <img :src="apartment.image" width="100" class="cardImg" :alt="apartment.image" />
          <div class="cardText">
            <div class="detailContainer">
              <span class="apartmentTitle apartmentDetail">{{ apartment.title }}</span>
            </div>
            <div class="detailContainer">
              <i class="fa-solid fa-map-location-dot"></i>
              <span class="apartmentDetail">{{ getLastWord(apartment.address_full) }}</span>
            </div>
            <div class="detailContainer">
              <i class="fas fa-door-open"></i>
              <span class="apartmentDetail">{{ apartment.rooms }}</span>
            </div>
            <div class="detailContainer">
              <i class="fa-solid fa-shower"></i>
              <span class="apartmentDetail">{{ apartment.bathrooms }}</span>
            </div>
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
  
  min-width: 18rem;
  background-color: white;
  border-radius: 30px;
  padding: 0.2rem 1rem 0.2rem 1rem;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  margin-bottom: 0.5rem;
}
#indirizzo {
  margin-right: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  line-height: 70px;
  min-width: 12rem;
  width: 28vw;
  flex-grow: 0;
  font-size: 1.3rem;
  border-radius: 1rem;
}
.buttonSearch {
  background-color: rgb(0, 0, 0);
  border-radius: 25px;
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.suggerimenti-indirizzo {
  display: flex;
  position: relative;
}

.suggerimenti-indirizzo i {
  font-size: 40px;
  padding: 0.5rem;
}
#errNoCittà {
  display: none;
  /* position: fixed; */
  color: red;
  border: 1px solid red;
  border-radius: 0.5rem;
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
  margin: 2vw auto;
  width: 90vw;
}

.apartmentsWrapper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2vw;
  width: 100%;
  padding: 0;
  margin: 0;
}

.apartmentCard {
  width: 33rem;
  height: 25rem;
  border: 1px solid #8b8589;
  box-shadow: 0.7vw 0.7vw 1vw #8b8589;
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  transition: 0.4s;
}

.apartmentCard:hover {
  transform: translate3d(-5px, -5px, 0);
  border: 1px solid #000000;
}

.cardImg {
  width: 120%;
  object-fit: contain;
  border-radius: 2rem;
}

.cardText {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  display: flex;
  justify-content: space-around;
  flex-grow: 0;
}

.detailContainer {
  height: 50px;
  padding: 0 0.3rem;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 25px;
  margin: 0 1rem 1rem 0;
}

.apartmentDetail {
  padding: 0.5rem;
  opacity: 100%;
  border-radius: 1rem;
  font-size: 1.5;
  font-weight: 600;
}

.dettagli {
  display: flex;
}

a {
  text-decoration: none;
  color: rgb(255, 255, 255);
}

a i {
  margin-right: -0.8rem;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: 0.5s;
}

/* Altri stili */
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
#searchIcon {
  color: #ffffff;
  background-color: #d8cfc4;
}
#searchIcon:hover {
  background-color: #b3a49a;
}

/* Stili per caricamento */
.opacity-zero {
  opacity: 0;
}
</style>
