<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import ChatUser from '@/components/ChatUser.vue'

import type { Tables } from '../../database.types.ts'

interface Props {
  users: Tables<'users'>[]
}

defineProps<Props>()
</script>

<template>
  <div v-for="user in users" :key="user.id" class="my-1">
    <ChatUser :user="user" />
    <Separator />
  </div>
</template>
