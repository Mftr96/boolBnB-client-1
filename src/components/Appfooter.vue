<script>

export default {
  name: 'Appfooter',

  components: {},
};
</script>

<template>
  <footer class="bg-dark">
    <div class="container-fluid">
      <div class="d-block d-md-flex row text-center">
        <p class="text-white col-md-3">&copy; 2024 Boolbnb, Tutti i diritti riservati.</p>
        <ul class="d-flex flex-column col-md-6 d-md-block text-center">
          <a class="col-md-4 text-white mx-2" href="/chi-siamo">Chi siamo</a>
          <a class="col-md-4 text-white mx-2" href="/contatti">Contatti</a>
          <a class="col-md-4 text-white mx-2" href="/privacy-policy">Privacy Policy</a>
          <a class="col-md-4 text-white mx-2" href="/termini-condizioni">Termini e condizioni</a>
        </ul>
        <div class="col-md-3 text-md-start">
          <a class="text-white mx-2" href="https://www.facebook.com/login/?locale=it_IT"><i
              class="fa-brands fa-square-facebook"></i></a>
          <a class="text-white mx-2" href="https://x.com/i/flow/login"><i class="fa-brands fa-x-twitter"></i></a>
          <a class="text-white mx-2" href="https://www.instagram.com/accounts/login/"><i
              class="fa-brands fa-instagram"></i></a>
        </div>

      </div>
    </div>
  </footer>
</template>

<style scoped></style>
