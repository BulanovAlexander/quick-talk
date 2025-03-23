<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronsUpDown, Settings2 } from 'lucide-vue-next'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebar, SidebarMenuButton } from '@/components/ui/sidebar'

const { openMobile, setOpenMobile } = useSidebar()
const router = useRouter()
const handleSettings = () => {
  if (openMobile.value) setOpenMobile(false)
  router.push('/settings/')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div class="flex aspect-square size-8 items-center justify-center">
          <Avatar class="h-8 w-8 rounded-none bg-inherit">
            <AvatarImage src="/images/chat.svg" alt="" />
            <AvatarFallback class="rounded-lg"> QT </AvatarFallback>
          </Avatar>
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">Quick Talk</span>
        </div>
        <ChevronsUpDown class="ml-auto" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      side="bottom"
      align="start"
      :side-offset="4"
    >
      <DropdownMenuItem class="gap-2 p-2" @click="handleSettings">
        <Settings2 />
        Настройки приложения
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
