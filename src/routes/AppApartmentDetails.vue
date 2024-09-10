<script>
import store from '../data/store.js';
import axios from 'axios';
import { RouterLink } from 'vue-router';

export default {
	name: 'AppApartmentDetail',

	components: {},

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
		sendMessage() {
			const data = {
				email: this.emailUtente,
				text: this.messaggioUtente,
				name: this.nomeUtente,
				apartment_id: this.$route.params.id
			}

			console.log(data)

			axios.post('http://127.0.0.1:8000/api/messages', data).then((response) => {
				console.log('tutto riuscito')
			}).catch((error) => {
				console.log('Errore durante l\'invio del messaggio:', error.response);
			})
		}
	},

	created() {
		const apartmentId = this.$route.params.id;
		axios
			.get(`http://127.0.0.1:8000/api/apartments/${apartmentId}`)
			.then((response) => {
				console.log(response.data.project);
				this.apartment = response.data.project;
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
				console.log(this.apartment)
			});
	},
};
</script>

<template>
	<div class="container pt-4">
		<div class="container col-9">

			<div class="card mb-3">
				<div class="row g-0">
					<div class="p-2">
						<img :src="image" class="img-fluid rounded" alt="...">
					</div>
					<div class="col-md-8">
						<div class="card-body">
							<h5 class="card-title fs-1">{{ title }}</h5>
							<p class="card-text">Indirizzo: {{ address }}
							</p>
							<p class="card-text">
								<i class="fa-solid fa-person-shelter"></i> Stanze: {{ rooms }}
							</p>
							<p class="card-text">
								<i class="fa-solid fa-bed"></i> Posti letto: {{ beds }}
							</p>
							<p class="card-text">
								<i class="fa-solid fa-bath"></i> Bagni: {{ bathrooms }}
							</p>
							<p class="card-text">
								<i class="fa-solid fa-bath"></i> Dimensione (Mq): {{ dimension }}
							</p>
							<hr>
							<h5 style="text-align: center; margin-bottom: 1rem; margin-top: 1rem;"> Servizi presenti
							</h5>
							<div class="servizi">
								<span style="list-style: none; margin-left: 0.5rem; margin-right: 0.5rem;"
									v-for="servizio in store.servizi_bnb">
									<span v-html="servizio.icon"></span> {{ servizio.title }}
								</span>
							</div>
						</div>
						<div class="map">
							<h5>Dove troverai la struttura</h5>
							<iframe style="border-radius: 20px;" width="935" height="624" frameborder="0" scrolling="no"
								marginheight="0" marginwidth="0" :src="coordinateMaps">
							</iframe>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container col-9">
			<h5 style="text-align: center;">Contatta l'host della camera</h5>
			<div class="mb-3">
				<label for="" class="form-label">Email*</label>
				<input v-model="emailUtente" type="email" class="form-control" name="" id=""
					aria-describedby="emailHelpId" placeholder="inserire mail valida" />
			</div>
			<div class="mb-3">
				<input v-model="nomeUtente" type="text" class="form-control" name="" id="" aria-describedby="helpId"
					placeholder="inserire nome" />
			</div>
			<div class="mb-3">
				<p>Invia un messaggio</p>
				<textarea v-model="messaggioUtente" class="form-control" name="" id="" rows="3"></textarea>
			</div>
			<p>I campi contrassegnati con * sono obbligatori</p>
			<button @click="sendMessage()">Invia</button>
		</div>

		<!-- </div>
	<hr>
	<div class="map">
		<h5>Dove troverai la struttura</h5>
		<iframe style="border-radius: 20px;" width="935" height="624" frameborder="0" scrolling="no" marginheight="0"
			marginwidth="0" :src="coordinateMaps">
		</iframe>
	</div>
	<hr>

	<div class="contact">
		<h5 style="text-align: center;">Contatta l'host della camera</h5>
		<div class="mb-3">
			<label for="" class="form-label">Email*</label>
			<input v-model="emailUtente" type="email" class="form-control" name="" id="" aria-describedby="emailHelpId"
				placeholder="inserire mail valida" />
		</div>
		<div class="mb-3">
			<input v-model="nomeUtente" type="text" class="form-control" name="" id="" aria-describedby="helpId"
				placeholder="inserire nome" />
		</div>
		<div class="mb-3">
			<p>Invia un messaggio</p>
			<textarea v-model="messaggioUtente" class="form-control" name="" id="" rows="3"></textarea>
		</div>
		<p>I campi contrassegnati con * sono obbligatori</p>
		<button @click="sendMessage()">Invia</button>
	</div>-->
	</div>
</template>

<style scoped></style>
