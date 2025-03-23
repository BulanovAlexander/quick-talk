<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'

import Toaster from '@/components/ui/toast/Toaster.vue'

import useAuthentication from '@/composables/useAuthentication'

useColorMode()
const router = useRouter()
const { user } = useAuthentication()

watch(user, () => {
  if (user.value) {
    if (
      router.currentRoute.value.name === 'sign-in' ||
      router.currentRoute.value.name === 'sign-up'
    ) {
      router.push({ name: 'home' })
    }
  } else {
    if (
      router.currentRoute.value.name !== 'sign-in' &&
      router.currentRoute.value.name !== 'sign-up'
    ) {
      router.push({ name: 'sign-in' })
    }
  }
})
</script>

<template>
  <RouterView />

  <Toaster />
</template>
