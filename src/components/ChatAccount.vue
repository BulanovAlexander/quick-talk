<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronsUpDown, LogOut, Settings2 } from 'lucide-vue-next'

import useAuthentication from '@/composables/useAuthentication'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebar, SidebarMenuButton } from '@/components/ui/sidebar'

const { openMobile, setOpenMobile } = useSidebar()
const router = useRouter()
const handleSettings = () => {
  if (openMobile.value) setOpenMobile(false)
  router.push('/account/')
}

const { user, signOut } = useAuthentication()

const error = ref<string>('')
const loading = ref<boolean>(false)
const handleLogOut = async () => {
  try {
    loading.value = true
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
  await signOut()
}

const userName = computed(() => user.value?.user_metadata.full_name)
const userEmail = computed(() => user.value?.email)
const avatarUrl = computed(() => user.value?.user_metadata.avatar_url)
const avatarFallbackName = computed<string>(() => {
  return userName.value
    .split(' ')
    .map((word: string) => word.charAt(0).toLocaleUpperCase())
    .slice(0, 2)
    .join('')
})
</script>

<template>
  <DropdownMenu v-if="user">
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <Avatar class="h-8 w-8 rounded-lg">
          <AvatarImage :src="avatarUrl" alt="" />
          <AvatarFallback class="rounded-lg"> {{ avatarFallbackName }}</AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">{{ userName }}</span>
          <span class="truncate text-xs">{{ userEmail }}</span>
        </div>
        <ChevronsUpDown class="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      side="bottom"
      align="end"
      :side-offset="4"
    >
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar class="h-8 w-8 rounded-lg">
            <AvatarImage :src="avatarUrl" alt="" />
            <AvatarFallback class="rounded-lg"> {{ avatarFallbackName }} </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">{{ userName }}</span>
            <span class="truncate text-xs">{{ userEmail }}</span>
          </div>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @click="handleSettings">
          <Settings2 />
          Настройки профиля
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        class="focus:bg-destructive focus:text-white"
        :disabled="loading"
        @click="handleLogOut"
      >
        <LogOut />
        Выход
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
