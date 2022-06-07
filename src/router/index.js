import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'
// import IndexTest from '@/views/IndexTest.vue'
import testcompte from '@/views/testcompte.vue'
import Compte from '@/views/Compte.vue'
import Capchat from '@/views/Capchat.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
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
  },
  {
    path: '/capchat/',
    name: 'Capchat',
    component: Capchat
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
