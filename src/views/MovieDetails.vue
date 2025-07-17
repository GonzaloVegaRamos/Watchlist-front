<template>
  <SidebarLayout>
    <div class="container mt-4">
      <h2>{{ movie?.title || 'Cargando...' }}</h2>
      <div v-if="movie" class="row mt-3">
        <div class="col-md-4">
          <img :src="movie.imagen || movie.image" alt="Poster" class="img-fluid rounded" />
        </div>
        <div class="col-md-8">
          <p><strong>Tipo:</strong> {{ movie.type || 'No disponible' }}</p>
          <p><strong>Género:</strong> {{ movie.genre || 'No disponible' }}</p>
          <p><strong>Año de estreno:</strong> {{ movie.releaseYear || 'Desconocido' }}</p>
          <p><strong>Descripción:</strong> {{ movie.description || 'Sin descripción' }}</p>
          <button class="btn btn-primary mt-3" @click="openModal">Añadir a lista</button>
        </div>
      </div>
      <div v-else>
        <p>Cargando detalles...</p>
      </div>

      <div
        class="modal fade"
        tabindex="-1"
        :class="{ show: showModal }"
        :style="showModal ? 'display: block;' : ''"
        role="dialog"
        aria-modal="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Añadir "{{ movie?.title }}" a una lista</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div v-if="loadingLists">Cargando listas...</div>
              <div v-else>
                <h6>Selecciona una lista existente:</h6>
                <ul class="list-group mb-3">
                  <li
                    v-for="list in watchlists"
                    :key="list.id"
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {{ list.name }}
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="addToWatchlist(list.id)"
                      :disabled="adding"
                    >
                      Añadir
                    </button>
                  </li>
                  <li v-if="watchlists.length === 0" class="text-muted">
                    No tienes listas creadas.
                  </li>
                </ul>

                <hr />

                <h6>O crea una lista nueva:</h6>
                <form @submit.prevent="createAndAdd">
                  <div class="mb-3">
                    <label for="newListName" class="form-label">Nombre de la lista</label>
                    <input
                      type="text"
                      id="newListName"
                      class="form-control"
                      v-model="newWatchlistName"
                      :disabled="adding"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    class="btn btn-success"
                    :disabled="adding || !newWatchlistName.trim()"
                  >
                    Crear y añadir
                  </button>
                </form>
              </div>
              <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
              <div v-if="success" class="alert alert-success mt-3">{{ success }}</div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal" :disabled="adding">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-backdrop fade show"></div>
    </div>
  </SidebarLayout>
</template>

<script>
import api from '../api'
import SidebarLayout from '@/layouts/SidebarLayout.vue'
export default {
  name: 'MovieDetails',
  components: { SidebarLayout },
  data() {
    return {
      movie: null,
      showModal: false,
      watchlists: [],
      loadingLists: false,
      newWatchlistName: '',
      adding: false,
      error: '',
      success: '',
    }
  },
  async created() {
    const movieId = this.$route.params.id
    try {
      const response = await api.get(`/watchlists/movie/${movieId}`)
      this.movie = response.data
    } catch (error) {
      console.error('Error al cargar la película:', error)
    }
  },
  methods: {
    async openModal() {
      this.showModal = true
      this.error = ''
      this.success = ''
      this.newWatchlistName = ''
      this.loadingLists = true
      try {
        const res = await api.get('/watchlists/my-watchlists')
        this.watchlists = res.data
      } catch (err) {
        this.error = 'No se pudieron cargar tus listas.'
        this.watchlists = []
      } finally {
        this.loadingLists = false
      }
    },
    closeModal() {
      if (this.adding) return
      this.showModal = false
    },
    async addToWatchlist(watchlistId) {
      this.error = ''
      this.success = ''
      this.adding = true
      try {
        await api.post(`/watchlists/${watchlistId}/add-movie`, { movieId: this.movie.id })
        this.success = `Película añadida a "${this.watchlists.find((w) => w.id === watchlistId)?.name}".`
      } catch (err) {
        this.error = err.response?.data || 'Error al añadir la película a la lista.'
      } finally {
        this.adding = false
      }
    },
    async createAndAdd() {
      if (!this.newWatchlistName.trim()) {
        this.error = 'El nombre de la lista no puede estar vacío.'
        return
      }
      this.error = ''
      this.success = ''
      this.adding = true
      try {
        await api.post('/watchlists/create-watchlist-with-movie', {
          movieId: this.movie.id,
          watchlistName: this.newWatchlistName.trim(),
        })
        this.success = `Lista "${this.newWatchlistName.trim()}" creada y película añadida.`
        this.newWatchlistName = ''
      } catch (err) {
        this.error = err.response?.data || 'Error al crear la lista.'
      } finally {
        this.adding = false
      }
    },
  },
}
</script>

<style scoped>
.modal {
  transition: opacity 0.15s linear;
}
.modal.show {
  opacity: 1;
}
.modal-backdrop {
  z-index: 1040;
}
.modal {
  z-index: 1050;
}
</style>
