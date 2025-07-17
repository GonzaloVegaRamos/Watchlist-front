<template>
  <div>
    <header class="compact-header d-flex align-items-center px-3 py-2">
      <div v-if="username" class="user-info d-flex align-items-center gap-2">
        <span>{{ username }}</span>
        <button
          class="btn btn-outline-danger btn-sm"
          @mouseover="hovering = true"
          @mouseleave="hovering = false"
          :class="{ 'btn-danger text-white': hovering }"
          @click="logout"
        >
          Cerrar sesión
        </button>
      </div>
      <div v-else class="text-muted">No hay nadie logueado</div>
    </header>

    <RouterView />
  </div>
</template>

<script>
import { emitter } from './eventBus'

export default {
  name: 'App',
  data() {
    return {
      username: null,
      hovering: false,
    }
  },
  created() {
    this.checkToken()
    emitter.on('logout', () => {
      this.username = null
    })
    emitter.on('login', (username) => {
      this.username = username
    })
  },
  beforeUnmount() {
    emitter.off('logout')
    emitter.off('login')
  },
  methods: {
    checkToken() {
      const isDemo = import.meta.env.VITE_DEMO_MODE === 'true'

      if (isDemo) {
        // Simular un usuario para el modo demo
        this.username = 'demo_user'
        localStorage.setItem('token', 'fake.token.demo')
      } else {
        const token = localStorage.getItem('token')
        if (token) {
          this.username = this.getUsernameFromToken(token)
        } else {
          this.username = null
        }
      }
    },

    logout() {
      localStorage.removeItem('token')
      emitter.emit('logout')
      this.$router.replace({ name: 'Login' })
    },
    getUsernameFromToken(token) {
      try {
        const payloadBase64Url = token.split('.')[1]
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payloadJson = atob(payloadBase64)
        const payload = JSON.parse(payloadJson)
        return payload.unique_name || payload.username || null
      } catch (e) {
        console.error('Error decoding token', e)
        return null
      }
    },
  },
}
</script>
<style>
.compact-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1030; /* para estar por encima de otros elementos */
}

/* Separar el contenido del header fijo */
.content-with-header {
  margin-top: 56px; /* altura aproximada del header (ajusta si cambia) */
}
</style>
