import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import SignUpView from '../views/SignUpView.vue'
import SignInView from '../views/SignInView.vue'
import AccountView from '../views/AccountView.vue'
import SettingsView from '../views/SettingsView.vue'
import ConfirmationView from '../views/ConfirmationView.vue'

import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

import useAuthentication from '@/composables/useAuthentication'

const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const { isLoggedIn } = useAuthentication()

  if (!isLoggedIn()) {
    return next({ name: 'sign-in' })
  }

  next()
}

const requireNoAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const { isLoggedIn } = useAuthentication()

  if (isLoggedIn()) {
    return next({ name: 'home' })
  }

  next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        requiresAuth: true,
      },
      component: HomeView,
      children: [
        {
          path: 'account',
          name: 'account',
          component: AccountView,
        },
        {
          path: 'settings',
          name: 'settings',
          component: SettingsView,
        },
        {
          path: 'chat/:chatId?',
          name: 'chat',
          component: ChatView,
          props: true,
        },
      ],
      beforeEnter: requireAuth,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpView,
      beforeEnter: requireNoAuth,
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignInView,
      beforeEnter: requireNoAuth,
    },
    {
      path: '/confirmation',
      name: 'confirmation',
      component: ConfirmationView,
      beforeEnter: requireNoAuth,
    },
  ],
})

export default router
