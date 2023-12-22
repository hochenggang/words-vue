import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DetailView from '../views/DetailView.vue'

const router = createRouter({
  history: createWebHashHistory("/"),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/detail',
      name: 'detail',
      component: DetailView
    },

  ]
})

export default router
