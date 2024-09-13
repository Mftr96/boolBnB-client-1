<script>
import store from '../data/store.js';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';

export default {
  name: 'Appfooter',

  components: {},
};
</script>

<template>
  <footer class="app-footer">
    <div class="footer-content">
      <p class="col-md-3">&copy; 2024 Boolbnb, Tutti i diritti riservati.</p>
      <ul class="col-md-6">
        <a href="/chi-siamo">Chi siamo</a>
        <a href="/contatti">Contatti</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/termini-condizioni">Termini e condizioni</a>
      </ul>
      <div class="social-media col-md-3">
        <a href="https://www.facebook.com/login/?locale=it_IT"><i class="fa-brands fa-square-facebook"></i></a>
        <a href="https://x.com/i/flow/login"><i class="fa-brands fa-x-twitter"></i></a>
        <a href="https://www.instagram.com/accounts/login/"><i class="fa-brands fa-instagram"></i></a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
p,
a,
i {
  margin-left: 0.2rem;
  margin-right: 0.2rem;
}

i {
  background-color: rgba(5, 7, 100, 0);
  font-size: 20px;
}

a {
  color: white;
  text-decoration: none;
  transition: 0.5s ease;
}

.app-footer {
  background-color: rgb(71, 71, 71);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 10px 20px -10px rgb(0, 0, 0);
}

.footer-content {
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
}

.footer-content>p,
.footer-content>ul {
  margin: 0;
}

.footer-content>ul>a {
  border-radius: 5px;
  padding: 0.5rem;
  margin: 0 0.2rem;
}

.footer-content>ul>a:hover {
  background-color: rgb(20, 20, 20);
}

/* .col30 {
  width: 30%;
}
.col40 {
  width: 40%;
} */

.social-media {
  text-align: end;
}

.social-media>a {
  position: relative;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border-radius: 5px;
}

.social-media>a>i {
  position: absolute;
  top: 0.5rem;
  left: 0rem;
}

.social-media>a:hover {
  background-color: rgb(20, 20, 20);
}
</style>
