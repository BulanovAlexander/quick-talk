<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
</script>

<template>
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical class="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="m-2">
        <DropdownMenuItem> Редактировать </DropdownMenuItem>
        <DropdownMenuItem> Удалить </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
