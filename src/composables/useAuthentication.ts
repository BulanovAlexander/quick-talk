import { ref } from 'vue'

import { supabase } from '@/supabase'
import type { User } from '@supabase/supabase-js'

interface SignUpPayload {
  username: string
  email: string
  password: string
}

interface SignInPayload {
  email: string
  password: string
}

interface UpdatePayload {
  [key: string]: any
}

const user = ref<User | null>(null)

const signUpWithEmailAndPassword = async ({ username, email, password }: SignUpPayload) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
          avatar_url: '',
        },
        emailRedirectTo: `${window.location.origin}/?fromEmail=registrationConfirmation`,
      },
    })

    if (error) throw error
  } catch (e: any) {
    throw e
  }
}

const signInWithEmailAndPassword = async ({ email, password }: SignInPayload) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  } catch (e: any) {
    throw e
  }
}

// TODO: сделать позже
const signInWithOAuth = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })

    if (error) throw error
  } catch (e: any) {
    throw e
  }
}

const updateUser = async (updateData: UpdatePayload) => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: { ...updateData },
    })

    if (error) throw error
  } catch (e: any) {
    throw e
  }
}

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error
  } catch (e: any) {
    throw e
  }
}

const isLoggedIn = () => {
  return !!user.value
}

const useAuthentication = () => {
  return {
    user,
    signOut,
    isLoggedIn,
    updateUser,
    signInWithOAuth,
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword,
  }
}

export default useAuthentication
