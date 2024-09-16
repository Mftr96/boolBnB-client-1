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
      showServices: false,
      showFilter: false,
      showFilterMobile: false,
      showFilterTablet: false,
      noneApartment: false,
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
    searchRequestMobile() {
      this.searchRequest();
      this.showFilterMobile = !this.showFilterMobile;
    },

    searchRequestTablet() {
      this.searchRequest();
      this.showFilterTablet = !this.showFilterTablet;
    },

    filterToggle() {
      if (this.showFilter == false) {
        this.showFilter = true;
      } else {
        setTimeout(() => {
          this.showFilter = false;
        }, 300);
      }

      if (this.showServices == true) {
        this.showServices = false;
      } else {
        setTimeout(() => {
          this.showServices = true;
        }, 300);
      }
    },

    filterToggleMobile() {
      this.showFilterMobile = !this.showFilterMobile;
      console.log(this.showFilterMobile);
    },

    filterToggleTablet() {
      this.showFilterTablet = !this.showFilterTablet;
    },

    updateRangeBackground() {
      const min = 1;
      const max = 100;
      const percentage = ((this.inputRaggio - min) / (max - min)) * 100;

      document.documentElement.style.setProperty('--range-percentage', `${percentage}%`);
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
      const url_tomtom = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(indirizzo)}.json?key=${
        this.apiKey
      }&typeahead=true&limit=5&countrySet=IT`;

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

            const url = `http://127.0.0.1:8000/api/search?latitude=${this.coordinates.lat}&longitude=${
              this.coordinates.lon
            }&radius=${this.inputRaggio}&beds=${this.inputLetti}&rooms=${
              this.inputCamere
            }&services=${this.inputServizi.join(',')}`;

            console.log(url);

            axios
              .get(url)
              .then((response) => {
                this.store.searchApartment = response.data.results;
                console.log(response);
                this.errors = response.data.errors.rooms;
                console.log(this.noneApartment);
              })
              .catch((error) => {
                console.log('errore');
              });
          });
      }
    },
    loadData() {
      setTimeout(() => {
        this.inputIndirizzo = this.$route.query.indirizzo;
        this.inputCamere = this.$route.query.rooms ? this.$route.query.rooms : 1;
        this.inputLetti = this.$route.query.beds ? this.$route.query.beds : 1;
        this.inputRaggio = this.$route.query.radius ? this.$route.query.radius : 20;
        if (this.$route.query.services) {
          this.inputServizi = this.$route.query.services.split(',').map(Number);
        }
      }, 200);
    },
  },
  mounted() {
    this.updateRangeBackground();
    this.loadData();
  },
};
</script>

<template>
  <div class="blur" :class="{ 'filter-show-background': showFilterTablet }"></div>
  <!----------------------------------- filtri tablet ----------------------------------->
  <div class="filter-side-tablet" :class="{ 'filter-show': showFilterTablet }">
    <div @click="filterToggleTablet()" class="close d-flex align-items-center">
      <i class="fa-solid fa-chevron-left back"></i>
      <div class="titolo-filtri text-center">Filtri di ricerca</div>
    </div>
    <div class="row pt-3">
      <div class="hr-style col-6">
        <!-------------------- stanze --------------------->
        <div class="mobile mt-4 d-flex flex-column justify-content-center">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-number" for="numero-stanze">Stanze</label>
            <div class="d-flex">
              <button @click="minusButtonStanze()" class="button-minus">
                <i class="fa-solid fa-minus"></i>
              </button>
              <input id="numero-stanze" step="1" min="1" type="number" v-model="inputCamere" readonly />
              <button @click="plusButtonStanze()" class="button-plus">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <hr />
        <!-------------------- posti letto --------------------->
        <div class="mobile d-flex flex-column pb-2">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-number" for="numero-letti">Posti letto</label>
            <div class="d-flex">
              <button @click="minusButtonLetti()" class="button-minus">
                <i class="fa-solid fa-minus"></i>
              </button>
              <input id="numero-letti" step="1" min="1" type="number" v-model="inputLetti" readonly />
              <button @click="plusButtonLetti()" class="button-plus">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <hr />
        <!-------------------- raggio ricerca --------------------->
        <div class="mobile mt-3 d-flex justify-content-between align-items-center">
          <label class="label-range label-number" for="raggio">Raggio di ricerca</label>
          <div class="d-flex flex-column justify-content-between align-items-center">
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
        </div>
      </div>
      <div class="col-6">
        <div class="text-center mb-2">Servizi:</div>
        <!-------------------- Elenco servizi --------------------->
        <div class="d-flex flex-wrap gap-2 justify-content-center pb-2">
          <div v-for="(servizio, i) in store.servizi_bnb" class="servizi-mobile mb-1">
            <input v-model="inputServizi" class="" type="checkbox" :id="i" :value="i + 1" style="display: none" />
            <label class="servizi" :for="i">
              <span v-html="servizio.icon"></span>
              {{ servizio.title }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <!-------------- Bottone di ricerca ----------------->
    <div class="d-flex justify-content-center mt-3">
      <router-link :to="{ name: 'search' }" @click="searchRequestTablet()" class="buttonSearchFilter">
        Applica filtri
      </router-link>
    </div>
  </div>

  <!-------------------------------------- filtri mobile ---------------------------------------------->
  <div class="filter-side-mobile" :class="{ 'filter-show-mobile': showFilterMobile }">
    <div class="d-flex flex-column pt-3">
      <div class="hr-style">
        <div @click="filterToggleMobile()" class="close d-flex align-items-center">
          <i class="fa-solid fa-chevron-left back"></i>
          <div class="titolo-filtri text-center">Filtri di ricerca</div>
        </div>

        <!-------------------- stanze --------------------->
        <div class="mobile mt-4 d-flex flex-column justify-content-center">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-number" for="numero-stanze">Stanze</label>
            <div class="d-flex">
              <button @click="minusButtonStanze()" class="button-minus">
                <i class="fa-solid fa-minus"></i>
              </button>
              <input id="numero-stanze" step="1" min="1" type="number" v-model="inputCamere" readonly />
              <button @click="plusButtonStanze()" class="button-plus">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <hr />
        <!-------------------- posti letto --------------------->
        <div class="mobile d-flex flex-column pb-2">
          <div class="d-flex justify-content-between align-items-center">
            <label class="label-number" for="numero-letti">Posti letto</label>
            <div class="d-flex">
              <button @click="minusButtonLetti()" class="button-minus">
                <i class="fa-solid fa-minus"></i>
              </button>
              <input id="numero-letti" step="1" min="1" type="number" v-model="inputLetti" readonly />
              <button @click="plusButtonLetti()" class="button-plus">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <hr />
        <!-------------------- raggio ricerca --------------------->
        <div class="mobile mt-3 d-flex justify-content-between align-items-center">
          <label class="label-range label-number" for="raggio">Raggio di ricerca</label>
          <div class="raggio-h d-flex flex-column justify-content-between align-items-center">
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
        </div>
      </div>
      <hr />
      <!--------------------- servizi --------------------->
      <div class="">
        <div class="mb-2 label-number mt-3 mb-3">Servizi:</div>
        <!-------------------- Elenco servizi --------------------->
        <div class="d-flex flex-wrap gap-2 justify-content-start pb-2">
          <div v-for="(servizio, i) in store.servizi_bnb" class="servizi-mobile mb-1">
            <input v-model="inputServizi" class="" type="checkbox" :id="i" :value="i + 1" style="display: none" />
            <label class="servizi" :for="i">
              <span v-html="servizio.icon"></span>
              {{ servizio.title }}
            </label>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <!-------------- Bottone di ricerca ----------------->
    <div class="d-flex justify-content-center mt-3">
      <router-link :to="{ name: 'search' }" @click="searchRequestMobile()" class="buttonSearchFilter">
        Applica
      </router-link>
    </div>
  </div>

  <!--------------------------------------- filtri desktop -------------------------------------------->
  <div class="fixed">
    <div class="sugar">
      <AppHeader />
      <div class="app-search-filters">
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
                  placeholder="Inserisci un indirizzo"
                  v-model="inputIndirizzo"
                  @focus="isActive = true"
                  @blur="timeoutShow"
                  @keyup.enter="searchRequest"
                  autocomplete="off"
                />
                <ul v-show="apiSuggestions.length > 0 && isActive == true">
                  <li @click="writeAddress(singleAddress, $event)" v-for="(singleAddress, i) in apiSuggestions">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{{ singleAddress }}</span>
                  </li>
                </ul>
                <p v-show="visible" class="paragrafo">L'indirizzo è obbligatorio</p>
              </div>
              <!-------------------- stanze --------------------->
              <div class="desktop-show d-flex flex-column justify-content-center">
                <label class="label-number" for="numero-stanze">Stanze</label>
                <div class="number-logic">
                  <button @click="minusButtonStanze()" class="button-minus">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <input id="numero-stanze" step="1" min="1" type="number" v-model="inputCamere" readonly />
                  <button @click="plusButtonStanze()" class="button-plus">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>

              <!-------------------- posti letto --------------------->
              <div class="desktop-show d-flex flex-column justify-content-center">
                <label class="label-number" for="numero-letti">Posti letto</label>
                <div class="number-logic">
                  <button @click="minusButtonLetti()" class="button-minus">
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <input id="numero-letti" step="1" min="1" type="number" v-model="inputLetti" readonly />
                  <button @click="plusButtonLetti()" class="button-plus">
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
              <!-------------------- raggio ricerca --------------------->
              <div class="desktop-show d-flex flex-column justify-content-center">
                <label class="label-range label-number" for="raggio">Raggio di ricerca</label>
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
              <router-link :to="{ name: 'search' }" @click="searchRequest()" class="buttonSearch">
                <i class="fa-solid fa-magnifying-glass"></i>
              </router-link>
            </div>

            <!------------------ Bottoni filtri Desktop---------------------->
            <div @click="filterToggle()" class="filters"><i class="fa-solid fa-sliders ms-2"></i> Filtri</div>
            <!------------------ Bottoni filtri Mobile ---------------------->
            <div @click="filterToggleMobile()" class="filters-mobile">
              <i class="fa-solid fa-sliders ms-2"></i> Filtri
            </div>
            <!------------------ Bottoni filtri Tablet---------------------->
            <div @click="filterToggleTablet()" class="filters-tablet">
              <i class="fa-solid fa-sliders ms-2"></i>Filtri
            </div>
          </div>

          <!-------------------- Elenco servizi --------------------->
          <div class="elenco-servizi d-flex gap-1 justify-content-between" :class="{ 'filter-height': showFilter }">
            <div v-for="(servizio, i) in store.servizi_bnb">
              <input v-model="inputServizi" class="" type="checkbox" :id="i" :value="i + 1" style="display: none" />
              <label
                @click="searchRequest()"
                class="servizi"
                :for="i"
                :class="{
                  'servizi-show': showServices,
                  'servizi-unset': showFilter,
                }"
              >
                <span v-html="servizio.icon"></span>
                {{ servizio.title }}
              </label>
            </div>
          </div>
        </nav>
      </div>
      <hr />
    </div>
  </div>
</template>

<style scoped>
.blur {
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.531);
  position: fixed;
  display: none;
  z-index: 4;
}

.filters,
.filters-mobile,
.filters-tablet {
  border: 3px solid #ffffff;
  color: white;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  height: 4rem;
  margin-left: 1rem;
  margin-bottom: 0.4rem;
  /* display: none; */
  background-color: rgb(203, 197, 197);
  text-align: center;
  padding: 0rem 1rem 0 5rem;
  transform: translateX(-5.5rem) translateY(-1px);
  cursor: pointer;
}

.filters-mobile,
.filters-tablet {
  display: none;
}

.filter-side-tablet,
.filter-side-mobile {
  background-color: #ffffff;
  z-index: 5;
  transition: 0.3s ease-in-out;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;
  position: fixed;
  opacity: 0;
  transform: scale(0%);
}

.filter-side-tablet {
  width: 45rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0%);
  border-radius: 10px;
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.353);
  overflow: hidden;
}

.filter-side-mobile {
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding-top: 0 !important;
}

.filter-show {
  opacity: 100;
  transform: translate(-50%, -50%) scale(100%);
}

.filter-show-background {
  display: unset;
}

.filter-show-mobile {
  opacity: 100;
  transform: scale(100%);
}

input {
  all: unset;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.fixed {
  width: 100%;
  position: fixed;
  z-index: 1;
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.466);
}

.sugar {
  /* background: linear-gradient(130deg, #c3b49ba4, #94a7ae98); */
  background: linear-gradient(130deg, #ffd489a4, #8cd7f298);
}

.app-search-filters {
  width: 100%;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
}

.container {
  position: relative;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
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
  z-index: 3;
  position: relative;
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

.buttonSearchFilter {
  border: 2px solid white;
  background-color: rgb(59, 180, 245);
  border-radius: 40px;
  margin: 0.4px 0;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}

#indirizzo {
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 150px;
  transition: 0.5s;
  border: 1px solid rgba(179, 164, 154, 0);
  border-radius: 2rem;
}

.suggerimenti-indirizzo {
  display: flex;
  position: relative;
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
  margin-left: 5px;
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
  padding: 0.2rem 0.3rem;
  border-radius: 20px;
  cursor: pointer;
  background-color: white;
  transition: 0.3s ease;
  opacity: 0;
  display: none;
}

.servizi-show {
  opacity: 100;
}

.servizi-unset {
  display: unset;
}

.elenco-servizi {
  margin-top: 0.5rem;
  height: 0;
  transition: 0.3s ease;
}

.filter-height {
  height: 2rem;
}

.servizi:hover {
  border-color: #8b8589;
}

input[type='checkbox']:checked + .servizi {
  border-color: #8b8589;
  transform: translateY(-3px);
  /* box-shadow: 0px 3px 4px 0px #464646; */
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
  background-color: #33d0f3;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transition: 0.5s;
}

a i:hover {
  background-color: #36afcb;
}

hr {
  border: 1px solid #b3a49a;
  margin-top: 0;
  margin-bottom: 0;
  width: 100%;
}

/* range input style */
#raggio {
  -webkit-appearance: none;
  appearance: none;
}

#raggio::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: linear-gradient(to right, #33d0f3 var(--range-percentage), #e0e0e0 var(--range-percentage));
  border-radius: 5px;
}

#raggio::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: #206879;
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

@-moz-document url-prefix() {
  .button-plus,
  .button-minus {
    border: 2px solid #d8cfc4;
    background-color: white;
    border-radius: 50%;
    position: absolute;
    transition: 0.5s;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
  }
}
@media screen and (max-width: 1400px) {
  .filters {
    display: none;
  }

  .filters-tablet {
    display: flex;
  }

  .elenco-servizi {
    display: none !important;
  }
  .filter-side-mobile,
  .filter-side {
    padding-top: calc(53px + 88.38px);
  }
  .filter-show {
    font-size: 1rem;
  }
  .search-bar {
    margin-left: 5rem;
  }

  .servizi:hover {
    border-color: white;
  }

  .servizi {
    display: unset;
    opacity: 100;
    background-color: #eee6e0;
  }

  .desktop-show {
    display: none !important;
  }

  .search-bar {
    width: 30rem;
    justify-content: space-between;
  }

  #indirizzo {
    width: 24rem;
  }

  #numero-stanze,
  #numero-letti {
    width: 20px;
    margin-left: 5px;
    padding: 5px;
  }

  .button-minus,
  .button-plus {
    position: unset;
    height: 30px;
    width: 30px;
  }

  .hr-style hr {
    margin: 0.5rem 0;
  }

  .back {
    margin-right: 0.5rem;
    font-size: 30px;
  }

  .close {
    background-color: rgb(68, 181, 230);
    /* background: linear-gradient(130deg, #a0885d99, #4f778598); */
    margin: 0 -1rem;
    padding: 1rem;
    color: white;
    box-shadow: 0 1px 10px 2px rgba(0, 0, 0, 0.369);
  }
}

@media screen and (max-width: 768px) {
  .filter-show {
    font-size: 1.5rem;
  }

  .filters-tablet {
    display: none;
  }

  .elenco-servizi {
    display: none !important;
  }
  .filters-mobile {
    display: flex;
  }
  .button-minus,
  .button-plus {
    position: unset;
    height: 40px;
    width: 40px;
  }
  .servizi-mobile {
    font-size: 1.5rem;
  }

  .app-search-filters {
    padding-bottom: 0;
  }

  #indirizzo {
    width: 10rem;
  }

  .raggio-h {
    padding: 1rem 0;
  }

  .titolo-filtri {
    font-size: 30px;
    color: #ffffff;
    font-weight: 500;
  }

  .label-number {
    font-size: 30px;
    color: #656264;
  }

  .close {
    margin: -1rem;
  }

  .buttonSearchFilter {
    font-size: 30px;
  }
}
@media screen and (max-width: 400px) {
  .filter-side-mobile {
    height: 105vh;
  }
  .label-number {
    font-size: 20px;
  }
  .titolo-filtri {
    font-size: 25px;
  }
  .servizi-mobile {
    font-size: 1rem;
  }
}
</style>
