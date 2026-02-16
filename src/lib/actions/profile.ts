'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autenticado.' };
  }

  const fullName = formData.get('full_name') as string;

  if (!fullName || fullName.trim().length < 2) {
    return { error: 'O nome deve ter pelo menos 2 caracteres.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName.trim() })
    .eq('id', user.id);

  if (error) {
    return { error: 'Erro ao atualizar perfil. Tente novamente.' };
  }

  revalidatePath('/perfil');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autenticado.' };
  }

  // Verify current password by trying to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'Senha atual incorreta.' };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    if (/new password should be different/i.test(error.message)) {
      return { error: 'A nova senha deve ser diferente da atual.' };
    }
    return { error: 'Erro ao atualizar senha. Tente novamente.' };
  }

  return { success: true };
}
