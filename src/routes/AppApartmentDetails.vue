<script>
import store from '../data/store.js';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';

export default {
  name: 'AppApartmentDetail',

  components: {
    AppHeader,
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

      emailUtente: null,
      nomeUtente: null,
      messaggioUtente: null,
    };
  },

  methods: {
    getImage(immagine) {
      if (immagine.startsWith('http')) {
        this.image = immagine;
      } else {
        this.image = `http://127.0.0.1:8000/storage/${immagine}`;
      }
    },
    updateMapCoordinates() {
      const margin = 0.002;
      const lat = parseFloat(this.latitude);
      const lon = parseFloat(this.longitude);

      if (!isNaN(lat) && !isNaN(lon)) {
        const bbox = `${(lon - margin).toFixed(6)},${(lat - margin).toFixed(
          6
        )},${(lon + margin).toFixed(6)},${(lat + margin).toFixed(6)}`;
        this.coordinateMaps = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        console.log(this.longitude + ' ' + this.latitude + ' ' + bbox);
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
          })
          .catch((error) => {
            console.log(
              "Errore durante l'invio del messaggio:",
              error.response
            );
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

        //   await axios.post('URL_DEL_TUO_BACKEND', data);
        //   console.log('Dati inviati con successo:', data);
      } catch (error) {
        console.error("Errore nell'invio dei dati:", error);
      }
    },
  },

  created() {
    const apartmentId = this.$route.params.title;
    axios
      .get(`http://127.0.0.1:8000/api/apartments/${apartmentId}`)
      .then((response) => {
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
        console.log(this.apartment);

        this.sendVisitData();
      });
  },

  mounted() {},
};
</script>

<template>
  <div class="fixed">
    <AppHeader />
  </div>
  <div class="apartment-detail">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 mb-4 relative">
          <img class="absolute" width="80px" src="/pin.png" alt="" />

          <img
            :src="image"
            class="img-fluid rounded piegata"
            alt="Appartamento"
          />
        </div>
        <div class="col-lg-6 h-100">
          <div class="card h-100 shadow-sm relative">
            <img class="absolute left" width="80px" src="/pin5.png" alt="" />
            <div class="card-body piegata-destra">
              <h1 class="card-title display-5">{{ title }}</h1>
              <p class="card-text text-muted">
                <i class="fa-solid fa-location-dot"></i> {{ address }}
              </p>
              <ul class="list-unstyled mb-4">
                <li>
                  <i class="fa-solid fa-person-shelter"></i> Stanze: {{ rooms }}
                </li>
                <li><i class="fa-solid fa-bed"></i> Posti letto: {{ beds }}</li>
                <li><i class="fa-solid fa-bath"></i> Bagni: {{ bathrooms }}</li>
                <li>
                  <i class="fa-solid fa-ruler-combined"></i> Dimensione (Mq):
                  {{ dimension }}
                </li>
              </ul>

              <h5 class="mt-4">Servizi presenti</h5>
              <div class="d-flex flex-wrap">
                <span
                  v-for="servizio in store.servizi_bnb"
                  class="badge bg-light text-dark m-1 d-flex align-items-center"
                >
                  <span v-html="servizio.icon" class="ms-2"> </span>
                  {{ servizio.title }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="relative mt-5">
        <div class="row mt-1">
          <div class="col-lg-8 mb-4 relative">
            <img
              class="absolute pin-mappa"
              width="80px"
              src="/pin3.png"
              alt=""
            />
            <div class="ratio ratio-16x9 piegata maps">
              <h4 class="mt-3 title-map">Dove troverai la struttura</h4>
              <iframe
                :src="coordinateMaps"
                class=""
                style="border: none"
                allowfullscreen
              ></iframe>
            </div>
          </div>

          <div class="col-lg-4 relative">
            <img
              class="absolute contatti"
              width="80px"
              src="/pin4.png"
              alt=""
            />
            <div class="card piegata">
              <div class="card-body rounded-2">
                <h5 class="card-title text-center mb-4">Contatta l'host</h5>
                <form>
                  <div class="mb-3 error">
                    <div class="error-text">{{ errorEmail }}</div>
                    <label for="emailUtente" class="form-label">Email*</label>
                    <input
                      v-model="emailUtente"
                      type="email"
                      class="form-control"
                      id="emailUtente"
                      placeholder="Inserisci email valida"
                      required
                    />
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
                  <div class="mb-3 error">
                    <div class="error-text">{{ errorText }}</div>
                    <label for="messaggioUtente" class="form-label"
                      >Messaggio*</label
                    >
                    <textarea
                      v-model="messaggioUtente"
                      class="form-control"
                      id="messaggioUtente"
                      rows="4"
                      placeholder="Scrivi il tuo messaggio"
                      required
                    ></textarea>
                  </div>
                  <p class="text-muted small">
                    I campi contrassegnati con * sono obbligatori
                  </p>
                  <button
                    type="button"
                    @click="sendMessage"
                    class="btn btn-colore w-100"
                  >
                    Invia
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1600px;
}

.fixed {
  /* background: linear-gradient(130deg, #fff6e7, #d1e6ed); */
  background: linear-gradient(130deg, #c3b49ba4, #94a7ae98);
  height: 4rem;
  position: fixed;
  z-index: 2;
  width: 100%;
  border-bottom: 2px solid #a09d9fc2;
}

.apartment-detail {
  padding-top: 8rem;
  background: linear-gradient(to bottom right, #d8cfc4, #f9f9f9 50%, #a0d8ef);
  z-index: 1;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
}

.card {
  background-color: transparent;
  border: none;
}

.card-body {
  background-color: white;
}

.card-title {
  color: #333;
}
.badge {
  font-size: 0.9rem;
}
.ratio iframe {
  width: 100%;
  height: 100%;
}

.error {
  position: relative;
}

.error-text {
  color: red;
  position: absolute;
  left: 30%;
  font-size: 1rem;
  line-height: 1rem;
}

.relative {
  position: relative;
  perspective: 500px;
}

.absolute {
  position: absolute;
  left: 60%;
  top: -5%;
  z-index: 1;
}

.piegata {
  transform: rotate(-2deg);
  box-shadow: 10px 10px 10px 5px;
  border-radius: 10px;
}

.piegata-destra {
  transform: rotate(3deg);
  box-shadow: 10px 10px 10px 5px;
  border-radius: 10px;
}

.contatti {
  top: -8%;
  left: 70%;
}

.pin-mappa {
  top: -12%;
  left: 30%;
}

.left {
  left: 20%;
  top: -14%;
}

.maps {
  transform: rotate(3deg);
}

.title-map {
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(159, 145, 133);
  display: inline-block;
  padding: 0.3rem 1rem;
  position: absolute;
  z-index: 3;
  left: 10%;
  border-radius: 10px;
  width: 20rem;
  height: 3rem;
}

.btn-colore {
  background-color: rgb(209, 189, 173);
}

.btn-colore:hover {
  background-color: rgb(159, 145, 133);
}
</style>
