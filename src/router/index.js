import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Watchlists from '../views/Watchlists.vue'
import MovieDetails from '../views/MovieDetails.vue'

const routes = [
  { path: '/home', name: 'Home', component: Home },
  { path: '/', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/watchlists', name: 'Watchlists', component: Watchlists },
  { path: '/movies/:id', name: 'MovieDetails', component: MovieDetails },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
