<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import useAuthentication from '@/composables/useAuthentication'
import useChat from '@/composables/useChat'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import type { Tables } from '../../database.types.ts'

interface Props {
  user: Tables<'users'>
}

const props = defineProps<Props>()

const router = useRouter()
const userEmail = computed(() => props.user.email)
const userName = computed(() => props.user.full_name || '')
const avatarUrl = computed(() => props.user.avatar_url || '')
const avatarFallbackName = computed<string>(() => {
  return userName.value
    .split(' ')
    .map((word: string) => word.charAt(0).toLocaleUpperCase())
    .slice(0, 2)
    .join('')
})

const { getOrCreateChat } = useChat()
const { user: currentUser } = useAuthentication()
const { openMobile, setOpenMobile } = useSidebar()

const handleGoToChat = async () => {
  if (!currentUser.value) return

  try {
    // Получить ID чата с собеседником
    const chatId = await getOrCreateChat(currentUser.value, props.user)

    router.push({
      name: 'chat',
      params: { chatId },
    })

    if (openMobile.value) setOpenMobile(false)
  } catch (error) {
    console.error('Failed to open or create chat:', error)
    // TODO: Можно добавить уведомление для пользователя
  }
}
</script>

<template>
  <Button class="my-1 w-full justify-start px-0" size="lg" variant="ghost" @click="handleGoToChat">
    <Avatar class="ms-0.5 h-7 w-7 rounded-full">
      <AvatarImage :src="avatarUrl" alt="" />
      <AvatarFallback class="rounded-full"> {{ avatarFallbackName }} </AvatarFallback>
    </Avatar>

    <div class="text-start">
      <p class="truncate">{{ userName }}</p>
      <p class="text-xs">{{ userEmail }}</p>
    </div>
  </Button>
</template>
