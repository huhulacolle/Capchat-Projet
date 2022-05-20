import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import testcompte from '@/views/testcompte.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/test',
    name: 'test',
    component: testcompte
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
