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
  scrollBehavior(to, from, savedPosition) {
    // Se c'è una posizione salvata (es. back/forward nel browser), la ripristina
    if (savedPosition) {
      return savedPosition;
    } else {
      // Altrimenti torna all'inizio della pagina
      return { left: 0, top: 0 };
    }
  },
});

export { router };
