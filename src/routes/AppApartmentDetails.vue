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
      });
  },
};
</script>

<template>
  <div class="fixed">
    <AppHeader />
  </div>
  <div class="container apartment-detail">
    <div class="row">
      <div class="col-lg-6 mb-4">
        <img :src="image" class="img-fluid rounded shadow" alt="Appartamento" />
      </div>

      <div class="col-lg-6 h-100">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
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

    <h4 class="mt-3">Dove troverai la struttura</h4>
    <div class="row mt-1">
      <div class="col-lg-8 mb-4">
        <div class="ratio ratio-16x9">
          <iframe
            :src="coordinateMaps"
            class="rounded shadow"
            style="border: none"
            allowfullscreen
          ></iframe>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
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
                class="btn btn-primary w-100"
              >
                Invia
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed {
  background: linear-gradient(130deg, #fff6e7, #d1e6ed);
  height: 4rem;
  position: fixed;
  z-index: 1;
  width: 100%;
  border-bottom: 2px solid #a09d9fc2;
}

.apartment-detail {
  padding-top: 5rem;
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
</style>
