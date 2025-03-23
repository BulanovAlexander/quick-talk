<script setup lang="ts">
import { computed } from 'vue'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import type { Tables } from '../../database.types.ts'

interface Props {
  user: Tables<'users'>
}

const props = defineProps<Props>()

const userName = computed(() => props.user.full_name || '')
const avatarUrl = computed(() => props.user.avatar_url || '')
const avatarFallbackName = computed<string>(() => {
  return userName.value
    .split(' ')
    .map((word: string) => word.charAt(0).toLocaleUpperCase())
    .slice(0, 2)
    .join('')
})
</script>

<template>
  <div
    class="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-sidebar"
  >
    <div class="relative flex items-center gap-2 w-full px-4">
      <SidebarTrigger class="-ml-1" />

      <div class="mx-auto px-20 flex items-center space-x-2">
        <Avatar class="ms-0.5 h-7 w-7 rounded-full">
          <AvatarImage :src="avatarUrl" alt="" />
          <AvatarFallback class="rounded-full"> {{ avatarFallbackName }} </AvatarFallback>
        </Avatar>
        <p class="leading-none text-center">{{ userName }}</p>
      </div>
    </div>
  </div>
</template>
