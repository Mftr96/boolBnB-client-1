<script >
import store from '../data/store.js';
import { RouterLink } from 'vue-router';


export default {

  name:"AppHeader",

components: {

},

data() {

  return {
    store,
    inputIndirizzo: "",

  }

},

watch: {
  inputIndirizzo(newInputIndirizzo, oldInputIndirizzo) {
    this.assistenzaIndirizzo(newInputIndirizzo)
  }
}

methods: {
  assistenzaIndirizzo(indirizzo) {
    const apiKey = "RUfkTtEK0CYbHBG3YE2RSEslSRGAWZcu";
    const url_tomtom = `https://api.tomtom.com/search/2/search/${encodeURIComponent(indirizzo)}.json?key=${apiKey}&typeahead=true&limit=2&countrySet={IT}`;
    
    let addressInput = indirizzo.value;
                const url_tomtom =
                    `https://api.tomtom.com/search/2/search/${encodeURIComponent(addressInput)}.json?key=${apiKey}&typeahead=true&limit=${limit}&countrySet={IT}`;
                axios.get(url_tomtom)
                    .then(function(response) {

                        apiAnswer = response.data;

                        console.log(apiAnswer);

                        let lista = document.getElementById('opzioni');
                        lista.innerHTML = '';

                        for (let i = 0; i < apiAnswer.results.length; i++) {
                            let indirizzoCompleto = apiAnswer.results[i].address.freeformAddress;
                            let newOption = document.createElement("li");
                            newOption.innerHTML = indirizzoCompleto;

                            newOption.addEventListener('click', function() {
                                indirizzo.value = indirizzoCompleto;
                                selectedAddress = indirizzoCompleto;
                                apiAnswer = [];
                                lista.innerHTML = '';

                                console.log("Indirizzo selezionato:", selectedAddress);
                            });

                            lista.append(newOption);
                        }
                    });



  }

},

mounted() {

}

}

</script>

<template>
<nav>
    <input id="indirizzo" type="text" placeholder="Inserisci indirizzo o città" v-model="inputIndirizzo">
    <ul id="opzioni"></ul>
    <input type="number" placeholder="Stanze">
    <input type="number" placeholder="Posti letto">
    <div class="dropdown">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        id="triggerId"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Servizi
      </button>
      <div class="dropdown-menu" aria-labelledby="triggerId">
        <input type="checkbox" id="servizio1">Servizio 1</input>
        <input type="checkbox" id="servizio2">Servizio 2</input>
        <input type="checkbox" id="servizio3">Servizio 3</input>
        <input type="checkbox" id="servizio4">Servizio 4</input>
      </div>
    </div>
    
    
    <h1></h1>

</nav>
</template>
    

<style scoped>

  #opzioni {
    display: hidden;
  }

</style>
    
