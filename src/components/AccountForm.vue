<script lang="ts" setup>
import * as z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { ref, watch, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { supabase } from '@/supabase'
import { Loader, Camera } from 'lucide-vue-next'

import useAuthentication from '@/composables/useAuthentication'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = toTypedSchema(
  z.object({
    username: z
      .string({ message: 'Введите имя' })
      .min(2, { message: 'От 2 символов' })
      .max(50, { message: 'Не более 50 символов' }),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const { user, updateUser } = useAuthentication()

const userName = computed(() => user.value?.user_metadata.full_name)
const avatarUrl = computed(() => user.value?.user_metadata.avatar_url)
const avatarFallbackName = computed<string>(() => {
  return userName.value
    .split(' ')
    .map((word: string) => word.charAt(0).toLocaleUpperCase())
    .slice(0, 2)
    .join('')
})

const error = ref<string>('')
const loading = ref<boolean>(false)
const uploading = ref<boolean>(false)

const fileInputRef = ref<HTMLInputElement | null>(null)
const files = ref<File | null>(null)

const uploadAvatar = () => {
  if (!fileInputRef.value) return
  fileInputRef.value.click()
}

const handleFileChange = async (event: Event) => {
  if (!user.value || !fileInputRef.value) return

  const target = event.target as HTMLInputElement
  files.value = target.files ? target.files[0] : null

  if (!files.value) {
    throw new Error('Вы должны выбрать изображение для загрузки.')
  }

  const file = files.value
  const fileExt = file.name.split('.').pop()
  const folderName = `${user.value.id}`

  try {
    uploading.value = true

    // Если у пользователя уже есть аватар, удаляем его
    if (avatarUrl.value) {
      const oldFileName = avatarUrl.value.split('/').pop()
      const filePath = `${folderName}/${oldFileName}`
      const { error: deleteError } = await supabase.storage.from('avatars').remove([filePath])

      if (deleteError) throw deleteError
    }

    // Загружаем новый аватар
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${folderName}/${fileName}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      upsert: true,
      metadata: {
        user_id: user.value.id,
      },
    })

    if (uploadError) throw uploadError

    // Получаем публичный URL загруженного файла
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    const publicUrl = data.publicUrl

    // Обновляем метаданные пользователя в Supabase Auth
    await updateUser({
      avatar_url: publicUrl,
    })
  } catch (error: any) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true

    updateUser({
      full_name: values.username,
    })
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

watch(
  () => user.value,
  (newUser) => {
    if (newUser && newUser.user_metadata.full_name) {
      form.setValues({
        username: newUser.user_metadata.full_name,
      })
    }
  },
  { immediate: true },
)
</script>

<template>
  <form v-if="user" @submit="onSubmit">
    <div class="space-y-3">
      <div class="flex justify-end">
        <Button size="sm" type="submit" :disabled="loading">
          <Loader v-if="loading" class="animate-spin" />
          Сохранить
        </Button>
      </div>

      <div class="flex items-start space-x-4">
        <FormField name="file">
          <FormItem>
            <div class="flex flex-col space-y-4">
              <div
                class="mx-auto relative rounded-full size-28 outline outline-border overflow-hidden md:mx-0"
              >
                <Avatar class="size-28">
                  <AvatarImage :src="avatarUrl" alt="" />
                  <AvatarFallback class="text-3xl">{{ avatarFallbackName }}</AvatarFallback>
                </Avatar>
                <Button
                  class="absolute -bottom-0.5 left-0 right-0 opacity-80"
                  variant="outline"
                  @click="uploadAvatar"
                >
                  <Loader v-if="uploading" class="animate-spin" />
                  <Camera v-else />
                </Button>
                <input
                  ref="fileInputRef"
                  class="invisible"
                  type="file"
                  accept=".jpeg, .jpg"
                  @change="handleFileChange"
                />
              </div>
            </div>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="w-full">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Ваше имя</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  class="h-8"
                  type="text"
                  placeholder="Имя"
                  required
                  :disabled="loading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </div>

      <template v-if="error">
        <p class="text-sm text-red-400">{{ error }}</p>
      </template>
    </div>
  </form>
  <div v-else class="flex justify-center py-6">
    <Loader class="animate-spin" />
  </div>
</template>
