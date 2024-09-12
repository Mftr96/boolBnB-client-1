import { reactive } from 'vue';

const store = reactive({
  loadingScreen: false,
  noApartment: true,
  searchApartment: [],
  servizi_bnb: [
    { title: 'Wi-Fi', icon: '<i class="fa-solid fa-wifi"></i>' },
    {
      title: 'Colazione inclusa',
      icon: '<i class="fa-solid fa-utensils"></i>',
    },
    {
      title: 'Aria condizionata',
      icon: '<i class="fa-solid fa-snowflake"></i>',
    },
    { title: 'Parcheggio', icon: '<i class="fa-solid fa-car"></i>' },
    { title: 'Piscina', icon: '<i class="fa-solid fa-water-ladder"></i>' },
    { title: 'Palestra', icon: '<i class="fa-solid fa-dumbbell"></i>' },
    {
      title: 'Servizio in camera',
      icon: '<i class="fa-solid fa-concierge-bell"></i>',
    },
    {
      title: 'Reception 24/24',
      icon: '<i class="fa-solid fa-clock"></i>',
    },
    { title: 'TV sat.', icon: '<i class="fa-solid fa-tv"></i>' },
    { title: 'Minibar', icon: '<i class="fa-solid fa-glass-martini-alt"></i>' },
  ],
});

export default store;
