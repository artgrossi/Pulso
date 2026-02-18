'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { IncomeRange } from '@/lib/types/database';

const VALID_INCOME_RANGES: IncomeRange[] = [
  'ate_2k', '2k_5k', '5k_10k', '10k_20k', 'acima_20k', 'prefiro_nao_dizer',
];

export interface UpdateProfileData {
  full_name: string;
  birth_date: string | null;
  income_range: IncomeRange | null;
}

export async function updateProfile(data: UpdateProfileData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Nao autenticado' };
  }

  const trimmedName = data.full_name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    return { error: 'Nome deve ter pelo menos 2 caracteres' };
  }

  if (trimmedName.length > 100) {
    return { error: 'Nome deve ter no maximo 100 caracteres' };
  }

  if (data.income_range && !VALID_INCOME_RANGES.includes(data.income_range)) {
    return { error: 'Faixa de renda invalida' };
  }

  if (data.birth_date) {
    const date = new Date(data.birth_date);
    if (isNaN(date.getTime())) {
      return { error: 'Data de nascimento invalida' };
    }
    const now = new Date();
    if (date > now) {
      return { error: 'Data de nascimento nao pode ser no futuro' };
    }
    const age = now.getFullYear() - date.getFullYear();
    if (age > 120) {
      return { error: 'Data de nascimento invalida' };
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: trimmedName,
      birth_date: data.birth_date || null,
      income_range: data.income_range || null,
    })
    .eq('id', user.id);

  if (error) {
    return { error: 'Erro ao atualizar perfil. Tente novamente.' };
  }

  revalidatePath('/perfil');
  return { success: true };
}

export async function updateEmail(newEmail: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Nao autenticado' };
  }

  const trimmed = newEmail.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) {
    return { error: 'Email invalido' };
  }

  if (trimmed === user.email) {
    return { error: 'O novo email deve ser diferente do atual' };
  }

  const { error } = await supabase.auth.updateUser({
    email: trimmed,
  });

  if (error) {
    return { error: 'Erro ao atualizar email. Tente novamente.' };
  }

  return { success: true, message: 'Um link de confirmacao foi enviado para o novo email.' };
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Nao autenticado' };
  }

  if (newPassword.length < 6) {
    return { error: 'Nova senha deve ter pelo menos 6 caracteres' };
  }

  // Verify current password by re-authenticating
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: 'Senha atual incorreta' };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: 'Erro ao alterar senha. Tente novamente.' };
  }

  return { success: true };
}

export async function deleteAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Nao autenticado' };
  }

  // Delete profile data (cascades should handle related tables)
  const { error: profileError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', user.id);

  if (profileError) {
    return { error: 'Erro ao excluir conta. Tente novamente.' };
  }

  // Sign out the user
  await supabase.auth.signOut();

  return { success: true };
}
