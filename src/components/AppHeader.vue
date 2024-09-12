<script>
export default {
  name: 'AppHeader',

  data() {
    return {};
  },
};
</script>

<template>
  <header>
    <!-- <div class="row justify-content-between align-items-center mt-2 fixed"> -->
    <div
      class="container-fluid row justify-content-between align-items-center mt-2 fixed"
    >
      <div class="col-3 text-end no-show-mobile">
        <a href="http://localhost:5173/">
          <img class="rounded-5" height="50px" src="/logo.png" alt="" />
        </a>
      </div>
      <div class="col d-flex justify-content-end h-50 navbar-mobile">
        <div class="ps-1 border-start border-black">
          <a class="animated-border" href="http://localhost:5173/">HOME</a>
        </div>
        <div class="px-1 border-end border-start border-black">
          <a class="animated-border" href="http://localhost:5173/search"
            >RICERCA</a
          >
        </div>
        <div class="pe-1 border-end border-black">
          <a class="animated-border" href="http://127.0.0.1:8000">LOGIN</a>
        </div>
      </div>
    </div>
    <div class="space"></div>
  </header>
</template>

<style scoped>
a {
  text-decoration: none; /* Rimuove la sottolineatura */
  color: inherit; /* Imposta il colore in base al colore del testo circostante */
  background: none; /* Rimuove qualsiasi sfondo */
  padding: 0; /* Rimuove il padding */
  margin: 0; /* Rimuove il margine */
  border: none; /* Rimuove eventuali bordi */
  font: inherit; /* Eredita il font dall'elemento padre */
  cursor: pointer; /* Mantiene il puntatore a mano */
  outline: none;
  font-weight: 600;
}

.space {
  width: 100%;
  height: 3rem;
}

.fixed {
  width: 100%;
  max-width: 1600px;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 20px;
}

.animated-border {
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: black;
}

.animated-border::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: black;
  transition: all 0.4s ease;
  transform: translateX(-50%);
}

div .animated-border:hover::after {
  width: 100%;
  left: 0;
  transform: translateX(0);
}

@media screen and (max-width: 431px) {
  .no-show-mobile {
    display: none !important;
  }
  .navbar-mobile {
    justify-content: center !important;
  }
}
</style>
