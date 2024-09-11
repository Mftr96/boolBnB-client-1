//il file che indirizza alle rotte  della pagina
import AppMain from './routes/AppMain.vue';
import { createRouter, createWebHistory } from 'vue-router';
import AppSearch from './routes/AppSearch.vue';
import AppApartmentDetails from './routes/AppApartmentDetails.vue';

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: '/', name: 'home', component: AppMain },
    { path: '/search', name: 'search', component: AppSearch },
    {
      path: '/search/:title',
      name: 'apartmentdetails',
      component: AppApartmentDetails,
    },
  ],
});

export { router };
