<script>
export default {
  name: 'AppHeader',

  data() {
    return {
      burgerMenu: false,
    };
  },
  methods: {
    showMenu() {
      this.burgerMenu = !this.burgerMenu;
    },
  },
};
</script>

<template>
  <header>
    <ul :class="{'apritiSemola' : burgerMenu}" class="burger-menu">
      <li>
        <a class="animated-border" href="http://localhost:5173/">
          <i class="fa-solid fa-house-chimney"></i>
          Home
        </a>
      </li>
      <li>
        <a class="animated-border" href="http://localhost:5173/search">
          <i class="fa-solid fa-magnifying-glass-location"></i>
          Ricerca</a
        >
      </li>
      <li>
        <a class="animated-border" href="http://127.0.0.1:8000">
          <i class="fa-solid fa-user"></i>
          Login</a
        >
      </li>
      <li>
        <a class="animated-border" href="http://127.0.0.1:8000/register">
          <i class="fa-regular fa-pen-to-square"></i>
          Registrati</a
        >
      </li>
    </ul>
    <div class="container-fluid d-flex justify-content-between align-items-center mt-2 fixed">
      <!-- logo -->
      <div class="col-4 text-end">
        <a href="http://localhost:5173/">
          <img height="50px" src="/logo.png" alt="" />
        </a>
      </div>

      <i @click="showMenu()" class="show-mobile burger fs-3 fa-solid fa-bars"</i>

      <!-- home e ricerca -->
      <div class="col-4 d-flex justify-content-center h-50 navbar-mobile no-show-mobile">
        <div class="nav-button left">
          <a class="animated-border" href="http://localhost:5173/">
            <i class="fa-solid fa-house-chimney"></i>
            Home
          </a>
        </div>
        <div class="nav-button right">
          <a class="animated-border" href="http://localhost:5173/search">
            <i class="fa-solid fa-magnifying-glass-location"></i>
            Ricerca</a
          >
        </div>
      </div>

      <div class="col-4 d-flex justify-content-end h-50 navbar-mobile no-show-mobile">
        <div class="nav-button left">
          <a class="animated-border" href="http://127.0.0.1:8000">
            <i class="fa-solid fa-user"></i>
            Login</a
          >
        </div>
        <div class="nav-button right">
          <a class="animated-border" href="http://127.0.0.1:8000/register">
            <i class="fa-regular fa-pen-to-square"></i>
            Registrati</a
          >
        </div>
      </div>
      <!-- login -->
    </div>

    <div class="space"></div>
  </header>
</template>

<style scoped>
.navbar-mobile {
  border-radius: 20px;
}

.nav-button {
  padding: 0.2rem 1rem;
  /* border: 1px solid white; */
  transition: 0.5s ease;
  width: 9.5rem;
  /* border: 2px solid white; */
  background-color: rgba(91, 193, 211, 0.161);
  text-align: center;
  cursor: pointer;
}

.right {
  border-radius: 0 20px 20px 0px;
  border-left: 1px solid rgba(91, 193, 211, 0);
}

.left {
  border-radius: 20px 0 0 20px;
  border-right: 1px solid rgba(91, 193, 211, 0);
}

.nav-button:hover {
  background-color: rgba(91, 193, 211, 0.748);
}

.burger {
  color: rgba(0, 0, 0, 0.994);
}

a {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  transition: 0.5s ease;
}

a:hover {
  color: rgb(33, 31, 31);
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
  color: rgb(74, 70, 70);
}

.show-mobile {
  display: none;
}

.burger-menu {
  display: none;
}

@media screen and (max-width: 991px) {
  .show-mobile {
    display: unset;
    position: relative;
  }
  .no-show-mobile {
    display: none !important;
  }
  .burger-menu {
    position: absolute;
    top: 101vh;
    left: 0%;
    width: 100%;
    height: 100%;
    transition: .5s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .burger-menu li {
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(172, 230, 255, 0.899);
    padding: .5rem .6rem;
  }

  .burger-menu li:first-child {
    border-radius: 30px 0 0 30px;
  }

  .burger-menu li:last-child {
    border-radius:0 30px 30px 0;
  }
  
  .burger-menu li a {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
  }

  .apritiSemola {
    transform: translateY(-7rem);
  }
}
</style>
