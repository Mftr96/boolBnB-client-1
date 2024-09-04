//il file che indirizza alle rotte  della pagina
import AppMain from './routes/AppMain.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({

    history: createWebHistory(),

    routes: [   
        {path:"/", name:"home", component:AppMain }
    ]

});

export { router };