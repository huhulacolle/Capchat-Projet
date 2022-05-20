import { createRouter, createWebHistory } from 'vue-router'
import NewUser from '@/views/NewUser.vue'
import testcompte from '@/views/testcompte.vue'
import Compte from '@/views/Compte.vue'

const routes = [
  {
    path: '/',
    name: 'NewUser',
    component: NewUser
  },
  {
    path: '/test',
    name: 'test',
    component: testcompte
  },
  {
    path: '/MonCompte',
    name: 'Compte', 
    component: Compte
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
