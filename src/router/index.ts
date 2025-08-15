import { createRouter, createWebHistory } from 'vue-router'
import AccountsView from '../views/AccountsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accounts',
      component: AccountsView,
    },
  ],
})

export default router
