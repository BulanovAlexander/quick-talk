<script lang="ts" setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import SignUpForm from '@/components/SignUpForm.vue'
</script>

<template>
  <div class="m-auto p-4">
    <Card class="m-auto min-w-[326px]">
      <CardHeader class="text-center">
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>Пройдите регистрацию и начните работу.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter class="text-sm justify-center">
        Уже есть аккаунт? &nbsp;
        <RouterLink class="text-slate-500 hover:text-slate-800 transition" to="sign-in">
          Войдите</RouterLink
        >
      </CardFooter>
    </Card>
  </div>
</template>
