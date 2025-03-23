<script setup lang="ts">
import { computed } from 'vue'

import ChatMessageMenu from '@/components/ChatMessageMenu.vue'

import type { Tables } from '../../database.types.ts'

interface Props {
  message: Tables<'messages'>
  owner: boolean
}

const props = defineProps<Props>()

const created_at = computed(() => new Date(props.message.created_at).toLocaleDateString())
</script>

<template>
  <div class="max-w-[75%] self-start m-1" :class="{ 'self-end': owner }">
    <div class="flex">
      <div>
        <p
          class="mb-1 flex items-center text-gray-400"
          :class="{ 'justify-start ': !owner, 'justify-end': owner }"
        >
          <span class="text-[8px] leading-[8px] mx-1">{{ created_at }}</span>
        </p>
        <div
          class="rounded-xl p-2 text-sm text-black"
          :class="{
            'rounded-ee-none bg-orange-200': owner,
            'rounded-es-none bg-zinc-200': !owner,
          }"
        >
          <span>{{ message.content }}</span>
        </div>
      </div>
      <ChatMessageMenu v-if="owner" class="self-end" />
    </div>
  </div>
</template>
