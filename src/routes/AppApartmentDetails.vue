<script>
import store from '../data/store.js';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import Appfooter from '../components/Appfooter.vue';

export default {
  name: 'AppApartmentDetail',

  components: {
    AppHeader,
    Appfooter,
  },

  data() {
    return {
      store,
      apartment: null,
      image: null,
      title: null,
      latitude: null,
      longitude: null,
      coordinateMaps: null,
      rooms: null,
      beds: null,
      bathrooms: null,
      services: null,
      address: null,
      dimension: null,
      apartment_id: null,
      errorEmail: null,
      errorText: null,
      sentMessage: false,

      emailUtente: null,
      nomeUtente: null,
      messaggioUtente: null,
      city: null,
    };
  },

  methods: {
    formatTitleWithSpaces(title) {
      return title.replace(/-/g, ' '); // Sostituisce solo i trattini con spazi
    },
    getImage(immagine) {
      if (immagine.startsWith('http')) {
        this.image = immagine;
      } else {
        this.image = `http://127.0.0.1:8000/storage/${immagine}`;
      }
    },
    updateMapCoordinates() {
      const lat = parseFloat(this.latitude);
      const lon = parseFloat(this.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        // Inizializza la mappa TomTom
        const map = tt.map({
          key: 'hQniyYGsdO6E3G6qs7tOGNX2wpgxFccZ', // Sostituisci con la tua API Key
          container: 'tomtom-map',
          center: [lon, lat],
          zoom: 12,
        });

        // Aggiungi un marker sulla mappa
        const marker = new tt.Marker().setLngLat([lon, lat]).addTo(map);
      } else {
        console.error('Latitudine o Longitudine non valide');
      }
    },

    isValidEmail(email) {
      // Regular expression for validating email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Test if the input matches the pattern
      return emailPattern.test(email);
    },
    sendMessage() {
      if (!this.emailUtente || !this.isValidEmail(this.emailUtente)) {
        this.errorEmail = 'inserire una mail valida';
        if (!this.messaggioUtente) {
          this.errorText = 'inserire un messaggio prima di inviare';
        }
      } else if (!this.messaggioUtente) {
        this.errorEmail = '';
        this.errorText = 'inserire un messaggio prima di inviare';
      } else {
        this.errorEmail = '';
        this.errorText = '';

        const data = {
          email: this.emailUtente,
          text: this.messaggioUtente,
          name: this.nomeUtente,
          apartment_id: this.apartment_id,
        };

        console.log(data);

        axios
          .post('http://127.0.0.1:8000/api/messages', data)
          .then((response) => {
            console.log('tutto riuscito');
            this.sentMessage = true;

            setTimeout(() => {
              this.sentMessage = false;
              this.emailUtente = '';
              this.nomeUtente = '';
              this.messaggioUtente = '';
            }, 2600);
          })
          .catch((error) => {
            console.log("Errore durante l'invio del messaggio:", error.response);
          });
      }
    },
    async sendVisitData() {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = ipResponse.data.ip;

        const data = {
          ip: ipAddress,
          apartmentId: this.apartment_id,
        };
        console.log(data);

        await axios
          .post('http://127.0.0.1:8000/api/statistics', data)
          .then((response) => {
            console.log('Dati inviati con successo:', response);
          })
          .catch((error) => {
            console.log(error.response);
          });
      } catch (error) {
        console.error("Errore nell'invio dei dati:", error);
      }
    },
    getAddressAfterLastComma(address) {
      const lastCommaIndex = address.lastIndexOf(',');
      if (lastCommaIndex !== -1) {
        return address.substring(lastCommaIndex + 1).trim();
      }
      return null;
    },
  },

  created() {
    const apartmentId = this.formatTitleWithSpaces(this.$route.params.title);
    console.log(this.$route.params.title);
    axios.get(`http://127.0.0.1:8000/api/apartments/${apartmentId}`).then((response) => {
      console.log(response.data.project);
      this.apartment = response.data.project;
      this.apartment_id = this.apartment.id;
      this.title = this.apartment.title;
      this.latitude = this.apartment.latitude;
      this.longitude = this.apartment.longitude;
      this.rooms = this.apartment.rooms;
      this.beds = this.apartment.beds;
      this.bathrooms = this.apartment.bathrooms;
      this.services = this.apartment.services;
      this.address = this.apartment.address_full;
      this.dimension = this.apartment.dimension_mq;
      this.getImage(this.apartment.image);
      this.updateMapCoordinates();

      this.sendVisitData();

      this.city = this.getAddressAfterLastComma(this.address);
      console.log('la città è ' + this.city);
    });
  },

  mounted() {},
};
</script>

