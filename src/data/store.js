import { reactive } from 'vue';

const store = reactive({
  loadingScreen: false,
  noApartment: true,
  searchApartment: [],
  servizi_bnb: [
    {
      title: 'Wi-Fi',
      icon: '<i class="fa-solid fa-wifi"></i>',
      description: 'Connessione Wi-Fi veloce e gratuita',
    },
    {
      title: 'Colazione inclusa',
      icon: '<i class="fa-solid fa-utensils"></i>',
      description: 'Colazione gratuita disponibile ogni mattina',
    },
    {
      title: 'Aria condizionata',
      icon: '<i class="fa-solid fa-snowflake"></i>',
      description: 'Ambiente fresco e confortevole',
    },
    {
      title: 'Parcheggio',
      icon: '<i class="fa-solid fa-car"></i>',
      description: 'Parcheggio privato disponibile in loco',
    },
    {
      title: 'Piscina',
      icon: '<i class="fa-solid fa-water-ladder"></i>',
      description: 'Piscina all’aperto per il relax',
    },
    {
      title: 'Palestra',
      icon: '<i class="fa-solid fa-dumbbell"></i>',
      description: 'Palestra attrezzata per l’allenamento',
    },
    {
      title: 'Servizio in camera',
      icon: '<i class="fa-solid fa-concierge-bell"></i>',
      description: 'Servizio in camera disponibile su richiesta',
    },
    {
      title: 'Reception 24/24',
      icon: '<i class="fa-solid fa-clock"></i>',
      description: 'Reception aperta 24 ore su 24',
    },
    {
      title: 'TV sat.',
      icon: '<i class="fa-solid fa-tv"></i>',
      description: 'Televisione satellitare con canali internazionali',
    },
    {
      title: 'Minibar',
      icon: '<i class="fa-solid fa-glass-martini-alt"></i>',
      description: 'Minibar in camera con bevande e snack',
    },
  ],
});

export default store;
