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
      <p class="col33">&copy; 2024 Boolbnb, Tutti i diritti riservati.</p>
      <ul class="col33">
        <a href="/chi-siamo">Chi siamo</a>
        <a href="/contatti">Contatti</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/termini-condizioni">Termini e condizioni</a>
      </ul>
      <div class="social-media col33">
        <a href="https://www.facebook.com/login/?locale=it_IT"
          ><i class="fa-brands fa-facebook"></i
        ></a>
        <a href="https://x.com/i/flow/login"
          ><i class="fa-brands fa-x-twitter"></i
        ></a>
        <a href="https://www.instagram.com/accounts/login/"
          ><i class="fa-brands fa-instagram"></i
        ></a>
      </div>
    </div>
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
  background-color: rgb(71, 71, 71);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  width: 1600px;
}

.col33 {
  width: 33%;
}

.social-media {
  text-align: end;
}
</style>
