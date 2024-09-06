import { reactive } from 'vue';

const store = reactive({
  searchApartment: [],
  servizi_bnb: [
    'Wi-Fi',
    'Colazione inclusa',
    'Aria condizionata',
    'Parcheggio gratuito',
    'Piscina',
    'Palestra',
    'Servizio in camera',
    'Reception 24 ore su 24',
    'TV satellitare',
    'Minibar',
  ],
});

export default store;
