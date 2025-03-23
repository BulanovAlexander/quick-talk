<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { SendHorizontal } from 'lucide-vue-next'

import { Textarea } from '@/components/ui/textarea'
import { FormControl, FormField, FormItem, FormDescription } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast/use-toast'

import useAuthentication from '@/composables/useAuthentication'
import useChat from '@/composables/useChat'

interface Props {
  chatId: string
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'on-submit'): void
}>()

const { toast } = useToast()
const form = useForm({})

const textareaRef = ref<{ $el: HTMLTextAreaElement } | null>(null)

const adjustHeight = async () => {
  if (textareaRef.value?.$el) {
    const el = textareaRef.value.$el
    el.style.height = 'auto'

    const maxHeight = window.innerHeight / 2
    // Если контент превышает maxHeight, ставим ограничение
    const newHeight = Math.min(el.scrollHeight, maxHeight)
    el.style.height = `${newHeight}px`
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const isCmdOrCtrl = event.metaKey || event.ctrlKey
  if (event.key === 'Enter' && isCmdOrCtrl) {
    onSubmit()
  }
}

const { user } = useAuthentication()
const { sendChatMessage } = useChat()

const onSubmit = form.handleSubmit(async (values) => {
  if (!values.text?.trim() || !user.value) return

  try {
    await sendChatMessage(props.chatId, user.value.id, values.text.trim())

    form.resetForm()
    if (textareaRef.value?.$el) {
      const el = textareaRef.value.$el
      el.style.height = 'initial'
    }

    emits('on-submit')
  } catch (error: any) {
    toast({
      title: 'Упс! Ошибка отправки сообщения.',
      description: `Code: ${error.code}, Message: ${error.message}`,
      variant: 'destructive',
    })
  }
})
</script>

<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="text">
      <FormItem>
        <FormControl>
          <div class="flex items-center space-x-1.5">
            <Textarea
              ref="textareaRef"
              v-bind="componentField"
              class="resize-none min-h-10"
              type="text"
              rows="1"
              placeholder="Напишите что-нибудь..."
              @input="adjustHeight"
              @keydown="handleKeyDown"
            />

            <Button class="shrink-0 min-w-10 min-h-10" variant="ghost" size="icon">
              <SendHorizontal class="!w-6 !h-6" stroke-width="1" />
            </Button>
          </div>

          <FormDescription class="hidden md:block">
            Для отправки сообщения используйте <strong>Cmd (⌘) + Enter</strong> (Mac) или
            <strong>Ctrl + Enter</strong> (Windows).
          </FormDescription>
        </FormControl>
      </FormItem>
    </FormField>
  </form>
</template>
