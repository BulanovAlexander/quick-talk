<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import useChat from '@/composables/useChat'
import useAuthentication from '@/composables/useAuthentication'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ChatHeader from '@/components/ChatHeader.vue'
import ChatBoard from '@/components/ChatBoard.vue'

import type { Tables } from '../../database.types.ts'

const route = useRoute()
const chatId = computed(() => route.params.chatId as string)

const chat = ref<Tables<'chats'> | null>(null)
const interlocutor = ref<Tables<'users'> | null>(null) // Собеседник
const loading = ref(true)
const error = ref<string | null>(null)

const { user: currentUser } = useAuthentication()
const { getChatById, getChatMembers, getChatUser } = useChat()

const fetchChat = async () => {
  try {
    loading.value = true
    chat.value = await getChatById(chatId.value)
  } catch (err) {
    console.error('Ошибка при получении чата:', err)
    error.value = 'Не удалось загрузить данные чата'
  } finally {
    loading.value = false
  }
}

const fetchInterlocutor = async () => {
  try {
    loading.value = true
    const members = await getChatMembers(chatId.value)
    const interlocutorId = members.find(
      (member) => member.user_id !== currentUser.value?.id,
    )?.user_id

    if (!interlocutorId) {
      throw new Error('Собеседник не найден')
    }

    interlocutor.value = await getChatUser(interlocutorId)
  } catch (err) {
    console.error('Ошибка при поиске собеседника:', err)
    error.value = 'Не удалось найти собеседника'
  }
}

watchEffect(async () => {
  await fetchChat()
  await fetchInterlocutor()
  loading.value = false
})
</script>

<template>
  <div :key="chatId.toString()" class="absolute top-0 flex flex-col w-full h-full">
    <template v-if="error">
      <div class="m-auto p-2">
        <Alert variant="destructive">
          <AlertTitle>Упс!</AlertTitle>
          <AlertDescription> {{ error }} </AlertDescription>
        </Alert>
      </div>
    </template>
    <template v-else-if="!loading && interlocutor">
      <ChatHeader :user="interlocutor" />
      <ChatBoard :chat-id="chatId" />
    </template>
  </div>
</template>
