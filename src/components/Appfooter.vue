<script>
import store from '../data/store.js';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';

export default {
    name: 'Appfooter',

    components: {
    },
}
</script>

<template>
    <footer class="app-footer">
        <footer>
            <div class="footer-content">
                <!-- <div class="footer-bottom"> -->
                <p>&copy; 2024 Boolbnb, Tutti i diritti riservati.</p>
                <!-- </div> -->
                <!-- <div class="useful-links"> -->
                <ul>
                    <a href="/chi-siamo">Chi siamo</a>
                    <a href="/contatti">Contatti</a>
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/termini-condizioni">Termini e condizioni</a>
                </ul>
                <!-- </div> -->
                <div class="social-media">
                    <a href="https://www.facebook.com/login/?locale=it_IT"><i class="fa-brands fa-facebook"></i></a>
                    <a href="https://x.com/i/flow/login"><i class="fa-brands fa-x-twitter"></i></a>
                    <a href="https://www.instagram.com/accounts/login/"><i class="fa-brands fa-instagram"></i></a>
                </div>
            </div>
        </footer>
    </footer>
</template>

<style scoped>
p,
a,
i {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}

i {
    background-color: rgb(5, 7, 100);
    border-radius: 15px;
}

a {
    color: white;
    text-decoration: none;
}

.app-footer {
    margin-top: 1rem;
    background-color: rgb(71, 71, 71);
    color: #fff;
}

.footer-content {
    font-family: Arial, Helvetica, sans-serif;
    display: flex;
    justify-content: center;
    padding: 0.5rem;
}
</style>