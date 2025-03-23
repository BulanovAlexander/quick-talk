<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ChevronLeft } from 'lucide-vue-next'

const router = useRouter()
const handleBack = () => {
  router.push({ name: 'home' })
}

const { store } = useColorMode()
const isDark = computed<boolean>(() => store.value === 'dark')
const toggleTheme = () => {
  store.value = store.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="absolute top-0 flex flex-col w-full h-full">
    <div
      class="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-sidebar"
    >
      <div class="relative flex items-center gap-2 w-full px-4">
        <Button class="absolute" variant="ghost" @click="handleBack">
          <ChevronLeft class="w-4 h-4" />
          Назад
        </Button>
        <p class="mx-auto px-20 text-center">Настройки</p>
      </div>
    </div>
    <ScrollArea class="h-full">
      <div class="p-4">
        <div class="flex items-center space-x-2">
          <Switch :model-value="isDark" @update:model-value="toggleTheme" />
          <span class="text-sm"> Темная тема </span>
        </div>
      </div>
    </ScrollArea>
  </div>
</template>
