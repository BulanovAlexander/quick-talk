import { supabase } from '@/supabase'
import type { Tables } from '../../database.types.ts'
import type { User } from '@supabase/supabase-js'

const getChatById = async (chatId: string) => {
  const { data, error } = await supabase.from('chats').select('*').eq('id', chatId).single()

  if (error) {
    console.error('Ошибка при получении чата:', error)
    throw error
  }

  return data
}

const createChat = async (currentUser: User, selectedUser: Tables<'users'>) => {
  const chatType = 'private'

  const { data: chat, error: chatError } = await supabase
    .from('chats')
    .insert({ type: chatType, created_by: currentUser.id })
    .select('id')
    .single()

  if (chatError) {
    console.error('Ошибка создания чата:', chatError)
    throw chatError
  }

  const chatId = chat?.id

  // Добавляем участников в чат
  const { error: membersError } = await supabase.from('chat_members').insert([
    { chat_id: chatId, user_id: currentUser.id, role: 'admin' },
    { chat_id: chatId, user_id: selectedUser.id, role: 'member' },
  ])

  if (membersError) {
    console.error('Ошибка добавления участников:', membersError)
    throw membersError
  }

  return chatId
}

const getChat = async (currentUser: User, selectedUser: Tables<'users'>) => {
  const { data: currentUserChats, error: currentUserError } = await supabase
    .from('chat_members')
    .select('chat_id')
    .eq('user_id', currentUser.id)

  if (currentUserError) {
    console.error('Ошибка при получении чатов для currentUserId:', currentUserError)
    throw currentUserError
  }

  // Если у currentUserId нет чатов, возвращаем null
  if (!currentUserChats || currentUserChats.length === 0) {
    return null
  }

  // Извлекаем массив chat_id для currentUserId
  const currentUserChatIds = currentUserChats.map((item) => item.chat_id)

  // Получаем все чаты, где selectedUserId является участником
  const { data: selectedUserChats, error: selectedUserError } = await supabase
    .from('chat_members')
    .select('chat_id')
    .eq('user_id', selectedUser.id)
    .in('chat_id', currentUserChatIds) // Ищем только те чаты, которые есть у currentUserId

  if (selectedUserError) {
    console.error('Ошибка при получении чатов для selectedUserId:', selectedUserError)
    throw selectedUserError
  }

  // Если есть общий чат, возвращаем его ID
  return selectedUserChats?.[0]?.chat_id || null
}

const getOrCreateChat = async (currentUser: User, selectedUser: Tables<'users'>) => {
  const existingChatId = await getChat(currentUser, selectedUser)

  if (existingChatId) {
    return existingChatId
  }

  return await createChat(currentUser, selectedUser)
}

const getChatMembers = async (chatId: string) => {
  const { data, error } = await supabase
    .from('chat_members')
    .select('user_id')
    .eq('chat_id', chatId)

  if (error) {
    console.error('Ошибка при получении участников чата:', error)
    throw error
  }

  return data
}

const getChatUser = async (userId: string) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()

  if (error) {
    console.error('Ошибка при получении профиля пользователя:', error)
    throw error
  }

  return data
}

const getMessagesByChatId = async (chatId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true }) // Сортировка по дате создания

  if (error) {
    console.error('Ошибка при получении сообщений:', error)
    throw error
  }

  return data
}

const sendChatMessage = async (chatId: string, userId: string, content: string) => {
  const { data, error } = await supabase.from('messages').insert({
    chat_id: chatId,
    user_id: userId,
    content,
  })

  if (error) {
    console.error('Ошибка отправки сообщения:', error)
    throw error
  }

  return data
}

const subscribeToMessages = (chatId: string, callback: (message: Tables<'messages'>) => void) => {
  const channel = supabase
    .channel(`chat-${chatId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        callback(payload.new as Tables<'messages'>)
      },
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        callback(payload.old as Tables<'messages'>)
      },
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` },
      (payload) => {
        callback(payload.new as Tables<'messages'>)
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export default function useChat() {
  return {
    getChat,
    createChat,
    getChatById,
    getChatUser,
    getChatMembers,
    getOrCreateChat,
    sendChatMessage,
    subscribeToMessages,
    getMessagesByChatId,
  }
}
