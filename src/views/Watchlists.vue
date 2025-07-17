<template>
  <SidebarLayout>
    <div class="container mt-4">
      <h2>Mis Watchlists</h2>
      <div v-if="loading" class="text-center my-4">Cargando...</div>
      <div v-else>
        <div v-if="watchlists.length === 0" class="alert alert-info">
          No tienes listas de seguimiento.
        </div>
        <div v-for="watchlist in watchlists" :key="watchlist.id" class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">{{ watchlist.name }}</h5>
            <div class="d-flex flex-wrap">
              <div
                v-for="movie in watchlist.movies"
                :key="movie.movieId"
                class="position-relative m-1"
                style="width: 80px; height: 120px; overflow: hidden; border-radius: 4px"
              >
                <img
                  :src="movie.image || 'https://via.placeholder.com/80x120?text=No+Image'"
                  :alt="movie.title"
                  class="img-fluid"
                  style="width: 100%; height: 100%; object-fit: cover"
                  :title="movie.title"
                />
                <button
                  class="btn btn-sm btn-danger position-absolute top-0 end-0"
                  style="padding: 2px 6px; font-size: 0.7rem"
                  @click="confirmDelete(watchlist.id, movie.movieId, movie.title)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showModal"
        class="modal fade show"
        tabindex="-1"
        style="display: block; background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirmar eliminación</h5>
              <button type="button" class="btn-close" @click="cancelDelete"></button>
            </div>
            <div class="modal-body">
              <p>
                ¿Estás seguro de que quieres eliminar
                <strong>{{ movieToDelete.title }}</strong> de la lista?
              </p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="cancelDelete">Cancelar</button>
              <button class="btn btn-danger" @click="deleteMovie">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script>
import api from '../api'
import SidebarLayout from '@/layouts/SidebarLayout.vue'

export default {
  name: 'Watchlists',
  components: { SidebarLayout },
  data() {
    return {
      watchlists: [],
      loading: true,
      showModal: false,
      movieToDelete: {
        listId: null,
        movieId: null,
        title: '',
      },
    }
  },
  async created() {
    try {
      const response = await api.get('/watchlists/my-watchlists')
      this.watchlists = response.data
    } catch (error) {
      alert('Error cargando las listas')
    } finally {
      this.loading = false
    }
  },
  methods: {
    confirmDelete(listId, movieId, title) {
      this.movieToDelete = { listId, movieId, title }
      this.showModal = true
    },
    cancelDelete() {
      this.showModal = false
      this.movieToDelete = { listId: null, movieId: null, title: '' }
    },
    async deleteMovie() {
      try {
        await api.delete(
          `/watchlists/${this.movieToDelete.listId}/remove-movie/${this.movieToDelete.movieId}`,
        )

        const list = this.watchlists.find((w) => w.id === this.movieToDelete.listId)
        if (list) {
          list.movies = list.movies.filter((m) => m.movieId !== this.movieToDelete.movieId)

          if (list.movies.length === 0) {
            await api.delete(`/watchlists/${list.id}`)

            this.watchlists = this.watchlists.filter((w) => w.id !== list.id)
          }
        }
      } catch (error) {
        alert('Error eliminando la película o la lista')
      } finally {
        this.cancelDelete()
      }
    },
  },
}
</script>

<style scoped>
.modal {
  z-index: 1050;
}
</style>
