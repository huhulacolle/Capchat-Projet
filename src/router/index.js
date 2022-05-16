import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Inscription from '@/views/Inscription.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/inscription',
    name: 'inscription',
    component: Inscription
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
