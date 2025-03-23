<script lang="ts" setup>
import { useRouter } from 'vue-router'
import * as z from 'zod'
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Eye, EyeClosed } from 'lucide-vue-next'

import useAuthentication from '@/composables/useAuthentication'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = toTypedSchema(
  z.object({
    username: z
      .string({ message: 'Введите имя' })
      .min(2, { message: 'От 2 символов' })
      .max(50, { message: 'Не более 50 символов' }),
    email: z.string({ message: 'Введите email' }).email({ message: 'Некорректный email' }),
    password: z.string({ message: 'Введите пароль' }).min(6, { message: 'Минимум 6 символов' }),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const router = useRouter()
const { signUpWithEmailAndPassword } = useAuthentication()

const error = ref<string>('')
const loading = ref<boolean>(false)
const onSubmit = form.handleSubmit(async (values) => {
  try {
    loading.value = true

    await signUpWithEmailAndPassword(values)

    router.push({
      name: 'confirmation',
      query: { email: values.email },
    })
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const type = ref<'password' | 'text'>('password')

const togglePasswordVisibility = () => {
  type.value = type.value === 'password' ? 'text' : 'password'
}
</script>

<template>
  <form @submit="onSubmit">
    <div class="mb-6 space-y-3">
      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormLabel>Ваше имя</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="text"
              placeholder="Имя"
              required
              :disabled="loading"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>Ваш Email</FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="email"
              placeholder="Email"
              required
              :disabled="loading"
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" name="password">
        <FormItem>
          <FormLabel>Ваш Пароль</FormLabel>
          <FormControl>
            <div class="relative">
              <Input
                v-bind="componentField"
                class="pe-12"
                :type="type"
                placeholder="Пароль"
                required
                :disabled="loading"
              />
              <span
                class="absolute end-2 inset-y-0 flex items-center justify-center px-2"
                @click.prevent="togglePasswordVisibility"
              >
                <EyeClosed v-if="type === 'password'" class="size-4" />
                <Eye v-else class="size-4" />
              </span>
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      </FormField>
      <template v-if="error">
        <p class="text-sm text-red-400">{{ error }}</p>
      </template>
    </div>
    <Button class="w-full" size="lg" type="submit" :disabled="loading"> Зарегистрироваться </Button>
  </form>
</template>
