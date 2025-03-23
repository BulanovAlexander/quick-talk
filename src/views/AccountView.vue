<script setup lang="ts">
import { useRouter } from 'vue-router'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'
import AccountForm from '@/components/AccountForm.vue'

const router = useRouter()
const handleBack = () => {
  router.push({ name: 'home' })
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
        <p class="mx-auto px-20 text-center">Профиль</p>
      </div>
    </div>
    <ScrollArea class="h-full">
      <div class="p-4">
        <AccountForm />
      </div>
    </ScrollArea>
  </div>
</template>
