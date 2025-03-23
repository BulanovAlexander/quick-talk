<script lang="ts" setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import SignInForm from '@/components/SignInForm.vue'
</script>

<template>
  <div class="m-auto p-4">
    <Card class="m-auto min-w-[326px]">
      <CardHeader class="text-center">
        <CardTitle>Вход в аккаунт</CardTitle>
        <CardDescription>Введите данные и продолжите работу.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter class="text-sm justify-center">
        Нет аккаунта? &nbsp;
        <RouterLink class="text-slate-500 hover:text-slate-800 transition" to="sign-up">
          Зарегистрируйтесь
        </RouterLink>
      </CardFooter>
    </Card>
  </div>
</template>
