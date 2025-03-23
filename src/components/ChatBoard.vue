<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { CircleChevronDown, Bot } from 'lucide-vue-next'

import useAuthentication from '@/composables/useAuthentication'
import useChat from '@/composables/useChat'

import { ScrollArea } from '@/components/ui/scroll-area'
import ChatMessage from '@/components/ChatMessage.vue'
import ChatForm from '@/components/ChatForm.vue'

import type { Tables } from '../../database.types.ts'

const { user: currentUser } = useAuthentication()
const { getMessagesByChatId, subscribeToMessages } = useChat()

interface Props {
  chatId: string
}

const props = defineProps<Props>()

const TO_BOTTOM_OFFSET = 64
const scrollBoard = ref<HTMLElement | null>(null)
const scrolledToBottom = ref<boolean>(false)
const isScrollable = ref<boolean>(false)
const newMessagesCount = ref<number>(0)
const loading = ref(true)
const error = ref<string | null>(null)
const messages = ref<Tables<'messages'>[]>([])

const fetchMessages = async () => {
  try {
    loading.value = true
    messages.value = await getMessagesByChatId(props.chatId)
    await nextTick()
    setTimeout(() => {
      scrollToBottom(false)
      checkScrollable()
    }, 0)
  } catch {
    error.value = 'Не удалось загрузить сообщения чата'
  } finally {
    loading.value = false
  }
}

const checkScrollable = () => {
  if (!scrollBoard.value) return
  const { scrollHeight, clientHeight } = scrollBoard.value
  isScrollable.value = scrollHeight > clientHeight
}

const handleChatBoardScroll = () => {
  if (!scrollBoard.value) return

  const { scrollTop, scrollHeight, clientHeight } = scrollBoard.value
  scrolledToBottom.value = scrollTop >= scrollHeight - clientHeight - TO_BOTTOM_OFFSET

  if (scrolledToBottom.value) {
    newMessagesCount.value = 0
  }
}

const scrollToBottom = (smooth = false) => {
  if (!scrollBoard.value) return
  scrollBoard.value.scrollTo({
    top: scrollBoard.value.scrollHeight,
    behavior: smooth ? 'smooth' : 'auto',
  })
}

const handleNewMessage = (newMessage: Tables<'messages'>) => {
  messages.value.push(newMessage)
  nextTick(() => {
    if (newMessage.user_id === currentUser.value?.id || scrolledToBottom.value) {
      scrollToBottom(true)
    } else {
      newMessagesCount.value++
    }

    checkScrollable()
  })
}

let unsubscribe: any = null

onMounted(async () => {
  await fetchMessages()

  unsubscribe = subscribeToMessages(props.chatId, handleNewMessage)

  scrollBoard.value = document.querySelector('.chat-board > div')
  scrollBoard.value?.addEventListener('scroll', handleChatBoardScroll)
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  scrollBoard.value?.removeEventListener('scroll', handleChatBoardScroll)
})

const handleMessageSend = async () => {
  await nextTick()
  setTimeout(() => scrollToBottom(true), 0)
}
</script>

<template>
  <ScrollArea class="chat-board relative h-full" :class="{ 'overflow-hidden': loading }">
    <div class="scroll-content flex flex-col h-full justify-end gap-1 px-2 py-2">
      <template v-if="messages.length > 0">
        <ChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :owner="message.user_id === currentUser?.id"
        />
      </template>
      <template v-else>
        <div class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <div class="flex items-center space-x-2 opacity-60">
            <Bot class="size-6 -top-6 shrink-0" />
            <p class="text-sm">Напиши, чтобы начать!</p>
          </div>
        </div>
      </template>

      <div
        v-if="isScrollable && !scrolledToBottom"
        class="absolute bottom-2 left-1/2 -translate-x-1/2"
      >
        <button
          class="opacity-60 transition hover:opacity-100 focus:opacity-100"
          @click="scrollToBottom(true)"
        >
          <span
            v-if="newMessagesCount"
            class="rounded-sm px-3 py-2 text-sm text-white bg-slate-900"
          >
            Новых сообщений: {{ newMessagesCount }}
          </span>
          <CircleChevronDown v-else />
        </button>
      </div>
    </div>
  </ScrollArea>

  <div
    class="border-t flex shrink-0 items-center gap-2 transition-[width,height] ease-linear bg-sidebar"
  >
    <div class="w-full px-4 py-2">
      <ChatForm :chat-id="chatId" @on-submit="handleMessageSend" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-board > div > div {
  display: grid;
  height: 100%;
}
</style>