<template>
  <div class="sugar">
    <div class="fixed">
      <AppHeader />
    </div>
    <div class="apartment-detail">
      <div class="container">
        <!-- Titolo e indirizzo -->
        <div class="text-end">
          <h1 class="display-4">{{ title }}</h1>
          <p class="text-muted"><i class="fa-solid fa-location-dot"></i> {{ address }}</p>
        </div>
        <div class="row">
          <!-- Immagine dell'appartamento -->
          <div class="col-lg-8 img-container mb-4">
            <img :src="image" class="img-apartment shadow" alt="Appartamento" />
          </div>

          <!-- info generali-->
          <div class="col-lg-4 d-flex flex-column justify-content-start mb-4">
            <h2 class="">
              {{ city }}, Italia. <br />
              Alloggio in affitto
            </h2>
            <h5 class="text-success mt-4">
              <i class="fa-solid fa-check-circle"></i> Le nostre strutture sono certificate
            </h5>
            <p class="text-muted">
              Garantiamo che tutte le nostre strutture sono conformi ai più alti standard di sicurezza e igiene.
            </p>

            <h5 class="text-primary mt-4"><i class="fa-solid fa-shield-alt"></i> Sicurezza e garanzia</h5>
            <p class="text-muted">
              <i class="fa-solid fa-handshake"></i> Prenotazioni sicure e garantite con politiche di cancellazione
              flessibili.
            </p>

            <h5 class="text-warning mt-4"><i class="fa-solid fa-star"></i> Esperienza a 5 stelle</h5>
            <p class="text-muted">
              Goditi un soggiorno indimenticabile nelle nostre strutture. Il comfort e la soddisfazione dei nostri
              ospiti sono la nostra priorità.
            </p>
          </div>
        </div>
        <!-- Dettagli appartamento -->
        <div class="row">
          <!-- Caratteristiche e servizi -->
          <div class="col-lg-8">
            <h3 class="mt-2">Caratteristiche</h3>
            <div class="d-flex flex-wrap mt-2">
              <span><i class="fa-solid fa-users"></i> {{ beds }} Ospiti</span>
              <span class="mx-2">&bull;</span>
              <span><i class="fa-solid fa-person-shelter"></i> {{ rooms }} Stanze </span>
              <span class="mx-2">&bull;</span>
              <span><i class="fa-solid fa-bath"></i> {{ bathrooms }} Bagni</span>
              <span class="mx-2">&bull;</span>
              <span><i class="fa-solid fa-ruler-combined"></i> Dimensione: {{ dimension }}mq</span>
            </div>
            <h3 class="mt-4">Servizi presenti</h3>
            <div class="d-flex flex-column mt-3 mb-4">
              <div v-for="servizio in store.servizi_bnb" class="m-1 d-flex align-items-center">
                <div class="rounded px-2 fs-5 servizi lg-show">
                  <span v-html="servizio.icon" class="ms-2"></span>
                  {{ servizio.description }}
                </div>
                <div class="rounded px-2 fs-5 servizi mobile-show">
                  <span v-html="servizio.icon" class="ms-2"></span>
                  {{ servizio.title }}
                </div>
              </div>
            </div>
          </div>

          <!-- Modulo di contatto -->
          <div class="col-lg-4">
            <div class="card shadow mt-3">
              <div v-show="sentMessage" class="blur">
                <div class="sentMessage">Messaggio inviato correttamente</div>
              </div>
              <div class="card-body">
                <h5 class="card-title text-center mb-4">Contatta l'host</h5>
                <form>
                  <div class="mb-3">
                    <label for="emailUtente" class="form-label">Email*</label>
                    <input
                      v-model="emailUtente"
                      type="email"
                      class="form-control"
                      id="emailUtente"
                      placeholder="Inserisci email valida"
                      required
                    />
                    <div class="error-text">{{ errorEmail }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="nomeUtente" class="form-label">Nome</label>
                    <input
                      v-model="nomeUtente"
                      type="text"
                      class="form-control"
                      id="nomeUtente"
                      placeholder="Inserisci il tuo nome"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="messaggioUtente" class="form-label">Messaggio*</label>
                    <textarea
                      v-model="messaggioUtente"
                      class="form-control"
                      id="messaggioUtente"
                      rows="4"
                      placeholder="Scrivi il tuo messaggio"
                      required
                    ></textarea>
                    <div class="error-text">{{ errorText }}</div>
                  </div>
                  <button type="button" @click="sendMessage" class="btn btn-primary w-100">Invia</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Mappa della struttura -->
        <div class="mt-5">
          <div class="map-container">
            <h4 class="title-map">Dove troverai la struttura</h4>
            <div class="shadow" id="tomtom-map"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Appfooter />
</template>

<style scoped>
.sugar {
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease; /* Imposta la durata della transizione */
}

.fade-enter, .fade-leave-to /* .fade-leave-active in Vue 2 */ {
  opacity: 0; /* Elemento trasparente all'inizio o alla fine */
}

textarea {
  height: 10em;
}

.container {
  padding-top: 5rem;
}

.fixed {
  background: linear-gradient(130deg, #ffd489a4, #8cd7f298);
  height: 4rem;
  position: fixed;
  z-index: 2;
  width: 100%;
  border-bottom: 2px solid #a09d9fc2;
  box-shadow: 0px 0px 20px 10px rgba(0, 0, 0, 0.711);
}

.img-container {
  height: 30rem;
}

.img-apartment {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.servizi {
  background-color: rgb(206, 240, 255);
  /* color: rgb(82, 68, 40); */
}

.map-container {
  width: 100%;
  max-width: 100%;
  height: 400px; /* Altezza fissa per la mappa */
  margin-bottom: 5rem; /* Margine sotto la mappa */
}

#tomtom-map {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.title-map {
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.mobile-show {
  display: none;
}

.card {
  position: relative;
}

.sentMessage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  text-align: center;
  background-color: rgba(129, 219, 129, 0.965);
  border-radius: 10px;
  font-weight: bold;
  font-size: 25px;
  box-shadow: 0px 0px 40px 20px;
  opacity: 0;
  animation: messageAnimation 2.6s ease forwards;
}

@keyframes messageAnimation {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@media screen and (max-width: 447px) {
  .mobile-show {
    display: unset;
  }

  .lg-show {
    display: none;
  }
}
</style>
