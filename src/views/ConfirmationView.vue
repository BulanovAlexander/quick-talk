<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Rocket } from 'lucide-vue-next'

const route = useRoute()
</script>

<template>
  <div class="m-auto p-4">
    <Alert>
      <Rocket class="size-5" />

      <AlertTitle>Спасибо, что зарегистрировались!</AlertTitle>
      <AlertDescription>
        Подтвердите адрес электронной почты, чтобы завершить регистрацию:
        <p class="font-mono font-semibold text-primary">{{ route.query.email }}</p>
      </AlertDescription>
    </Alert>
  </div>
</template>
