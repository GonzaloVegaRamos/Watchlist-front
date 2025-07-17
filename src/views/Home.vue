<template>
  <SidebarLayout>
    <div class="d-flex" id="app">
      <div class="flex-grow-1 p-4">
        <h2 class="mb-4">Catálogo de Películas</h2>

        <div class="mb-4 row align-items-end">
          <div class="col-md-4 mb-2">
            <input
              type="text"
              class="form-control"
              placeholder="Buscar por título..."
              v-model="searchTerm"
              @input="fetchFilteredMovies"
            />
          </div>

          <div class="col-md-3 mb-2">
            <select class="form-select" v-model="selectedGenre" @change="fetchFilteredMovies">
              <option value="">Todos los géneros</option>
              <option v-for="genre in genres" :key="genre" :value="genre">
                {{ genreMapDisplay[genre] }}
              </option>
            </select>
          </div>

          <div class="col-md-3 mb-2">
            <select class="form-select" v-model="selectedType" @change="fetchFilteredMovies">
              <option value="">Todos los tipos</option>
              <option value="movie">Película</option>
              <option value="series">Serie</option>
            </select>
          </div>

          <div class="col-md-2 mb-2">
            <input
              type="number"
              class="form-control"
              placeholder="Año"
              v-model.number="selectedYear"
              @input="fetchFilteredMovies"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-4" v-for="movie in movies" :key="movie.id">
            <router-link
              :to="`/movies/${movie.id}`"
              class="card h-100 shadow text-decoration-none text-dark"
            >
              <div class="row g-0 align-items-start">
                <div class="col-4">
                  <img
                    v-if="movie.imagen"
                    :src="movie.imagen"
                    class="img-fluid rounded-start"
                    :alt="movie.title"
                    style="height: 250px; width: auto; object-fit: cover"
                  />
                </div>
                <div class="col-8">
                  <div class="card-body p-2">
                    <h5 class="card-title mb-1">{{ movie.title }}</h5>
                    <p
                      class="card-text small mb-1 text-truncate"
                      style="max-height: 3em; overflow: hidden"
                    >
                      {{ movie.description }}
                    </p>
                    <p class="text-muted small mb-0">Año: {{ movie.releaseYear }}</p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <div v-if="movies.length === 0" class="text-muted mt-4">
          No se encontraron películas que coincidan con los filtros.
        </div>
      </div>
    </div>
  </SidebarLayout>
</template>

<script>
import api from '../api'
import SidebarLayout from '@/layouts/SidebarLayout.vue'

export default {
  name: 'Home',
  components: { SidebarLayout },
  data() {
    return {
      movies: [],
      searchTerm: '',
      selectedGenre: '',
      selectedType: '',
      selectedYear: null,

      genres: ['sci-fi', 'fantasy', 'action', 'horror', 'thriller'],

      genreMapDisplay: {
        'sci-fi': 'Ciencia Ficción',
        fantasy: 'Fantasía',
        action: 'Acción',
        horror: 'Terror',
        thriller: 'Suspenso',
      },
    }
  },

  methods: {
    async fetchAllMovies() {
      console.log('fetchAllMovies called')
      try {
        const response = await api.get('/watchlists/movies')
        this.movies = response.data
        console.log('Movies loaded:', this.movies.length)
      } catch (error) {
        console.error('Error al cargar todas las películas:', error)
      }
    },

    async fetchFilteredMovies() {
      const hasActiveFilters =
        this.selectedGenre || this.selectedType || this.selectedYear || this.searchTerm.trim()

      if (!hasActiveFilters) {
        await this.fetchAllMovies()
        return
      }

      try {
        const params = {}

        if (this.selectedGenre) params.genre = this.selectedGenre // <-- aquí el cambio
        if (this.selectedType) params.type = this.selectedType
        if (this.selectedYear) params.year = this.selectedYear
        if (this.searchTerm.trim()) params.title = this.searchTerm.trim()

        const response = await api.get('/watchlists/search', { params })
        this.movies = response.data
        console.log('Filtered movies loaded:', this.movies.length)
      } catch (error) {
        console.error('Error al cargar películas filtradas:', error)
      }
    },
  },

  beforeMount() {
    const token = localStorage.getItem('token')
    if (!token) {
      this.$router.push({ path: '/' })
    }
  },
  mounted() {
    console.log('mounted called')
    this.fetchAllMovies()
  },
}
</script>

<style scoped>
#app {
  height: 100vh;
}

.sidebar {
  width: 250px;
  min-height: 100vh;
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.02);
}

.text-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
