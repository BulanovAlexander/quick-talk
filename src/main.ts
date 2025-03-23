import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { supabase } from '@/supabase'

import router from './router'
import App from './App.vue'
import useAuthentication from './composables/useAuthentication'

let app: any

supabase.auth.onAuthStateChange((event, session) => {
  const { user } = useAuthentication()

  user.value = session?.user || null

  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.mount('#app')
  }
})
