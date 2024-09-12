<script>
import axios from 'axios';
import store from '../data/store.js';
import { RouterLink } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';

export default {
  name: 'AppSearchFilters',

  components: {
    AppHeader,
  },

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
      newInputIndirizzo: '',
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
    moveBackgroundImage(event) {
      console.log(event.clientX, event.clientY);
      const container = document.querySelector('#searchWrapper');
      const imageContainer = document.querySelector('#searchBGContainer');
      const rect = container.getBoundingClientRect();
      // Calculate the scroll position based on mouse movement
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      console.log(rect.left, rect.width);
      console.log(rect.top, rect.height);
      console.log(x, y);
      // Adjust the scrolling speed
      const scrollX = x * 1500;
      const scrollY = y * 0;
      // Combine scaling and translation transformations
      // Adjust the scroll position to allow continuous scrolling towards the left
      const offsetX = scrollX > 0 ? Math.floor(scrollX % 2000) : Math.ceil(scrollX % 2000);

      imageContainer.style.transform = `translate(-${offsetX}px, -${scrollY}px)`;
    },

    getImage(immagine) {
      if (immagine.startsWith('http')) {
        return immagine;
      } else {
        return `http://127.0.0.1:8000/storage/${immagine}`;
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
      )}.json?key=${this.apiKey
        }&typeahead=true&limit=5&countrySet=IT&entityTypeSet=Municipality`;

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
      var arrayParole = wordsString.split(' ');
      return arrayParole[arrayParole.length - 1];
      // return arrayParole[arrayParole.length - 1];
    },

    searchRequest() {
      console.log(this.validCity);
      this.errors = [];
      if (this.validCity) {
        // Eseguito se l'input è valido
        if (!this.inputIndirizzo) {
          this.visible = true;
          // this.store.searchApartment = [];
        } else {
          this.store.noApartment = false;
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
                }&longitude=${this.coordinates.lon}&radius=20.join(',')}`;

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
  <div class="fixed">
    <AppHeader />
  </div>
  <div id="searchContainer">
    <div id="searchWrapper">
      <!-- @mousemove="moveBackgroundImage" -->

      <div id="searchBGContainer">

      </div>

      <div id="searchbarContainer">
        <div id="searchBar">
          <!-------------------- Input città --------------------->
          <div class="suggerimenti-indirizzo">
            <input class="" id="indirizzo" list="suggestion" type="text" placeholder="Inserisci una città"
              v-model="inputIndirizzo" @focus="isActive = true" @blur="timeoutShow" autocomplete="off" />
            <ul v-show="apiSuggestions.length > 0 && isActive == true">
              <li @click="writeAddress(singleAddress, $event)" v-for="(singleAddress, i) in apiSuggestions">
                <i class="fa-solid fa-location-dot"></i>
                <router-link :to="{ name: 'search' }" @click="searchRequest()" class="buttonSearch">
                  <span>{{ singleAddress }}</span>
                </router-link>
              </li>
            </ul>
            <p v-show="visible" class="paragrafo">Inserisci una città</p>
          </div>
        </div>
      </div>
      <p id="errNoCittà">Seleziona una città trà i suggerimenti di ricerca.</p>
    </div>
  </div>

  <section id="apartmentsArea">
    <p id="titoloSezioneCards">Appartamenti in rilievo:</p>
    <div class="apartmentsContainer" :class="{ 'opacity-zero': isLoading }">

      <div class="apartmentsWrapper">

        <div class="apartmentCard" v-for="apartment in store.homepageContent" :key="apartment.id">
          <router-link :to="`/search/${apartment.title}`" class="text-dark">
            <img :src="getImage(apartment.image)" width="100" class="cardImg" :alt="apartment.image" />
            <div class="cardText">
              <div class="detailContainer">
                <span class="apartmentDetail" id="apartmentTitle">{{ apartment.title }}</span>
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
  </section>
</template>




<style scoped>
.fixed {
  background: linear-gradient(130deg, #c3b49ba4, #94a7ae98);
  height: 4rem;
  position: fixed;
  z-index: 999;
  width: 100%;
  border-bottom: 2px solid #a09d9fc2;
}

input {
  all: unset;
}

#searchContainer {
  height: 40rem;
  margin: 4rem 0 0 0;
  width: 100%;
}

#searchWrapper {
  position: relative;
  overflow: visible;
  padding: calc(20rem - 2.5rem) 0 calc(20rem - 2.5rem) 0;
  margin: 0;
}

#searchBGContainer {
  position: fixed;
  top: -180px;
  left: 0%;
  width: 2000px;
  height: 100vh;
  background-image: url('/public/apartment_background1.jpg');
  background-size: cover;
  transform: scale(1.5);
  transition: transform 0.2s;
}

#searchbarContainer {
  display: flex;
  justify-content: center;
}

#searchBar {
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
  z-index: 10;
}
#searchBar:hover {
  border: 1px solid #b3a49a;
}

#indirizzo {
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
#apartmentsArea {
  position: relative;
  z-index: 1;
}

#titoloSezioneCards {
  position: relative;
  margin: 0 auto;
  height: 4rem;
  width: 25rem;
  color: #6e6259;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 2rem;
  color: black;
}

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
  height: 23rem;
  border: 1px solid #8b8589;
  box-shadow: 0.7vw 0.7vw 1vw #8b8589;
  position: relative;
  border-radius: 2rem;
  overflow: hidden;
  transition: 0.4s;
}

@media screen and (max-width: 700px) {
  .apartmentCard {
    width: 25rem;
    height: 18rem;
  }
}

.apartmentCard:hover {
  transform: translate3d(-5px, -5px, 0);
  border: 1px solid #000000;
}

.cardImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2rem;
}

.cardText {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  flex-grow: 0;
  width: 100%;
}

#apartmentTitle {
  text-align: center;
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
