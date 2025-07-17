<template>
  <div id="app">
    <div class="sidebar bg-dark text-white p-3 mt-5">
      <h3 class="text-center mb-4">🎬 Watchlist</h3>
      <ul class="nav flex-column">
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/home">Inicio</router-link>
        </li>
        <li class="nav-item mb-2">
          <router-link class="nav-link text-white" to="/watchlists">Mis Listas</router-link>
        </li>
      </ul>
    </div>

    <div class="content p-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
#app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  overflow-y: auto; /* Para scroll si hay mucho contenido */
}

.content {
  margin-left: 250px; /* dejar espacio para el sidebar */
  height: 100vh;
  overflow-y: auto; /* scroll solo en contenido */
  padding: 1rem;
}
</style>
