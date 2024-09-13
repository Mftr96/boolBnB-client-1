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
      <p class="col30">&copy; 2024 Boolbnb, Tutti i diritti riservati.</p>
      <ul class="col40">
        <a href="/chi-siamo">Chi siamo</a>
        <a href="/contatti">Contatti</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/termini-condizioni">Termini e condizioni</a>
      </ul>
      <div class="social-media col30">
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
.footer-content > p, .footer-content > ul {
  margin: 0;
}
.footer-content > ul > a {
  border-radius: 1rem;
  padding: 0.35rem;
  margin: 0 0.2rem;
}
.footer-content > ul > a:hover {
  background-color: rgb(20, 20, 20);
}
.col30 {
  width: 30%;
}
.col40 {
  width: 40%;
}

.social-media {
  text-align: end;
}
.social-media > a {
  position: relative;
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border-radius: 1rem;
}
.social-media > a > i {
  position: absolute;
  top: 0.5rem;
  left: 0rem;
}
.social-media > a:hover {
  background-color: rgb(20, 20, 20);
}

</style>
