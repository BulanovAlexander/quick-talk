<script setup lang="ts">
import { ref, watchEffect } from 'vue'

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

import AppConfig from '@/components/AppConfig.vue'
import ChatAccount from '@/components/ChatAccount.vue'
import ChatUsers from '@/components/ChatUsers.vue'

import useAuthentication from '@/composables/useAuthentication'
import { supabase } from '@/supabase'
import type { Tables } from '../../database.types.ts'

const { user } = useAuthentication()

const users = ref<Tables<'users'>[]>([])

const getAllUsersExceptMe = async (userId: string) => {
  try {
    const { data, error } = await supabase.from('users').select('*').neq('id', userId) // Исключаем себя по ID

    if (error) throw error

    return data
  } catch (e: any) {
    console.error('Ошибка получения пользователей:', e)
    return []
  }
}

watchEffect(async () => {
  if (user.value) {
    users.value = await getAllUsersExceptMe(user.value.id)
  }
})
</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <AppConfig />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup class="h-full">
          <ScrollArea>
            <ChatUsers :users="users" />
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ChatAccount />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>

    <!-- основной контент -->
    <SidebarInset class="overflow-hidden">
      <div
        class="border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-sidebar"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
        </div>
      </div>

      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </SidebarInset>
  </SidebarProvider>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  transform: translateX(100%);
}
</style>
